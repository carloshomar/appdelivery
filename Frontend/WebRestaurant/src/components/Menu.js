import React, { useState } from "react";
import {
  FiBox,
  FiEye,
  FiEyeOff,
  FiHardDrive,
  FiHome,
  FiPower,
  FiSettings,
} from "react-icons/fi";
import { FaStore, FaStoreSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import ToggleSwitch from "../components/ToggleSwitch";
import { toast } from "react-toastify";
import Texts from "../constants/Texts";

import api from "../services/api";
import { MdPerson, MdPersonOutline } from "react-icons/md";

const TopMenu = ({ toggleMenu, isOpen }) => {
  const { getUser, openEstablishment, refreshOpenawait } = useAuth();
  const user = getUser();

  const handlerBnt = async (res) => {
    try {
      await api.put("/api/auth/establishments/status/handler/" + user.id);
      await refreshOpenawait();
    } catch (e) {
      console.log(e);
    }
    if (res && openEstablishment) toast.success(Texts.establishment_open);
    else toast.error("Seu estabelecimento foi fechado.");
  };

  return (
    <div className="bg-menu1 text-white py-4">
      <div className="mx-auto flex justify-between items-center px-4">
        <div className="text-xl font-bold">{getUser()?.establishment_name}</div>

        <div className="flex items-center w-auto gap-16">
          <div className="flex row justify-center items-center gap-2 w-20">
            <div>
              <FaStoreSlash color={"white"} size={24} />
            </div>
            <div className="ml-2">
              <ToggleSwitch checked={openEstablishment} onChange={handlerBnt} />
            </div>
            <div>
              <FaStore color="white" size={24} />
            </div>
          </div>

          <div>
            {isOpen ? (
              <FiEye className="h-6 w-6  cursor-pointer" onClick={toggleMenu} />
            ) : (
              <FiEyeOff
                className="h-6 w-6 cursor-pointer"
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SideMenu = ({ isOpen }) => {
  const { logout } = useAuth();
  const MENUS = [
    {
      title: Texts.meus_pedidos,
      href: "/",
      icon: (
        <FiHome className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`} />
      ),
    },
    {
      title: "Gestor de Cardápio",
      href: "/gestor-cardapio",
      icon: (
        <FiBox className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`} />
      ),
    },

    {
      title: "Relatórios",
      icon: (
        <FiHardDrive
          className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`}
        />
      ),
    },
    {
      title: "Ajustes",
      href: "/perfil",
      icon: (
        <FiSettings
          className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`}
        />
      ),
    },
    {
      title: "Sair",
      bottom: true,
      icon: (
        <FiPower className={`h-6 w-6 ${isOpen ? "mr-4" : ""} cursor-pointer`} />
      ),
      onPress: logout,
    },
  ];
  return (
    <div
      className={`fixed bg-menu2 text-white h-screen  ${
        isOpen ? "w-60" : "w-25"
      } flex flex-col`}
    >
      <div className="text-xl font-bold py-4 px-6"></div>
      <ul className="mt-8">
        {MENUS.map((i) => (
          <li
            className={`mb-6 flex items-center ${i.bottom ? "mt-14" : ""} ${
              isOpen ? "justify-start ml-4" : "justify-center"
            }`}
            onClick={() =>
              i.onPress ? i.onPress() : (window.location.href = i.href || "#")
            }
          >
            {i.icon}
            {isOpen && (
              <a
                href={i.href || "#"}
                className="hover:text-gray-400 font-bold ml-2"
              >
                {i.title}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MenuLayout = ({ children }) => {
  const tagitem = "ISOPEN";
  const getItem = localStorage.getItem(tagitem);
  const [isOpen, setIsOpen] = useState(getItem ? getItem == "true" : false);

  const toggleMenu = () => {
    const res = !isOpen;
    setIsOpen(res);
    localStorage.setItem(tagitem, JSON.stringify(res));
  };

  return (
    <div className="flex flex–row">
      <div className={isOpen ? "mr-60" : "mr-10"}>
        <SideMenu isOpen={isOpen} />
      </div>

      <div className="w-full">
        <TopMenu toggleMenu={toggleMenu} isOpen={isOpen} />

        <div
          className={`w-full overflow-x-hidden mx-auto mt-4 justify-center mb-4`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MenuLayout;
