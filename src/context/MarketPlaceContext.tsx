import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { BASE_URL } from "../config";
import { fetchWithAuth } from "../services/fetchWithAuth";
import type { MarketPlaceModel } from "../models/MarketPlaceModel";

interface MarketPlaceContextType {
  current: MarketPlaceModel | null;
  markets: MarketPlaceModel[]; // active market places only
  selectMarket: (id: number | null) => Promise<void>;
  refresh: () => Promise<void>;
}

const MarketPlaceContext = createContext<MarketPlaceContextType | undefined>(
  undefined,
);

export const MarketPlaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [current, setCurrent] = useState<MarketPlaceModel | null>(null);
  const [markets, setMarkets] = useState<MarketPlaceModel[]>([]);

  const refresh = useCallback(async () => {
    const [currentResponse, marketsResponse] = await Promise.all([
      fetchWithAuth(`${BASE_URL}/users/me/marketplace`),
      fetchWithAuth(`${BASE_URL}/marketplaces`),
    ]);

    if (!currentResponse.ok || !marketsResponse.ok) {
      throw new Error("Cannot load market places");
    }

    // 204 No Content = no market place selected
    setCurrent(currentResponse.status === 204 ? null : await currentResponse.json());
    setMarkets(await marketsResponse.json());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrent(null);
      setMarkets([]);
      return;
    }
    refresh().catch((err) => console.error(err.message));
  }, [isAuthenticated, refresh]);

  const selectMarket = async (id: number | null) => {
    const response = await fetchWithAuth(`${BASE_URL}/users/me/marketplace`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marketPlaceId: id }),
    });

    if (!response.ok) {
      throw new Error("Cannot select market place");
    }

    setCurrent(response.status === 204 ? null : await response.json());
  };

  return (
    <MarketPlaceContext.Provider value={{ current, markets, selectMarket, refresh }}>
      {children}
    </MarketPlaceContext.Provider>
  );
};

export const useMarketPlace = () => {
  const context = useContext(MarketPlaceContext);
  if (!context) {
    throw new Error("useMarketPlace must be used within a MarketPlaceProvider");
  }
  return context;
};
