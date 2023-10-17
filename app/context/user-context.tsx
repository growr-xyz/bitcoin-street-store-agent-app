"use client";

import {
  createContext,
  useState,
  useEffect,
  // Dispatch,
  // SetStateAction,
  useRef,
  useContext,
} from "react";
import { RelayContext } from "./relay-context";
import { ToastContext } from "./toast-context";
import { api } from "@/lib/axios";
import { Event } from "nostr-tools";

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
//   * The user profile details are retrieved from the active relay (event kind 0) and parsed
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

interface User {
  name: string;
  displayName?: string;
  about?: string;
  picture?: string;
  banner?: string;
  lud16?: string;
  website?: string;
}

const defaultKeys = {
  privateKey: "",
  publicKey: "",
};

export const UserContext = createContext<{
  keys: { privateKey: string; publicKey: string };
  user: User;
  // token: string;
  isUserLoading: boolean;
  isAuthenticated: boolean;
  // setKeys: Dispatch<SetStateAction<{ privateKey: string; publicKey: string }>>;
  // setUser: Dispatch<SetStateAction<any>>;
  // signToken: () => void;
  loginUser: () => Promise<boolean>;
  logoutUser: () => void;
}>({
  keys: { privateKey: "", publicKey: "" },
  user: { name: "" },
  isUserLoading: true,
  // token: "",
  isAuthenticated: false,
  // setKeys: () => defaultKeys,
  // setUser: () => {},
  // signToken: () => {},
  loginUser: () => Promise.resolve(false),
  logoutUser: () => {},
});

const UserProvider = ({ children }: any) => {
  // const [keys, setKeys] = useState(defaultKeys);
  const [profileMetadata, setProfileMetadata] = useState<Event>();
  const [keys, setKeys] = useState(defaultKeys);
  const [user, setUser] = useState<User>({ name: "" });
  // const [token, setToken] = useState("");
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { relayUrl, activeRelay, subscribe } = useContext(RelayContext);
  const { createToast } = useContext(ToastContext);
  const hasRun = useRef(false);

  // Returns the remaining time until the token has to be refreshed by signing a new NIP-98 event
  const getTokenRemainingTime = (token: string) => {
    // Get the expiry time (10 minutes after creation time)
    const validityTime = 600; // in seconds
    const createdAt = JSON.parse(atob(token.split(" ")[1]))?.created_at;
    // Renew 1 minute before expiration, or in 1 sec if not defined
    const expiryTime = createdAt ? createdAt + validityTime * 1000 : Date.now();
    const remainingTime = Math.max(expiryTime - Date.now(), 0);

    console.log(
      `Access token expires in ${(remainingTime / 1000).toFixed(
        0
      )} seconds, will renew in ${((remainingTime - 60000) / 1000).toFixed(0)}`
    );

    return remainingTime;
  };

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

      const remainingTime = getTokenRemainingTime(token);

      // Renew 1 minute before the expiration
      setTimeout(async () => {
        try {
          setIsUserLoading(true);
          console.warn("Token expired, to renew");

          // Check if authenticated just in case
          // if (isAuthenticated) {
          const isSigningOK = await signToken();
          if (isSigningOK) setIsAuthenticated(true);
          else {
            logoutUser();
            createToast({
              message: "Could not renew API access token",
              type: "warning",
            });
          }
          // }
        } finally {
          setIsUserLoading(false);
        }
      }, Math.max(remainingTime - 60000, 0));

      // TODO: Force logout in case of expiration?
    } else {
      sessionStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const signToken = async () => {
    // console.warn("signToken invoked!");
    try {
      if (typeof window.nostr === "undefined") {
        return false;
      }

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
      console.error("Error while signing API access token", e);
      setToken("");
      return false;
    }
  };

  const connectNostr = async () => {
    try {
      const publicKey = await nostr.getPublicKey();
      console.info("Public key retrieved", publicKey);
      setKeys({ ...keys, publicKey });
      setUser({ ...user, name: publicKey });

      localStorage.setItem("shouldReconnect", "true");

      // Lightning is not needed at this stage for the agent app, but keep the option
      // if (typeof window.webln !== "undefined") {
      //   await window.webln.enable();
      // }
      return publicKey;
    } catch (e) {
      console.error("Error connecting Nostr", e);
      return undefined;
    }
  };

  const parseProfileMetadata = (metadata: Event) => {
    console.log("Parsing profile metadata", metadata);
    const content = metadata?.content;
    if (content) {
      const contentObj = JSON.parse(content);
      setUser({
        name: contentObj.name ?? keys.publicKey, // Fall back to npub
        displayName: contentObj.display_name,
        about: contentObj.about,
        picture: contentObj.picture,
        banner: contentObj.banner,
        lud16: contentObj.lud16,
        website: contentObj.website,
      });
    }
  };

  const getProfileEvent = async (publicKey: string) => {
    console.log("Get profile event");
    let kinds = [0]; // Metadata only

    if (profileMetadata) {
      console.log("Cached events from context");
      parseProfileMetadata(profileMetadata);
    }

    if (kinds.length === 0) {
      return;
    }

    // let relayName = relayUrl.replace("wss://", "");

    const filter = {
      kinds,
      authors: [publicKey],
      limit: 5,
    };

    // let events: Event[] = [];

    const onEvent = (event: any) => {
      // event.relayUrl = relayUrl;
      // events.push(event);
      if (event.kind === 0) {
        console.log("Metadata event", event);
        // Kind 0 => set profile metadata
        setProfileMetadata(event);
        parseProfileMetadata(event);

        // Profile is set, set isUserLoading = false
        setIsUserLoading(false);
      }
    };

    const onEOSE = () => {
      // Not implemented
      // console.log("EOSE");
    };

    subscribe([relayUrl], filter, onEvent, onEOSE);
  };

  const orchestrateLogin = async (loadedToken?: string) => {
    console.info("Try to auto-reconnect! Using token?", loadedToken);

    setIsUserLoading(true);

    // 1. Get the Nostr npub
    const publicKey = await connectNostr();
    if (!publicKey) {
      logoutUser();
      createToast({
        message: "Could not retrieve Nostr public key",
        type: "warning",
      });
      return false;
    }

    // 2. Sign a token if there isn't already existing
    if (!loadedToken) {
      console.warn("No token found, sign a new one");
      const isTokenSigned = await signToken();
      if (!isTokenSigned) {
        createToast({
          message: "Could not sign API access token",
          type: "warning",
        });
        logoutUser();
        return false;
      }
    }

    // 3. Set isAuthenticated = true
    setIsAuthenticated(true);

    // 4. Load the profile (async, but non-blocking)
    await getProfileEvent(publicKey);

    // 5. Set isUserLoading = false (wait for 5 seconds due to profile events)
    setTimeout(() => {
      setIsUserLoading(false);
    }, 5000);

    return true;

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

  const loginUser = async () => {
    try {
      if (typeof window.nostr !== "undefined") {
        const result = await orchestrateLogin();

        return result;
      } else return false;
    } catch (e) {
      console.error("Error logging in", e);
      // Force state cleanup
      logoutUser();
      return false;
    }
  };

  const logoutUser = () => {
    try {
      console.warn("Logging out");
      setIsUserLoading(true);

      // Clean up
      localStorage.removeItem("shouldReconnect");
      setIsAuthenticated(false);
      setToken("");
      setKeys(defaultKeys);
      setUser({ name: "" });
    } finally {
      setIsUserLoading(false);
    }
  };

  // Auto-reconnect
  useEffect(() => {
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

      let tokenFromSession: string | null = sessionStorage.getItem("token");
      console.log(
        "UserContext useEffect [], token from session?",
        tokenFromSession
      );

      if (tokenFromSession) {
        const remainingTime = getTokenRemainingTime(tokenFromSession);
        // Only set if more than 10 sec remaining
        if (remainingTime > 10000) setToken(tokenFromSession);
        else tokenFromSession = null;
      }

      if (shouldReconnect === "true") {
        orchestrateLogin(tokenFromSession ?? undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relayUrl, activeRelay]);

  return (
    <UserContext.Provider
      value={{
        keys,
        // setKeys,
        user,
        // setUser,
        isUserLoading,
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
