import React from "react";
import FactoryShop from "../components/FactoryShop";
import Header from "../components/header";
import { FactoryContextProvider } from "../context/FactoryContext";
import Wallet from "../components/Wallet";
import { FishContextProvider } from "../context/FishContext";
import { UsersContextProvider } from "../context/UsersContext";
import TierShop from "../components/TierShop";

const Shop = () => {
  return (
    <UsersContextProvider>
      <FishContextProvider>
        <FactoryContextProvider>
          <Header />
          <Wallet />
          <FactoryShop />
          <TierShop />
        </FactoryContextProvider>
      </FishContextProvider>
    </UsersContextProvider>
  );
};

export default Shop;
