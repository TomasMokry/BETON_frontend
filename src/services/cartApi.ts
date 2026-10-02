import { BASE_URL } from "../config";
import type CartModel from "../models/CartModel";
import { fetchWithAuth } from "./fetchWithAuth";

// Same key ProductPage uses, so the POS page picks up this cart on mount
const CART_ID_KEY = "cartId";

/** Returns the POS cart from localStorage, creating (and storing) a new one if it is missing or gone. */
export async function ensureCart(): Promise<CartModel> {
  const cartId = localStorage.getItem(CART_ID_KEY);

  if (cartId) {
    const response = await fetchWithAuth(`${BASE_URL}/carts/${cartId}`);
    if (response.ok) {
      return response.json();
    }
    if (response.status !== 404) {
      throw new Error("Cannot load cart");
    }
  }

  const response = await fetchWithAuth(`${BASE_URL}/carts`, { method: "POST" });
  if (!response.ok) {
    throw new Error("Cannot create cart");
  }

  const cart: CartModel = await response.json();
  localStorage.setItem(CART_ID_KEY, cart.id);
  return cart;
}
