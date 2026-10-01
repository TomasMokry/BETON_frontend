import { useEffect, useRef, useState } from "react";
import { CategoryNavbar } from "./components/CategoryNavbar";
import ProductModel from "../../models/ProductModel";
import CategoryModel from "../../models/CategoryModel";
import { Product } from "./components/Product";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import type CartModel from "../../models/CartModel";
import { fetchWithAuth } from "../../services/fetchWithAuth";
import { NotificationToast } from "./components/NotificationToast";
import { BASE_URL } from "../../config";
import { buildProductsUrl } from "../../services/productApi";
import { useDebounce } from "../utils/useDebounce";
import { ProductSearchBox } from "./components/ProductSearchBox";
import { DiscountSelect } from "./components/DiscountSelect";
import { CartItemRow } from "./components/CartItemRow";
import { GIFT_PERCENT } from "../../models/Discount";

export const ProductPage = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const latestRequestId = useRef(0);

  const [cart, setCart] = useState<CartModel | null>(null);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);

  // Locks one cart line while its request runs, so fast clicks cannot race each other.
  const withPendingItem = async (productId: number, action: () => Promise<void>) => {
    setPendingItemId(productId);
    try {
      await action();
    } finally {
      setPendingItemId(null);
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // CREATE CART
  const createCart = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Cannot create cart");
    }

    const data: CartModel = await response.json();

    localStorage.setItem("cartId", data.id);

    setCart(data);
  };

  //FETCH CART
  const fetchCart = async () => {
    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
      throw new Error("No cart ID");
    }

    const response = await fetchWithAuth(`${BASE_URL}/carts/${cartId}`);

    if (!response.ok) {
      throw new Error("Cannot load cart");
    }

    const data: CartModel = await response.json();

    setCart(data);
  };

  //ADD TO CART
  const addToCart = async (productId: number) => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/carts/${cart.id}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        },
      );

      if (!response.ok) {
        throw new Error("Cannot add product to cart");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
      setShowError(true);
    }
  };

  const deleteCartItem = async (productId: number) => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/carts/${cart.id}/items/${productId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Cannot delete cart item");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
      setShowError(true);
    }
  };

  const checkout = async (paymentMethod: "CARD" | "CASH") => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetchWithAuth(`${BASE_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: cart.id,
          paymentMethod: paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();

      console.log("Checkout successful:", data);

      setShowSuccess(true);

      // Refresh cart after successful checkout
      await fetchCart();
      await fetchProducts();
    } catch (err: any) {
      setHttpError(err.message);
      setShowError(true);
    }
  };

  const clearCart = async () => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/carts/${cart.id}/items`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Cannot clear cart");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
      setShowError(true);
    }
  };

  const updateItemQuantity = async (productId: number, quantity: number) => {
    if (!cart || quantity < 1) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/carts/${cart.id}/items/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        },
      );

      if (!response.ok) {
        throw new Error("Cannot update item quantity");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
      setShowError(true);
    }
  };

  const updateItemDiscount = async (productId: number, discountPercent: number) => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/carts/${cart.id}/items/${productId}/discount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discountPercent }),
        },
      );

      if (!response.ok) {
        throw new Error("Cannot update item discount");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
      setShowError(true);
    }
  };

  const updateCartDiscount = async (discountPercent: number) => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/carts/${cart.id}/discount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discountPercent }),
        },
      );

      if (!response.ok) {
        throw new Error("Cannot update cart discount");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
      setShowError(true);
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      const cartId = localStorage.getItem("cartId");

      if (!cartId) {
        await createCart();
        return;
      }

      try {
        await fetchCart();
      } catch {
        // Stored cart doesn't exist anymore
        localStorage.removeItem("cartId");

        // Create a fresh cart
        await createCart();
      }
    };

    initializeCart().catch((err: any) => {
      setHttpError(err.message);
      setShowError(true);
    });
  }, []);

  // Load categories ONCE
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetchWithAuth(`${BASE_URL}/categories`);
      if (!response.ok) throw new Error("Cannot load categories");

      const data: CategoryModel[] = await response.json();

      setCategories(data);
    };

    fetchCategories().catch((err: any) => {
      setHttpError(err.message);
      setShowError(true);
    });
  }, []);

  const fetchProducts = async () => {
    // Only the latest request may update state (drops outdated responses)
    const requestId = ++latestRequestId.current;
    setIsLoadingProducts(true);

    try {
      const response = await fetchWithAuth(
        buildProductsUrl(debouncedQuery, selectedCategory),
      );

      if (!response.ok) {
        throw new Error("Cannot load products");
      }

      const data: ProductModel[] = await response.json();

      if (requestId !== latestRequestId.current) return;
      setProducts(data);
    } catch (err: any) {
      if (requestId !== latestRequestId.current) return;
      setHttpError(err.message);
      setShowError(true);
    } finally {
      if (requestId === latestRequestId.current) {
        setIsLoadingProducts(false);
        setIsInitialLoad(false);
      }
    }
  };

  // Load products on category or search query change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, debouncedQuery]);

  if (isInitialLoad) return <SpinnerLoading />;

  return (
    <div>
      <NotificationToast
        show={showSuccess}
        type="success"
        title="Success"
        message={
          <>
            Order was successfully moved to orders.
            <br />
            Go to Orders to see all completed orders.
          </>
        }
        onClose={() => setShowSuccess(false)}
      />

      <NotificationToast
        show={showError}
        type="error"
        title="Error"
        message={httpError ?? "Something went wrong."}
        onClose={() => {
          setShowError(false);
          setHttpError(null);
        }}
      />

      <CategoryNavbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="d-flex flex-column flex-lg-row">
        <div className="p-3 overflow-auto flex-grow-1">
          <div className="mx-1 mb-3">
            <ProductSearchBox value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* LEFT PRODUCT GRID */}
          {isLoadingProducts ? (
            <SpinnerLoading />
          ) : products.length === 0 && debouncedQuery.trim() ? (
            <div className="text-muted text-center py-4">
              No products match "{debouncedQuery.trim()}"
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-3 mx-1">
              {products.map((product) => (
                <Product
                  product={product}
                  key={product.id}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="d-flex flex-column flex-shrink-0 p-3 cart-panel cart-panel-sticky order-first order-lg-last">
          {cart && cart.discountPercent > 0 && (
            <>
              <div className="d-flex justify-content-between small text-muted">
                <span>Subtotal</span>
                <span>{cart.subtotalPrice.toFixed(2)} Kč</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>
                  {cart.discountPercent === GIFT_PERCENT
                    ? "Gift (100 %)"
                    : `Discount -${cart.discountPercent} %`}
                </span>
                <span>-{cart.discountAmount.toFixed(2)} Kč</span>
              </div>
            </>
          )}
          <div className="d-flex justify-content-between align-items-end mb-3">
            <span className="cart-total-label">Total price</span>
            <span className="cart-total-value">
              {cart?.totalPrice.toFixed(2) ?? "0.00"} Kč
            </span>
          </div>

          <hr />

          {/* CART LINES */}
          {cart?.items.length === 0 && (
            <div className="text-muted text-center py-3">
              Your cart is empty. Add products from the list.
            </div>
          )}

          <ul className="cart-lines">
            {cart?.items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                pending={pendingItemId === item.product.id}
                onQuantityChange={(quantity) =>
                  withPendingItem(item.product.id, () =>
                    updateItemQuantity(item.product.id, quantity),
                  )
                }
                onDiscountChange={(percent) =>
                  withPendingItem(item.product.id, () =>
                    updateItemDiscount(item.product.id, percent),
                  )
                }
                onRemove={() =>
                  withPendingItem(item.product.id, () =>
                    deleteCartItem(item.product.id),
                  )
                }
              />
            ))}
          </ul>
          {cart && cart.items.length > 0 && (
            <div className="d-flex align-items-center justify-content-between mt-3">
              <span>Cart discount</span>
              <DiscountSelect
                value={cart.discountPercent}
                onChange={updateCartDiscount}
                ariaLabel="Cart discount"
              />
            </div>
          )}
          <button
            className="btn btn-outline-secondary w-100 p-2 mb-2 mt-3"
            onClick={clearCart}
          >
            Clear Cart
          </button>

          <hr />

          {/* ACTION BUTTONS */}
          <div className="d-flex flex-column gap-2">
            <button
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center mt-auto"
              onClick={() => checkout("CARD")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-credit-card-2-back-fill"
                viewBox="0 0 16 16"
              >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5H0zm11.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM0 11v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1z" />
              </svg>
              <span className="ms-3">Complete with Card</span>
            </button>

            <button
              className="btn btn-outline-ink w-100 p-2 mb-2 d-flex align-items-center justify-content-center"
              onClick={() => checkout("CASH")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-cash-stack"
                viewBox="0 0 16 16"
              >
                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
              </svg>
              <span className="ms-3">Complete with Cash</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
