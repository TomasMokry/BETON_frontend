export type MarketPlaceType =
  | "CHRISTMAS"
  | "FARMERS"
  | "FESTIVAL"
  | "FAIR"
  | "OTHER";

export const MARKET_PLACE_TYPE_LABELS: Record<MarketPlaceType, string> = {
  CHRISTMAS: "Christmas market",
  FARMERS: "Farmers market",
  FESTIVAL: "Festival",
  FAIR: "Fair",
  OTHER: "Other",
};

export interface MarketPlaceModel {
  id: number;
  name: string;
  address: string | null;
  type: MarketPlaceType;
  startDate: string | null; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
  active: boolean;
  notes: string | null;
}

export interface MarketPlaceRequest {
  name: string;
  address: string | null;
  type: MarketPlaceType;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  notes: string | null;
}

export interface MarketPlaceSummaryModel {
  id: number;
  name: string;
}

export interface OrderSummaryModel {
  marketPlaceId: number | null;
  marketPlaceName: string | null;
  orderCount: number;
  cardTotal: number;
  cashTotal: number;
  total: number;
}

export const formatMarketDates = (market: MarketPlaceModel): string => {
  const format = (date: string) =>
    new Date(date + "T00:00:00").toLocaleDateString("en-GB");
  if (market.startDate && market.endDate) {
    return `${format(market.startDate)} – ${format(market.endDate)}`;
  }
  if (market.startDate) return `from ${format(market.startDate)}`;
  if (market.endDate) return `until ${format(market.endDate)}`;
  return "";
};
