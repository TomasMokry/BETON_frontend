import CartItemModel from "./CartItemModel";

class CartModel {
  id: string;
  subtotalPrice: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  items: CartItemModel[];

  constructor(
    id: string,
    subtotalPrice: number,
    discountPercent: number,
    discountAmount: number,
    totalPrice: number,
    items: CartItemModel[]
  ) {
    this.id = id;
    this.subtotalPrice = subtotalPrice;
    this.discountPercent = discountPercent;
    this.discountAmount = discountAmount;
    this.totalPrice = totalPrice;
    this.items = items;
  }
}

export default CartModel;
