class CartProductModel {
  id: number;
  name: string;
  price: number;
  stock: number;

  constructor(id: number, name: string, price: number, stock: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }
}

export default CartProductModel;
