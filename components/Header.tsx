import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="sticky top-0 p-3 bg-gray-100 flex items-center justify-between ">
        {/* left */}
      <div className="flex items-center space-x-5">
        {/* Image change karna ha  */}
        <Link href="/">
          <img
            className="w-44 object-contain cursor-pointer"
            src="https://links.papareact.com/yvf"
          />
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5">
            <h3>About</h3>
            <h3>Contact</h3>
            <h3 className="GreenFillButton px-4 py-1">Follow</h3>
        </div>
      </div>

      {/* right */}
      <div className="flex items-center space-x-4">
        <h3 className="GreenBorderButton py-1 px-5">Sign IN</h3>
        <h3 className="GreenBorderButton py-1 px-5">Get Started</h3>
      </div>
    </div>
  );
}

export default Header;
