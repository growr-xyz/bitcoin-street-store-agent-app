"use client";

import { useContext } from "react";
import { ToastContext } from "@/context/toast-context";

const typeClasses = {
  info: "bg-sky-200 text-sky-800",
  success: "bg-green-200 text-green-800",
  warning: "bg-amber-200 text-amber-800",
  error: "bg-red-200 text-red-800",
};

const Toast = () => {
  const { toasts, clearToast } = useContext(ToastContext);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 inline-flex flex-col items-center space-y-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          className={`py-2 px-4 rounded pointer-events-auto ${
            typeClasses[toast.type]
          }`}
          onClick={() => clearToast(toast.id)}
        >
          <span>{toast.message}</span>
        </button>
      ))}
    </div>
  );
};

export default Toast;
