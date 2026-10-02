import { useEffect, useState } from "react";
import type OrderModel from "../../models/OrderModel";
import type {
  MarketPlaceModel,
  OrderSummaryModel,
} from "../../models/MarketPlaceModel";
import { Order } from "./components/Order";
import { fetchWithAuth } from "../../services/fetchWithAuth";
import { BASE_URL } from "../../config";

// "" = all orders, "none" = orders sold outside any market place, otherwise a market place id
const ALL_MARKETS = "";
const NO_MARKET = "none";

export const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [summary, setSummary] = useState<OrderSummaryModel[]>([]);
  const [marketPlaces, setMarketPlaces] = useState<MarketPlaceModel[]>([]);
  const [marketFilter, setMarketFilter] = useState<string>(ALL_MARKETS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Archived market places are included so their old orders can still be filtered
  useEffect(() => {
    const fetchMarketPlaces = async () => {
      const response = await fetchWithAuth(
        `${BASE_URL}/marketplaces?includeArchived=true`,
      );
      if (!response.ok) throw new Error("Cannot load market places");
      setMarketPlaces(await response.json());
    };

    fetchMarketPlaces().catch((err) => console.error(err.message));
  }, []);

  useEffect(() => {
    let ignore = false;
    const query = marketFilter
      ? `?marketPlaceId=${encodeURIComponent(marketFilter)}`
      : "";

    const fetchOrders = async () => {
      const response = await fetchWithAuth(`${BASE_URL}/orders${query}`);
      if (!response.ok) throw new Error("Cannot load orders");

      const data: OrderModel[] = await response.json();
      if (ignore) return;

      setOrders(data);
      setSelectedDate(null); // jump to the newest day of the filtered orders
    };

    // Loaded separately so a failing summary never hides the orders list
    const fetchSummary = async () => {
      const response = await fetchWithAuth(`${BASE_URL}/orders/summary${query}`);
      if (!response.ok) throw new Error("Cannot load order summary");

      const data: OrderSummaryModel[] = await response.json();
      if (ignore) return;

      setSummary(data);
    };

    fetchOrders().catch((err) => console.error(err.message));
    fetchSummary().catch((err) => {
      console.error(err.message);
      if (!ignore) setSummary([]);
    });

    return () => {
      ignore = true;
    };
  }, [marketFilter]);

  // Get YYYY-MM-DD from backend datetime string
  const getOrderDate = (order: OrderModel): string => {
    return order.createdAt.slice(0, 10);
  };

  // Get unique dates
  const orderDates = Array.from(new Set(orders.map(getOrderDate))).sort(
    (a, b) => b.localeCompare(a),
  );

  // Select newest day by default
  useEffect(() => {
    if (orderDates.length > 0 && selectedDate === null) {
      setSelectedDate(orderDates[0]);
    }
  }, [orderDates, selectedDate]);

  // Orders for selected day
  const displayedOrders = orders.filter(
    (order) => getOrderDate(order) === selectedDate,
  );

  const formatPrice = (value: number) => `${value.toFixed(2)} Kč`;

  return (
    <div className="container">
      {/* MARKET FILTER */}
      <div className="pt-4 d-flex flex-wrap align-items-center gap-2">
        <label htmlFor="market-filter" className="form-label mb-0">
          Market place
        </label>
        <select
          id="market-filter"
          className="form-select w-auto"
          value={marketFilter}
          onChange={(e) => setMarketFilter(e.target.value)}
        >
          <option value={ALL_MARKETS}>All</option>
          {marketPlaces.map((market) => (
            <option key={market.id} value={String(market.id)}>
              {market.name}
              {market.active ? "" : " (archived)"}
            </option>
          ))}
          <option value={NO_MARKET}>No market</option>
        </select>
      </div>

      {/* PER-MARKET TOTALS */}
      {summary.length > 0 && (
        <div className="row g-2 pt-3">
          {summary.map((row) => (
            <div key={row.marketPlaceId ?? NO_MARKET} className="col-sm-6 col-lg-4">
              <div className="card list-card h-100">
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between align-items-baseline">
                    <span className="fw-semibold">
                      {row.marketPlaceName ?? "No market"}
                    </span>
                    <span className="text-muted small">
                      {row.orderCount} {row.orderCount === 1 ? "order" : "orders"}
                    </span>
                  </div>
                  <div className="fs-5 fw-bold">{formatPrice(row.total)}</div>
                  <div className="text-muted small">
                    Card {formatPrice(row.cardTotal)} · Cash {formatPrice(row.cashTotal)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DAY NAVIGATION */}
      <div className="pt-4 pb-3">
        <div className="d-flex flex-wrap gap-2 pb-3">
          {orderDates.map((date) => (
            <button
              key={date}
              type="button"
              className={`btn ${
                selectedDate === date ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setSelectedDate(date)}
            >
              {new Date(date + "T00:00:00").toLocaleDateString("en-GB")}
            </button>
          ))}
        </div>
        {orders.length === 0 && (
          <div className="text-muted">No orders for this selection.</div>
        )}
      </div>

      {/* ORDERS */}
      <div className="pt-2">
        {displayedOrders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};
