import OrderItemModel from "./OrderItemModel";

class OrderModel {
  id: string;
  method: string;
  createdAt: string;
  subtotalPrice: number | null;
  discountPercent: number;
  totalPrice: number;
  items: OrderItemModel[];

  constructor(
    id: string,
    method: string,
    subtotalPrice: number | null,
    discountPercent: number,
    totalPrice: number,
    createdAt: string,
    items: OrderItemModel[]
  ) {
    this.id = id;
    this.method = method;
    this.subtotalPrice = subtotalPrice;
    this.discountPercent = discountPercent;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt;
    this.items = items;
  }
}

export default OrderModel;
