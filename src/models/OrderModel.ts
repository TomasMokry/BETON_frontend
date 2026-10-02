import OrderItemModel from "./OrderItemModel";
import type { MarketPlaceSummaryModel } from "./MarketPlaceModel";

class OrderModel {
  id: string;
  method: string;
  marketPlace: MarketPlaceSummaryModel | null;
  createdAt: string;
  subtotalPrice: number | null;
  discountPercent: number;
  totalPrice: number;
  items: OrderItemModel[];

  constructor(
    id: string,
    method: string,
    marketPlace: MarketPlaceSummaryModel | null,
    subtotalPrice: number | null,
    discountPercent: number,
    totalPrice: number,
    createdAt: string,
    items: OrderItemModel[]
  ) {
    this.id = id;
    this.method = method;
    this.marketPlace = marketPlace;
    this.subtotalPrice = subtotalPrice;
    this.discountPercent = discountPercent;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
    this.items = items;
  }
}

export default OrderModel;
