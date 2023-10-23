"use client";

import { useContext } from "react";
import Header from "@/components/Header";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";
import EditMerchant from "../EditMerchant";

const InvitePage: React.FC = () => {
  const { isUserLoading, isAuthenticated } = useContext(UserContext);
  const router = useRouter();

  if (!isUserLoading && !isAuthenticated) router.push("/", { scroll: false });

  return (
    <div>
      <Header title="Invite a merchant" backLink={true} backLinkHref="/" />

      {isAuthenticated && <EditMerchant />}
    </div>
  );
};

export default InvitePage;
