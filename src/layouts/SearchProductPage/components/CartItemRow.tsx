import type CartItemModel from "../../../models/CartItemModel";
import { GIFT_PERCENT } from "../../../models/Discount";
import { DiscountSelect } from "./DiscountSelect";

export const CartItemRow: React.FC<{
  item: CartItemModel;
  pending: boolean;
  onQuantityChange: (quantity: number) => void;
  onDiscountChange: (percent: number) => void;
  onRemove: () => void;
}> = ({ item, pending, onQuantityChange, onDiscountChange, onRemove }) => {
  const { product, quantity, discountPercent } = item;
  const atStockLimit = quantity >= product.stock;
  const isGift = discountPercent === GIFT_PERCENT;

  return (
    <li className={`cart-line${pending ? " is-pending" : ""}`} aria-busy={pending}>
      <div className="cart-line-head">
        <div className="cart-line-name">
          {product.name}
          <span className="cart-line-unit">{product.price.toFixed(2)} Kč / piece</span>
        </div>
        <button
          type="button"
          className="btn-icon cart-line-remove"
          onClick={onRemove}
          disabled={pending}
          aria-label={`Remove ${product.name} from cart`}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </button>
      </div>

      <div className="cart-line-controls">
        <div className="qty-stepper" role="group" aria-label={`Quantity of ${product.name}`}>
          <button
            type="button"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={pending || quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <output aria-live="polite">{quantity}</output>
          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={pending || atStockLimit}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <DiscountSelect
          value={discountPercent}
          onChange={onDiscountChange}
          disabled={pending}
          ariaLabel={`Discount for ${product.name}`}
        />

        <div className="cart-line-total">
          {discountPercent > 0 && (
            <s className="cart-line-was">{item.subtotalPrice.toFixed(2)}</s>
          )}
          {isGift ? (
            <span className="gift-chip">Gift</span>
          ) : (
            <span>{item.totalPrice.toFixed(2)} Kč</span>
          )}
        </div>
      </div>

      {atStockLimit && (
        <div className="cart-line-note">All {product.stock} in stock are in the cart</div>
      )}
    </li>
  );
};
