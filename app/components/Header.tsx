"use client";

import Login from "./Login";

interface HeaderProps {
  title: string;
  backButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, backButton }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-stone-200 text-stone-900">
      {backButton && <button className="bg-stone-200 p-2 rounded">Back</button>}
      <h1 className="text-xl font-bold">{title}</h1>
      <Login />
    </header>
  );
};

export default Header;
