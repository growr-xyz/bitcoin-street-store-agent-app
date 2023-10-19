"use client";

import Login from "./Login";
import Link from "next/link";
import { Back } from "@/icons";

interface HeaderProps {
  title: string;
  backButton?: boolean;
  backButtonOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  backLink?: boolean;
  backLinkHref?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  backButton,
  backButtonOnClick,
  backLink,
  backLinkHref,
}) => {
  return (
    <header className="flex items-center justify-between p-4 bg-stone-200 text-stone-900 sticky top-0">
      {backButton && backButtonOnClick ? (
        <button
          onClick={backButtonOnClick}
          className="bg-stone-200 rounded-full"
        >
          <Back />
        </button>
      ) : backLink && backLinkHref ? (
        <Link href={backLinkHref} className="bg-stone-200 rounded-full">
          <Back />
        </Link>
      ) : (
        <div></div>
      )}
      <h1 className="text-xl font-bold overflow-hidden overflow-ellipsis whitespace-nowrap mx-2">
        {title}
      </h1>
      <Login />
    </header>
  );
};

export default Header;
