import React from 'react';
import Searchbar from '../components/Searchbar';
function Home() {
  return (
    <>
      <div className="content-container flex-1 gap-5 flex flex-col justify-center max-md:justify-start">
        <h1 className="max-w-xl text-6xl font-bold lg:pr-14 max-xl:text-5xl">
          Find Real Estate & Get You Dream Place
        </h1>
        <p className="text-sm lg:pr-24">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
          eligendi nulla voluptas, odio maiores aliquam hic tempore! Expedita
          impedit nisi magni enim, necessitatibus iste mollitia possimus ipsam
          veniam tempore explicabo?
        </p>
        <Searchbar />
        <div className="boxes flex justify-between pr-24 max-md:hidden">
          <div>
            <h1 className="text-4xl font-bold">16+</h1>
            <h2 className="text-xl font-light">Years of Experience</h2>
          </div>
          <div>
            <h1 className="text-4xl font-bold">200</h1>
            <h2 className="text-xl font-light">Years of Experience</h2>
          </div>
          <div>
            <h1 className="text-4xl font-bold">2000+</h1>
            <h2 className="text-xl font-light">Years of Experience</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
