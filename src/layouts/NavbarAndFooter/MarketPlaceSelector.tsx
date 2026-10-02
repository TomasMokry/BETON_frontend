import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMarketPlace } from "../../context/MarketPlaceContext";

export const MarketPlaceSelector = () => {
  const { current, markets, selectMarket } = useMarketPlace();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);

  // Close the menu when clicking outside of it
  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const choose = async (id: number | null) => {
    setOpen(false);
    try {
      await selectMarket(id);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <li className="nav-item m-1 dropdown" ref={containerRef}>
      <button
        type="button"
        className="btn btn-nav dropdown-toggle market-selector"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        title="Current market place"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-geo-alt-fill me-2"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
        </svg>
        <span className="market-selector-name">
          {current ? current.name : "No market"}
        </span>
      </button>

      <ul className={`dropdown-menu dropdown-menu-end ${open ? "show" : ""}`}>
        {markets.map((market) => (
          <li key={market.id}>
            <button
              type="button"
              className={`dropdown-item ${current?.id === market.id ? "active" : ""}`}
              onClick={() => choose(market.id)}
            >
              {market.name}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={`dropdown-item ${current === null ? "active" : ""}`}
            onClick={() => choose(null)}
          >
            No market
          </button>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <Link
            className="dropdown-item"
            to="/marketplaces"
            onClick={() => setOpen(false)}
          >
            Manage market places…
          </Link>
        </li>
      </ul>
    </li>
  );
};
