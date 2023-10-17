"use client";

import { useContext } from "react";
import Header from "@/components/Header";
import { UserContext } from "./context/user-context";
import { useMerchants } from "./lib/services";

const Landing: React.FC = () => {
  const { isAuthenticated } = useContext(UserContext);

  return (
    <div>
      {isAuthenticated ? (
        <Header title="Welcome!" />
      ) : (
        <Header title="Bitcoin Street Store" />
      )}
    </div>
  );
};

export default Landing;
