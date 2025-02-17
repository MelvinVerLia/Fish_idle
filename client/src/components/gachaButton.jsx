import React, { useContext, useEffect, useState } from "react";
import { FishContext } from "../context/FishContext";
import GachaFinder from "../../API/GachaFinder";
import InventoryFinder from "../../API/InventoryFinder";

const gachaButton = () => {
  const [fish, setFish] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const { setInventorys } = useContext(FishContext);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const userId = decoded.id;

  const gachaFish = async () => {
    if (cooldown > 0) return;
    try {
      const response = await GachaFinder.post(
        "gacha",
        { userId },
        { headers: { "Content-Type": "application/json" } }
      );
      setFish(response.data.data.fish);
      // setCooldown(10);
      setTimeout(() => setFish(null), 3000);

      // Setelah ikan digacha pasti kan masuk db abis masuk db kita manggil setinventory jadi kesannya kayak direfresh
      const invResponse = await InventoryFinder.get("inventory", {
        params: { userId },
        headers: { "Content-Type": "application/json" },
      });
      console.log(invResponse.data.data.inventories);
      // setInventorys(JSON.parse(JSON.stringify(invResponse.data.data.inventories))); 
      setInventorys(invResponse.data.data.inventories);
      console.log("hi");

    } catch (error) {
      console.log(error);
    }
  };

  // penggunaan ketika komponen sedang cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldown]);

  return (
    <div className="flex justify-center flex-col items-center mt-10">
      <button
        onClick={gachaFish}
        className={`w-32 h-32 text-white font-semibold rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
          cooldown > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-green-800"
        }`}
        disabled={cooldown > 0}
      >
        {cooldown > 0 ? `${cooldown}s` : "Fish"}
      </button>

      {fish && (
        <p className="mt-3 text-lg font-bold text-gray-800">
          🎣 You got Fish: {fish.name}
        </p>
      )}
    </div>
  );
};

export default gachaButton;
