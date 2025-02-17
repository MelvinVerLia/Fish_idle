import React, { useContext, useEffect, useState } from "react";
import ShopFinder from "../../API/ShopFinder";
import { UsersContext } from "../context/UsersContext";

const TierShop = () => {
  const [tiers, setTiers] = useState([]);
  const [level, setLevel] = useState([]);
  const { userId, setUserId } = useContext(UsersContext);
  const [status, setStatus] = useState(null);

  const upgradeTier = async () => {
    try {
      console.log("Buying tier");
      const response = await ShopFinder.put("buy-tiers", {
        userId: userId,
      });

      if (response.data.status === "success") {
        setStatus({
          message: `Tier Has Been Upgraded`,
          type: "success",
        });
      }
      setTimeout(() => setStatus(null), 2000);
      getTier();

      console.log(response.data);
    } catch (error) {
      setStatus({ message: error.response.data.error, type: "Big No No" });
      setTimeout(() => setStatus(null), 2000);

      console.log(error);
    }
  };

  const getTier = async () => {
    console.log(userId);
    const tierResponse = await ShopFinder.get("tiers", {
      params: { userId },
    });
    console.log(tierResponse.data);
    setTiers(tierResponse.data.tiers);
    setLevel(tierResponse.data.currentLevel.currLev);
  };

  useEffect(() => {
    if (!userId) return;
    getTier();
  }, [userId, setTiers]);

  return (
    <div className="container mx-auto p-4">
      {status && (
        <div
          className={`absolute top-40 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md transition-opacity duration-500 ${
            status.type === "success"
              ? "bg-green-200 text-green-900"
              : "bg-red-200 text-red-900"
          }`}
        >
          {status.message}
        </div>
      )}
      <h2 className="text-3xl font-bold mb-4">Tier Upgrade</h2>
      <h3 className="text-xl font-bold mb-4">Current Level: {level}</h3>
      {tiers[level]?.cost !== undefined && (
        <p>Next Tier Price: {tiers[level].cost}</p>
      )}

      {tiers[level]?.cost === undefined && (
        <p className="text-red-600 font-bold text-2xl mb-4">Max tier reached</p>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-10 rounded hover:bg-blue-700 transition"
        onClick={() => upgradeTier()}
      >
        Upgrade Tier
      </button>
      {/* {message && <p className="mt-4">{message}</p>} */}
    </div>
  );
};

export default TierShop;
