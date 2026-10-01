import type CartProductModel from "./CartProductModel";

class OrderItemModel {
  product: CartProductModel;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  totalPrice: number;

  constructor(
    product: CartProductModel,
    quantity: number,
    unitPrice: number,
    discountPercent: number,
    totalPrice: number
  ) {
    this.product = product;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.discountPercent = discountPercent;
    this.totalPrice = totalPrice;
  }
}

export default OrderItemModel;
