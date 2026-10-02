import type OrderModel from "../../../models/OrderModel";
import { GIFT_PERCENT } from "../../../models/Discount";

export const Order: React.FC<{ order: OrderModel }> = (props) => {
  return (
    <div className="card list-card mt-2 mb-2">
      {/* TOP ROW */}
      <div className="row g-0">
        <div className="col-md-12">
          <div className="card-body d-flex justify-content-between align-items-center">
            {/* DATE + ORDER INFO */}
            <div className="d-flex align-items-center gap-3">
              <h5 className="mb-0">
                {new Date(props.order.createdAt).toLocaleDateString("en-GB")} -{" "}
                {new Date(props.order.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </h5>

              <div className="text-muted small">
                {props.order.method === "CASH" ? "Cash" : "Card"}
              </div>

              <span className="badge rounded-pill market-badge">
                {props.order.marketPlace?.name ?? "No market"}
              </span>

              <span className="badge rounded-pill market-badge d-inline-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-person-fill me-1"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                {props.order.customer?.name ?? "Unknown"}
              </span>
            </div>

            {/* PAYMENT METHOD ICON */}
            {props.order.method === "CASH" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-cash-stack text-secondary"
                viewBox="0 0 16 16"
              >
                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-credit-card text-secondary"
                viewBox="0 0 16 16"
              >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 3H1v6a1 1 0 0 1 1 1h12a1 1 0 0 0 1-1z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* ORDER ITEMS */}
      <div className="card-body border-top bg-white">
        {/* COLUMN HEADER */}
        <div className="row d-none d-md-flex border-bottom pb-2 small text-muted fw-semibold">
          <div className="col-md-5">Name</div>
          <div className="col-md-1">Amount</div>
          <div className="col-md-2">Price per piece</div>
          <div className="col-md-2">Discount</div>
          <div className="col-md-2 text-end">Total</div>
        </div>

        {props.order.items.map((item) => (
          <div
            key={item.product.id}
            className="row align-items-center border-bottom py-3"
          >
            <div className="col-md-5">{item.product.name}</div>

            <div className="col-md-1">{item.quantity}x</div>

            <div className="col-md-2">{item.unitPrice.toFixed(2)} Kč</div>

            <div className="col-md-2">
              {item.discountPercent === GIFT_PERCENT ? (
                <span className="badge bg-success">Gift</span>
              ) : item.discountPercent > 0 ? (
                <span className="text-muted">-{item.discountPercent} %</span>
              ) : null}
            </div>

            <div className="col-md-2 text-end">
              {item.totalPrice.toFixed(2)} Kč
            </div>
          </div>
        ))}

        {/* CART DISCOUNT */}
        {props.order.discountPercent > 0 && props.order.subtotalPrice != null && (
          <>
            <div className="row pt-3 text-muted">
              <div className="col-md-10">Subtotal:</div>
              <div className="col-md-2 text-end">
                {props.order.subtotalPrice.toFixed(2)} Kč
              </div>
            </div>
            <div className="row text-muted">
              <div className="col-md-10">
                {props.order.discountPercent === GIFT_PERCENT
                  ? "Gift (100 %):"
                  : `Discount -${props.order.discountPercent} %:`}
              </div>
              <div className="col-md-2 text-end">
                -{(props.order.subtotalPrice - props.order.totalPrice).toFixed(2)} Kč
              </div>
            </div>
          </>
        )}

        {/* TOTAL PRICE */}
        <div className="row py-3 fw-bold">
          <div className="col-md-10">Total price:</div>

          <div className="col-md-2 text-end">
            {props.order.totalPrice.toFixed(2)} Kč
          </div>
        </div>
      </div>
    </div>
  );
};
