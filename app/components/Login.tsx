"use client";

import { useContext, useEffect, useId, useState } from "react";
import { KeysContext } from "@/context/keys-context";
import Account from "./Account";
import { ToastContext } from "@/context/toast-context";
import { useModal, Modal } from "@/components/Modal";
import { api } from "@/lib/axios";

const Login = () => {
  const { keys, setKeys } = useContext(KeysContext);
  // const [isLightningConnected, setIsLightningConnected] = useState(false);
  const { createToast } = useContext(ToastContext);
  const loginModal = useModal();

  useEffect(() => {
    const shouldReconnect = localStorage.getItem("shouldReconnect");

    // console.log("useEffect [setKeys], shouldReconnect?", shouldReconnect);

    const getConnected = async (shouldReconnect: string) => {
      let enabled = false;

      // console.log("getConnected", window.nostr);

      if (typeof window.nostr === "undefined") {
        return;
      }

      if (shouldReconnect === "true") {
        const publicKey = await nostr.getPublicKey();
        setKeys((keys) => ({ ...keys, publicKey }));
        // console.log("setKeys", publicKey);
      }

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

      return enabled;
    };

    if (shouldReconnect === "true") {
      getConnected(shouldReconnect);
    }
  }, [setKeys]);

  const loginHandler = async () => {
    if (typeof window.nostr !== "undefined") {
      const publicKey = await nostr.getPublicKey();
      setKeys((keys) => ({ ...keys, publicKey }));
      localStorage.setItem("shouldReconnect", "true");

      // TODO: When the user needs to sign another 27235 message?
      const event = {
        created_at: Date.now(),
        kind: 27235,
        content: "",
        tags: [
          ["u", process.env.NEXT_PUBLIC_BSS_API],
          ["method", "GET"],
        ],
      };
      const signed = await window.nostr.signEvent(event);
      console.log("Signed 27235 authorization message", signed);
      const signedBase64 = btoa(JSON.stringify(signed));
      console.log("Signed 27235 authorization message - base64", signedBase64);
      api.defaults.headers.common["Authorization"] = `Nostr ${signedBase64}`;
    }

    // Lightning is not needed at this stage for the agent app, but keep the option
    // if (typeof window.webln !== "undefined") {
    //   await window.webln.enable();
    // }

    console.log("Connected and authorization header set");
    createToast({ message: "Connected successfully", type: "success" });
    // setIsLightningConnected(true);
  };

  return (
    <>
      {
        /*isLightningConnected &&*/ keys?.publicKey ? (
          <Account pubkey={keys.publicKey} />
        ) : (
          <>
            <button onClick={() => loginModal.show()} className="outline">
              Login
            </button>
            <Modal
              title="Login"
              isVisible={loginModal.isVisible}
              hide={loginModal.hide}
            >
              {typeof window !== "undefined" &&
              typeof window.nostr === "undefined" ? (
                <>
                  <p className="py-4">
                    Install Alby Extension and setup keys to Login
                  </p>
                  <a
                    href="https://getalby.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-active btn-block"
                  >
                    Get Alby Extension
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://guides.getalby.com/overall-guide/alby-browser-extension/features/nostr"
                    className="link text-center block mt-2 font-bold text-sm"
                  >
                    Learn more
                  </a>
                </>
              ) : (
                <>
                  <p>
                    You will be requested to confirm that you want to connect
                    your Nostr identity with Bitcoin Street Store, and you will
                    sign a message to enable access to the Bitcoin Street Store
                    API.
                  </p>
                  <button
                    className="btn btn-outline btn-block"
                    onClick={loginHandler}
                  >
                    {/* {isLightningConnected
                      ? "Connected" 
                      : "*/}
                    Login with Extension
                    {/*" }*/}
                  </button>
                </>
              )}
            </Modal>
          </>
        )
      }
    </>
  );
};

export default Login;
