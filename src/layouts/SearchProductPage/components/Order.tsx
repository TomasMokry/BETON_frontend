import type OrderModel from "../../../models/OrderModel";

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
        {props.order.items.map((item) => (
          <div
            key={item.product.id}
            className="row align-items-center border-bottom py-3"
          >
            <div className="col-md-6">{item.product.name}</div>

            <div className="col-md-2">{item.quantity}x</div>

            <div className="col-md-2">{item.product.price.toFixed(2)} Kč</div>

            <div className="col-md-2 text-end">
              {item.totalPrice.toFixed(2)} Kč
            </div>
          </div>
        ))}

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
