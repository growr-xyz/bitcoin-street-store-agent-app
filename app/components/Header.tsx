"use client";

import Login from "./Login";

interface HeaderProps {
  title: string;
  backButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, backButton }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-orange-500 text-white">
      {backButton && <button className="bg-blue-500 p-2 rounded">Back</button>}
      <h1 className="text-xl">{title}</h1>
      <Login />
    </header>
  );
};

export default Header;
