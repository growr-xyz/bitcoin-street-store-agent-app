"use client";

import { useContext, useEffect } from "react";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";
import FullPageLoader from "./FullPageLoader";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isUserLoading, isAuthenticated } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) router.push("/");
  }, [isUserLoading, isAuthenticated, router]);

  return (
    <>{isUserLoading ? <FullPageLoader /> : isAuthenticated && children}</>
  );
};

export default PageWrapper;
