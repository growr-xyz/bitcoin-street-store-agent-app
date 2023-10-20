"use client";

import { X } from "@/icons";
import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useMeasure from "react-use-measure";

interface ModalProps {
  children: React.ReactNode;
  isVisible: boolean;
  title: string;
  hide: () => void;
}

export const Modal: FC<ModalProps> = ({ children, title, isVisible, hide }) => {
  const [ref] = useMeasure();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const eventCb = (e: any) => {
      if (e.key === "Escape") {
        hide();
      }
    };

    document.addEventListener("keydown", eventCb);

    return () => {
      document.removeEventListener("keydown", eventCb);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  const content = (
    <>
      {isVisible ? (
        <>
          <div className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-hidden bg-black bg-opacity-50 z-50"></div>
          <div className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-hidden flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg sm:rounded-2xl overflow-y-auto w-full h-screen md:max-w-xl md:h-fit md:max-h-[90vh]">
              <div className="p-3 sm:p-8" ref={ref}>
                <div
                  className="absolute top-6 right-8 w-6 h-6 cursor-pointer"
                  onClick={hide}
                >
                  <X className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                {children}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
  return mounted ? createPortal(content, document.body) : null;
};

export type UseModalProps = {
  defaultState: boolean;
};

export type ModalControls = {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
};

export const useModal = (
  { defaultState }: UseModalProps = { defaultState: false }
): ModalControls => {
  const [isVisible, setIsVisible] = useState(defaultState);

  const hide = () => {
    setIsVisible(false);
  };

  const show = () => {
    setIsVisible(true);
  };

  const toggle = () => {
    setIsVisible((prev) => !prev);
  };

  return {
    isVisible,
    show,
    hide,
    toggle,
  };
};
