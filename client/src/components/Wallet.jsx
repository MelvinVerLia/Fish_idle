import React, { useContext, useEffect, useState } from "react";
import InventoryFinder from "../../API/InventoryFinder";
import { UsersContext } from "../context/UsersContext";

const Wallet = () => {
  const { wallet, userId, idle, setIdle } = useContext(UsersContext);
  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <h1 className="text-5xl font-bold">Fisch: {wallet ?? "Loading..."}</h1>
      <h1 className="text-xl font-bold mt-1">Idle: {idle ?? "0"}/s</h1>
    </div>
  );
};

export default Wallet;
