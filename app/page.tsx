"use client";

import { useContext } from "react";
import Header from "@/components/Header";
import { UserContext } from "@/context/user-context";
import MerchantList from "./MerchantList";
import Login from "@/components/Login";
import PageWrapper from "@/components/PageWrapper";

const LandingPage: React.FC = () => {
  const { isAuthenticated, isUserLoading, user, keys } =
    useContext(UserContext);

  return (
    <div>
      {!isAuthenticated && !isUserLoading && (
        <div>
          <Login />
        </div>
      )}
      {(isUserLoading || isAuthenticated) && (
        <PageWrapper>
          <Header
            title={`Welcome, ${
              user.displayName || user.name || keys.publicKey
            }!`}
          />
          <MerchantList />
        </PageWrapper>
      )}
    </div>
  );
};

export default LandingPage;
