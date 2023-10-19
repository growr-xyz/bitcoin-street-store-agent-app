import { FC, useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "@/context/user-context";
import { ToastContext } from "@/context/toast-context";
import Avatar from "./Avatar";

interface AccountProps {
  pubkey: string;
}

const Account: FC<AccountProps> = ({ pubkey }) => {
  const { user, isUserLoading, logoutUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const { createToast } = useContext(ToastContext);

  const ref = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !(ref.current as any).contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const logoutHandler = () => {
    localStorage.removeItem("shouldReconnect");
    logoutUser();
    createToast({ message: "Logged out", type: "success" });
    window.location.reload();
  };

  return (
    <>
      <div className="relative">
        <div
          tabIndex={0}
          className="flex flex-row gap-2 items-center w-8"
          onClick={() => setIsOpen(true)}
        >
          <Avatar
            src={isUserLoading ? undefined : user.picture}
            className="w-8 h-8 text-stone-600 border border-stone-200"
          />
        </div>
        {isOpen && (
          <div
            ref={ref}
            className="absolute right-0 top-10 bg-white p-4 shadow rounded-lg flex flex-col items-start justify-start text-black gap-1 w-52"
          >
            <button className="w-full text-left" onClick={logoutHandler}>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
