"use client";

import { FC, ReactNode } from "react";
import RelayProvider from "./relay-context";
import UserProvider from "./user-context";
import KeysProvider from "./keys-context";
import ToastProvider from "./toast-context";

const Providers: FC<{ children: ReactNode }> = ({ children }) => (
  <RelayProvider>
    <UserProvider>
      <ToastProvider>
        <KeysProvider>{children}</KeysProvider>
      </ToastProvider>
    </UserProvider>
  </RelayProvider>
);

export default Providers;
