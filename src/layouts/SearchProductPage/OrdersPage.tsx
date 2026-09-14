import { useEffect, useState } from "react";
import type OrderModel from "../../models/OrderModel";
import { Order } from "./components/Order";
import { fetchWithAuth } from "../../services/fetchWithAuth";
import { BASE_URL } from "../../config";

export const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithAuth(`${BASE_URL}/orders`);

        if (!response.ok) {
          throw new Error("Cannot load orders");
        }

        const data: OrderModel[] = await response.json();

        setOrders(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <div className="container">
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
