import React, { useState } from "react";
import {
  FiBox,
  FiHardDrive,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPaperclip,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const TopMenu = ({ toggleMenu, isOpen }) => {
  const { user } = useAuth();
  return (
    <div className="bg-customRed2 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold ml-4">
          {user?.establishment?.name}
        </div>
        <div className="flex items-center">
          {isOpen ? (
            <FiX className="h-6 w-6 mr-4 cursor-pointer" onClick={toggleMenu} />
          ) : (
            <FiMenu
              className="h-6 w-6 mr-4 cursor-pointer"
              onClick={toggleMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SideMenu = ({ isOpen }) => {
  const { logout } = useAuth();
  const MENUS = [
    {
      title: "Inicio",
      icon: (
        <FiHome className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`} />
      ),
    },
    {
      title: "Cardápio",
      icon: (
        <FiBox className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`} />
      ),
    },
    {
      title: "Extrato",
      icon: (
        <FiHardDrive
          className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`}
        />
      ),
    },
    {
      title: "Sair",
      icon: (
        <FiLogOut
          className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`}
        />
      ),
      onPress: logout,
    },
  ];
  return (
    <div
      className={`bg-customRed text-white h-screen  ${
        isOpen ? "w-52" : "w-25"
      } flex flex-col   }`}
    >
      <div className="text-xl font-bold py-4 px-6"></div>
      <ul className="mt-8">
        {MENUS.map((i) => (
          <li
            className={`mb-6 flex  items-center ${
              !isOpen ? "justify-center" : "justify-start ml-4"
            }`}
            onClick={() => (i.onPress ? i.onPress() : null)}
          >
            {i.icon}
            {isOpen ? (
              <a href="#" className="hover:text-gray-400 font-bold">
                {i.title}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MenuLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex ">
      <SideMenu isOpen={isOpen} />
      <div className="flex-grow">
        <TopMenu toggleMenu={toggleMenu} isOpen={isOpen} />
        <div className="container mx-auto py-8">{children}</div>
      </div>
    </div>
  );
};

export default MenuLayout;
