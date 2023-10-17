"use client";

import { FC, ReactNode } from "react";
import RelayProvider from "./relay-context";
import UserProvider from "./user-context";
import ToastProvider from "./toast-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Providers: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <RelayProvider>
      <UserProvider>
        <ToastProvider>{children}</ToastProvider>
      </UserProvider>
    </RelayProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>
);

export default Providers;
