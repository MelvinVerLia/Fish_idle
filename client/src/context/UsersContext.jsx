import React, { createContext, useEffect, useState } from "react";
import InventoryFinder from "../../API/InventoryFinder";
import IdleFinder from "../../API/IdleFinder";

export const UsersContext = createContext();

export const UsersContextProvider = (props) => {
  const [userId, setUserId] = useState(null);
  const [wallet, setWallet] = useState([]);
  const [idle, setIdle] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.id);
      } catch (error) {
        console.log("Error decoding token:", error);
      }
    }
  }, []);

  const fetchTotalIdle = async () => {
    if (!userId) return;

    try {
      const response = await IdleFinder.get("idle-total", {
        params: { userId },
      });
      setIdle(response.data);
    } catch (error) {
      console.error("Failed to fetch idle data:", error);
    }
  };

  const fetchWallet = async () => {
    if (!userId) return;

    try {
      const response = await InventoryFinder.get("wallet", {
        params: { userId },
      });
      setWallet(response.data.data.wallet.wallet);
      console.log("Wallet updated:", response.data.data.wallet.wallet);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  useEffect(() => {
    if (userId === null) return;

    fetchWallet(); 
    fetchTotalIdle();
    const wallet_interval = setInterval(fetchWallet, 5000); 
    const idle_interval = setInterval(fetchTotalIdle, 5000);
    return () => {
      clearInterval(wallet_interval);
      clearInterval(idle_interval);
    };
  }, [userId]);

  return (
    <UsersContext.Provider value={{ userId, setUserId, wallet, setWallet, idle, setIdle}}>
      {props.children}
    </UsersContext.Provider>
  );
};
