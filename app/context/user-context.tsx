"use client";

import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { api } from "@/lib/axios";

//
// UserContext: manages the user state & authentication lifecycle
//
// 1. Login
//   * Initially, the user is not logged in
//   * They click on the login/connect with Nostr buttons, which initiates the login process
//   * The npub is retrieved after user confirmation in Alby => the user can refuse connection,
//     which will cause an error and we go back to the initial state
//   * A local storage item shouldReconnect is set
//   * The next step is to get the user sign a NIP-98 authorization token (event kind 27235); once signed,
//     the token is formed and stored in the session storage, as well as attached in the axios default headers
//     => the user can refuse to sign, which will cause an error and we go back to the initial state
//   * The user is set as authenticated (a flag for the UI)
//   * TODO: Note that the user details (user/setUser) are currently retrieved & set in the Account component,
//     we may move this here, too
//
// 2. Auto-login if the user refreshes the browser or re-opens the app after closing
//   * If the shouldReconnect local storage item is set, initiate auto-login
//   * If the token session storage item is set, load it
//
// 3. Renew NIP-98 authorization token
//   * A setTimeout function is executed when the token expires to sign a new one
//
// 4. Logout
//   * The state is reset to the initial values
//

const defaultKeys = {
  privateKey: "",
  publicKey: "",
};

export const UserContext = createContext<{
  keys: { privateKey: string; publicKey: string };
  user: any; // Check if we have a type in nostr-tools
  // token: string;
  isAuthenticated: boolean;
  // setKeys: Dispatch<SetStateAction<{ privateKey: string; publicKey: string }>>;
  setUser: Dispatch<SetStateAction<any>>;
  // signToken: () => void;
  loginUser: () => Promise<boolean>;
  logoutUser: () => void;
}>({
  keys: { privateKey: "", publicKey: "" },
  user: {},
  // token: "",
  isAuthenticated: false,
  // setKeys: () => defaultKeys,
  setUser: () => {},
  // signToken: () => {},
  loginUser: () => Promise.resolve(false),
  logoutUser: () => {},
});

const UserProvider = ({ children }: any) => {
  const [keys, setKeys] = useState(defaultKeys);
  const [user, setUser] = useState({});
  // const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasRun = useRef(false);

  const setToken = (token: string) => {
    // Set the token to session storage, axios & create the expiration callback
    if (token) {
      console.log("Token is set:", token);

      // Save to session storage
      sessionStorage.setItem("token", token);

      // Set axios headers
      api.defaults.headers.common["Authorization"] = token;
      console.log(
        "Axios header set to",
        api.defaults.headers.common["Authorization"]
      );

      // Get the expiry time (10 minutes after creation time)
      const expiryTime =
        JSON.parse(atob(token.split(" ")[1]))?.created_at + 10 * 60 * 1000;
      console.log("Expires in", expiryTime - Date.now());

      // Create an expiration callback
      setTimeout(
        async () => {
          setIsAuthenticated(false);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("token", "");
          }
          // Request signing again
          if (keys.publicKey) {
            const isSigningOK = await signToken();
            if (isSigningOK) setIsAuthenticated(true);
            else logoutUser();
          }
        },
        expiryTime ? expiryTime - Date.now() : 1000 // Default renew in 1 sec
      );
    } else {
      sessionStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const signToken = async () => {
    // console.warn("signToken invoked!");
    try {
      const event = {
        created_at: Date.now(),
        kind: 27235,
        content: "",
        tags: [
          ["u", process.env.NEXT_PUBLIC_BSS_API], // Base URL
          ["method", "*"], //
        ],
      };
      const signed = await window.nostr.signEvent(event);
      console.log("Signed 27235 authorization message", signed);
      const signedBase64 = btoa(JSON.stringify(signed));
      // return signedBase64;
      // console.log("Signed 27235 authorization message - base64", signedBase64);
      setToken(`Nostr ${signedBase64}`);
      return true;
    } catch (e) {
      console.error("Error while signing token", e);
      setToken("");
      return false;
    }
  };

  const connectNostr = async () => {
    try {
      const publicKey = await nostr.getPublicKey();
      console.info("Public key retrieved", publicKey);
      setKeys({ ...keys, publicKey });

      localStorage.setItem("shouldReconnect", "true");

      // Lightning is not needed at this stage for the agent app, but keep the option
      // if (typeof window.webln !== "undefined") {
      //   await window.webln.enable();
      // }
      return true;
    } catch (e) {
      console.error("Error connecting Nostr", e);
      return false;
    }
  };

  const loginUser = async () => {
    try {
      if (typeof window.nostr !== "undefined") {
        // 1. Get the Nostr npub
        const isNostrConnected = await connectNostr();
        if (!isNostrConnected) {
          logoutUser();
          return false;
        }

        // 2. Sign a token
        const isTokenSigned = await signToken();
        if (!isTokenSigned) {
          logoutUser();
          return false;
        }

        // 3. Everything is OK so far, set isAuthenticated = true
        setIsAuthenticated(true);

        return true;
      } else return false;
    } catch (e) {
      console.error("Error logging in", e);
      // Force state cleanup
      logoutUser();
      return false;
    }
  };

  const logoutUser = () => {
    console.warn("Logging out");
    localStorage.removeItem("shouldReconnect");
    setIsAuthenticated(false);
    setToken("");
    setKeys(defaultKeys);
    setUser({});
  };

  // Auto-reconnect
  useEffect(() => {
    const reconnect = async (loadedToken?: string) => {
      console.info("Try to auto-reconnect! Using token?", loadedToken);

      // 1. Get the Nostr npub
      const isNostrConnected = await connectNostr();
      if (!isNostrConnected) {
        logoutUser();
        return false;
      }

      // 2. Sign a token if there isn't already existing
      if (!loadedToken) {
        console.warn("No token found, sign a new one");
        const isTokenSigned = await signToken();
        if (!isTokenSigned) {
          logoutUser();
          return false;
        }
      }

      // 3. Set isAuthenticated = true
      setIsAuthenticated(true);

      // let enabled = false;
      // if (typeof window.nostr === "undefined") {
      //   return;
      // }

      // await loginUser();

      // Lightning is not needed at this stage for the agent app, but keep the option
      // if (typeof window.webln === "undefined") {
      //   return;
      // }

      // if (shouldReconnect === "true" && !webln.executing) {
      //   try {
      //     enabled = await window.webln.enable();
      //     setIsLightningConnected(true);
      //   } catch (e: any) {
      //     console.log(e.message);
      //   }
      // }

      // return enabled;
    };

    if (
      !hasRun.current &&
      typeof window !== "undefined" &&
      typeof window.nostr !== "undefined"
    ) {
      // Run once
      // console.log("UserContext useEffect [] run once");
      hasRun.current = true;

      const shouldReconnect = localStorage.getItem("shouldReconnect");
      console.log(
        "UserContext useEffect [], shouldReconnect?",
        !!shouldReconnect
      );

      const tokenFromSession = sessionStorage.getItem("token");
      console.log(
        "UserContext useEffect [], token from session?",
        tokenFromSession
      );
      if (tokenFromSession) {
        const expiryTime = tokenFromSession.split(" ")[1]
          ? JSON.parse(atob(tokenFromSession.split(" ")[1]))?.created_at +
            10 * 60 * 1000
          : Date.now();
        if (expiryTime && expiryTime - Date.now() > 0)
          setToken(tokenFromSession);
      }

      if (shouldReconnect === "true") {
        reconnect(tokenFromSession ?? undefined);
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        keys,
        // setKeys,
        user,
        setUser,
        isAuthenticated,
        // token,
        // signToken,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
