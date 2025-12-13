import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import AxiosClient from '../AxiosClient';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUserContext();

  // useEffect(() => {
  //   AxiosClient.get('/user').then(({ data }) => {
  //     console.log(data);
  //     setUser(data);
  //   });
  // }, []);

  return (
    <div className="px-5 mx-auto max-w-[1366px] max-md:max-w-[640px] max-lg:max-w-[768px] max-xl:max-w-[1280px] overflow-hidden">
      <nav className="flex justify-between items-center h-[100px]">
        <div className="left flex-1 flex items-center gap-12 max-md:gap-10">
          <Link
            className="logo flex items-center font-bold text-xl max-lg:text-lg gap-2.5 hover:scale-105 transition duration-300 eas"
            to="/"
          >
            <img src="/public/logo.png" alt="" className="w-7" />
            <span className="max-lg:hidden max-md:block">LamaEstate</span>
          </Link>
          <Link
            href="#"
            className="hover:scale-105 transition duration-300 ease rounded-md max-md:hidden"
            to="/"
          >
            Home
          </Link>
          <Link
            href="#"
            className="hover:scale-105 transition duration-300 ease rounded-md max-md:hidden"
            to="/about"
          >
            About
          </Link>
          <Link
            href="#"
            className="hover:scale-105 transition duration-300 ease rounded-md max-md:hidden"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="hover:scale-105 transition duration-300 ease rounded-md max-md:hidden"
          >
            Agents
          </Link>
        </div>
        <div
          className={`right md:w-2/5 flex items-center md:justify-end lg:bg-[#fcf5f3] h-full 
          ${user ? '' : 'gap-12'}`}
        >
          {user ? (
            <div className="flex justify-between items-center gap-4">
              <img
                src={user.avatar || '/avatar.png'}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-bold  max-md:hidden">{user.name}</span>
              <Link
                className="bg-yellow-300 px-6 py-3 rounded-md font-bold lg:mr-4 
              hover:scale-105 transition duration-300 ease relative max-md:hidden"
                to="/user/profile"
              >
                <div
                  className="notification absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-700 text-white
                flex justify-center items-center text-sm"
                >
                  3
                </div>
                Profile
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="#"
                className="hover:scale-105 transition duration-300 ease rounded-md max-md:hidden"
                to="/login"
              >
                Log in
              </Link>
              <Link
                href="#"
                className="bg-yellow-300 px-4 py-2 hover:scale-105 mr-2 transition duration-300 ease rounded-md max-md:hidden"
                to="/signup"
              >
                Sign up
              </Link>
            </>
          )}

          <a href="#">
            <img
              src="/public/menu.png"
              alt=""
              className={`w-9 md:hidden relative z-50 ml-4`}
              onClick={() => {
                setSidebar((pre) => !pre);
              }}
            />
          </a>
        </div>
        <div
          className={`menu bg-black flex flex-col justify-center items-center 
            absolute  right-0 top-0 bottom-0 gap-6 transition-all duration-1000 md:hidden
            ${sidebar ? 'max-md:w-1/2' : 'w-0 overflow-hidden'}`}
        >
          {/* <a
            href="#"
            className="absolute right-3 top-3 text-3xl text-white font-bold"
            onClick={() => setSidebar(false)}
          >
            X
          </a> */}
          <a href="" className="text-white">
            Home
          </a>
          <a href="" className="text-white">
            About
          </a>
          <a href="" className="text-white">
            Contact
          </a>
          <a href="" className="text-white">
            Agents
          </a>
          <a href="" className="text-white">
            Sign in
          </a>
          <a href="" className="text-white">
            Sign up
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
