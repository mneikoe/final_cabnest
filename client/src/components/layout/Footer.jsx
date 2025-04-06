import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-2 px-4 text-sm hidden md:block">
      &copy; {new Date().getFullYear()} Cabnest.co.in. All rights reserved.
    </footer>
  );
};

export default Footer;
