import React from "react";

function Banner() {
  return (
    <div className="bg-yellow-400 flex justify-between items-center border-y border-black py-10 lg:py-3">
      <div className="px-10 py-5 space-y-5 tracking-wide max-w-[650px] ">
        <div>
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>
            {"  "}
            is a place to write, read, and connect
          </h1>
        </div>
        <h2 className="text-2xl">
          It's easy and free to post your thinking on any topic and connect with
          million of readers
        </h2>
      </div>
      {/* image */}
      <img className="hidden md:inline-flex h-52 lg:h-full" src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="" />
    </div>
  );
}

export default Banner;
