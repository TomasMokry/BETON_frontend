import OrderItemModel from "./OrderItemModel";
import type { MarketPlaceSummaryModel } from "./MarketPlaceModel";

export interface OrderCustomerModel {
  id: number;
  name: string;
}

class OrderModel {
  id: string;
  method: string;
  customer: OrderCustomerModel;
  marketPlace: MarketPlaceSummaryModel | null;
  createdAt: string;
  subtotalPrice: number | null;
  discountPercent: number;
  totalPrice: number;
  cardFee: number | null; // bank fee for card payments
  netPrice: number | null; // totalPrice - cardFee
  items: OrderItemModel[];

  constructor(
    id: string,
    method: string,
    customer: OrderCustomerModel,
    marketPlace: MarketPlaceSummaryModel | null,
    subtotalPrice: number | null,
    discountPercent: number,
    totalPrice: number,
    cardFee: number | null,
    netPrice: number | null,
    createdAt: string,
    items: OrderItemModel[]
  ) {
    this.id = id;
    this.method = method;
    this.customer = customer;
    this.marketPlace = marketPlace;
    this.subtotalPrice = subtotalPrice;
    this.discountPercent = discountPercent;
    this.totalPrice = totalPrice;
    this.cardFee = cardFee;
    this.netPrice = netPrice;
    this.createdAt = createdAt;
    this.items = items;
  }
}

export default OrderModel;
