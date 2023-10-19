"use client";

import { useContext, useEffect, useRef } from "react";
import Account from "./Account";
import { ToastContext } from "@/context/toast-context";
import { UserContext } from "@/context/user-context";
import { useModal, Modal } from "@/components/Modal";

const Login = () => {
  const { createToast } = useContext(ToastContext);
  const { loginUser, keys } = useContext(UserContext);
  const loginModal = useModal();

  const loginHandler = async () => {
    try {
      if (await loginUser()) {
        // console.log("Connected");
        createToast({ message: "Connected successfully", type: "success" });
      } else {
        createToast({ message: "Error connecting", type: "error" });
      }
    } finally {
      loginModal.hide();
    }
  };

  return (
    <>
      {keys?.publicKey ? (
        <Account pubkey={keys.publicKey} />
      ) : (
        <div className="w-full h-[100dvh] flex flex-col gap-8 justify-center items-center">
          <h1 className="font-bold text-xl">
            Welcome to Bitcoin Street Store!
          </h1>
          <button
            onClick={() => loginModal.show()}
            className="rounded px-6 py-2 bg-orange-600 text-white text-lg"
          >
            Login
          </button>
        </div>
      )}
      <Modal
        title="Login"
        isVisible={loginModal.isVisible}
        hide={loginModal.hide}
      >
        {typeof window !== "undefined" &&
        typeof window.nostr === "undefined" ? (
          <>
            <div className="mb-8">
              Install Alby or another Nostr extension and setup keys to login.{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://guides.getalby.com/overall-guide/alby-browser-extension/features/nostr"
                className="text-orange-800"
              >
                Learn more
              </a>
            </div>

            <a
              href="https://getalby.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded px-4 py-2 bg-orange-600 text-white"
            >
              Get Alby Extension
            </a>
          </>
        ) : (
          <>
            <div className="mb-8">
              You will be requested to confirm that you want to connect your
              Nostr identity with Bitcoin Street Store, and you will sign a
              message to enable access to the Bitcoin Street Store API.
            </div>
            <button
              className="rounded px-4 py-2 bg-orange-600 text-white"
              onClick={loginHandler}
            >
              Login with Nostr
            </button>
          </>
        )}
      </Modal>
    </>
  );
};

export default Login;
