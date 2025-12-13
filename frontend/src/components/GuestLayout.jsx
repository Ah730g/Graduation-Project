import React from 'react';
import { Outlet } from 'react-router-dom';

function GuestLayout() {
  return (
    <div
      className="px-5 mx-auto max-w-[1366px] max-md:max-w-[640px] max-lg:max-w-[768px] max-xl:max-w-[1280px] overflow-hidden
     flex justify-between h-[calc(100vh-100px)]"
    >
      <Outlet />
      <div className="image-container md:bg-[#fcf5f3] h-full w-2/5 relative max-lg:hidden">
        <img
          src="/public/bg.png"
          alt=""
          className="absolute max-w-[115%] right-0 max-xl:max-w-[105%]"
        />
      </div>
    </div>
  );
}

export default GuestLayout;
