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
  const [pointsBalance, setPointsBalance] = useState(245);
  const [ongoingSwaps, setOngoingSwaps] = useState([]);

  const addUploadedItem = (item) => {
    setUploadedItems((prev) => [...prev, item]);
  };

  const addSwapHistory = (swap) => {
    setSwapHistory((prev) => [...prev, swap]);
  };

  const updatePoints = (amount) => {
    setPointsBalance((prev) => prev + amount);
  };

  const addOngoingSwap = (swap) => {
    setOngoingSwaps((prev) => [...prev, swap]);
  };

  const value = {
    user,
    isLoaded,
    userRole,
    setUserRole,
    uploadedItems,
    addUploadedItem,
    swapHistory,
    addSwapHistory,
    pointsBalance,
    updatePoints,
    ongoingSwaps,
    addOngoingSwap,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
