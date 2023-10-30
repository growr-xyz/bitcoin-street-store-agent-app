"use client";

import { useContext, useEffect } from "react";
// import Header from "@/components/Header";
import { UserContext } from "@/context/user-context";
// import MerchantList from "./MerchantList";
import Login from "@/components/Login";
// import PageWrapper from "@/components/PageWrapper";
import { useRouter } from "next/navigation";

const LandingPage: React.FC = () => {
  const { isAuthenticated, isUserLoading, user, keys } =
    useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && isAuthenticated) {
      console.log("user logged in", user);
      router.push("/merchants");
    }
  }, [router, isUserLoading, user, isAuthenticated]);

  return (
    <div>
      {!isAuthenticated && !isUserLoading && (
        <>
          <Login />
        </>
      )}
      {/* {(isUserLoading || isAuthenticated) && (
        <PageWrapper>
          <Header
            title={`Welcome, ${
              user.displayName || user.name || keys.publicKey
            }!`}
          />
          <MerchantList />
        </PageWrapper>
      )} */}
    </div>
  );
};

export default LandingPage;
