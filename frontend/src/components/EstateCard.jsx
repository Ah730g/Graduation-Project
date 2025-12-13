import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function EstateCard({ estate }) {
  useEffect(() => {}, []);
  return (
    <div className="flex gap-5 items-center justify-start">
      <Link className="image w-2/5 h-48 max-md:hidden" to={`/${estate.id}`}>
        <img
          src={estate.images[0].Image_URL}
          alt=""
          className="rounded-md w-full h-full object-cover"
        />
      </Link>
      <div className="content flex justify-between flex-col gap-2 flex-1 h-full">
        <Link>
          <h3 className="font-semibold text-lg text-[#444] transition duration-400 hover:text-black hover:scale-105">
            {estate.Title}
          </h3>
        </Link>
        <p className="font-light flex items-center gap-1 text-sm text-[#888]">
          <img src="/public/pin.png" alt="" className="w-4" />
          {estate.Address}
        </p>
        <p className="bg-yellow-200 w-fit p-1 text-xl rounded-md">
          ${estate.Price}
        </p>
        <div className="flex justify-between gap-2">
          <div className="flex gap-4 text-sm">
            <span className="flex gap-1 bg-gray-200 p-1 items-center rounded-md">
              <img src="/public/bed.png" alt="" className="w-4" />
              {estate.Bedrooms}
              bedroom
            </span>
            <span className="flex gap-1 bg-gray-200 p-1 items-center rounded-md">
              <img src="/public/bath.png" alt="" className="w-4" />
              {estate.Bathrooms}
              bathroom
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <div className="border py-[5px] px-2 rounded-sm cursor-pointer  hover:bg-gray-400 transition">
              <img src="/public/save.png" alt="" className="w-4" />
            </div>
            <div className="border py-[5px] px-2 rounded-sm cursor-pointer hover:bg-gray-400 transition">
              <img src="/public/chat.png" alt="" className="w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstateCard;
