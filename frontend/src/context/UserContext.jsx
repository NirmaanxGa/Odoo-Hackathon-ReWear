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
  const [uploadedItems, setUploadedItems] = useState([
    // Mock uploaded items for testing exchange functionality
    // Remove these items to test the "no items" flow
    {
      id: "user_item_1",
      title: "My Vintage Jacket",
      image: "https://via.placeholder.com/300x400?text=My+Jacket",
      size: "L",
      condition: "Excellent",
      price: 299,
    },
    {
      id: "user_item_2",
      title: "My Designer Jeans",
      image: "https://via.placeholder.com/300x400?text=My+Jeans",
      size: "32",
      condition: "Like New",
      price: 199,
    },
  ]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [pointsBalance, setPointsBalance] = useState(0); // Start with 0 points
  const [rewardsRedeemed, setRewardsRedeemed] = useState([]);

  const addUploadedItem = (item) => {
    setUploadedItems((prev) => [...prev, item]);
  };

  const addPurchase = (item) => {
    setPurchaseHistory((prev) => [
      ...prev,
      {
        ...item,
        purchaseDate: new Date().toISOString(),
        pointsEarned: 200,
      },
    ]);
    // Add 200 points for each purchase
    setPointsBalance((prev) => prev + 200);
  };

  const addExchange = (exchange) => {
    setExchangeHistory((prev) => [...prev, exchange]);
  };

  const redeemReward = (reward) => {
    if (pointsBalance >= reward.pointsRequired) {
      setPointsBalance((prev) => prev - reward.pointsRequired);
      setRewardsRedeemed((prev) => [
        ...prev,
        {
          ...reward,
          redeemedDate: new Date().toISOString(),
        },
      ]);
      return true;
    }
    return false;
  };

  const value = {
    user,
    isLoaded,
    userRole,
    setUserRole,
    uploadedItems,
    addUploadedItem,
    purchaseHistory,
    addPurchase,
    exchangeHistory,
    addExchange,
    pointsBalance,
    rewardsRedeemed,
    redeemReward,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
