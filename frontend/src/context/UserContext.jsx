import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState("user");
  const [uploadedItems, setUploadedItems] = useState([]);
  const [swapHistory, setSwapHistory] = useState([]);

  const addUploadedItem = (item) => {
    setUploadedItems((prev) => [...prev, item]);
  };

  const addSwapHistory = (swap) => {
    setSwapHistory((prev) => [...prev, swap]);
  };

  const value = {
    user,
    isLoaded,
    userRole,
    uploadedItems,
    swapHistory,
    addUploadedItem,
    addSwapHistory,
    setUserRole,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
