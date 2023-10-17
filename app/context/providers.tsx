"use client";

import { FC, ReactNode } from "react";
import RelayProvider from "./relay-context";
import UserProvider from "./user-context";
import KeysProvider from "./keys-context";
import ToastProvider from "./toast-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Providers: FC<{ children: ReactNode }> = ({ children }) => (
  <RelayProvider>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ToastProvider>
          <KeysProvider>{children}</KeysProvider>
        </ToastProvider>
      </UserProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </RelayProvider>
);

export default Providers;
