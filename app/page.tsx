"use client";

import { useContext, useEffect, useState } from "react";
import Header from "@/components/Header";
import { ToastContext } from "./context/toast-context";

const Landing: React.FC = () => {
  return (
    <div>
      <Header title="Landing" />
      <div className="p-6"></div>
    </div>
  );
};

export default Landing;
