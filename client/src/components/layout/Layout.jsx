import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {currentUser && <Sidebar />}
      <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
