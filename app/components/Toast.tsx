"use client";

import { useContext } from "react";
import { ToastContext } from "@/context/toast-context";

const typeClasses = {
  info: "bg-sky-600 text-white",
  success: "bg-green-600 text-white",
  warning: "bg-amber-600 text-white",
  error: "bg-red-600 text-white",
};

const Toast = () => {
  const { toasts, clearToast } = useContext(ToastContext);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-2 inline-flex flex-col items-center space-y-2 z-50 pointer-events-none">
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
