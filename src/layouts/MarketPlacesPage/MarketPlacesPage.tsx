import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../config";
import { fetchWithAuth } from "../../services/fetchWithAuth";
import { useMarketPlace } from "../../context/MarketPlaceContext";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import {
  MARKET_PLACE_TYPE_LABELS,
  formatMarketDates,
  type MarketPlaceModel,
} from "../../models/MarketPlaceModel";

export const MarketPlacesPage = () => {
  const { current, selectMarket, refresh } = useMarketPlace();
  const [marketPlaces, setMarketPlaces] = useState<MarketPlaceModel[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const loadMarketPlaces = useCallback(async () => {
    const response = await fetchWithAuth(
      `${BASE_URL}/marketplaces?includeArchived=${showArchived}`,
    );
    if (!response.ok) throw new Error("Cannot load market places");
    setMarketPlaces(await response.json());
  }, [showArchived]);

  useEffect(() => {
    loadMarketPlaces()
      .catch((err) => setHttpError(err.message))
      .finally(() => setIsLoading(false));
  }, [loadMarketPlaces]);

  // Runs an action, then reloads this list and the navbar selector
  const run = async (action: () => Promise<void>) => {
    try {
      setHttpError(null);
      await action();
      await Promise.all([loadMarketPlaces(), refresh()]);
    } catch (err: any) {
      setHttpError(err.message);
    }
  };

  const setArchived = (market: MarketPlaceModel, archived: boolean) =>
    run(async () => {
      const response = await fetchWithAuth(
        `${BASE_URL}/marketplaces/${market.id}/${archived ? "archive" : "restore"}`,
        { method: "PATCH" },
      );
      if (!response.ok) throw new Error("Cannot update market place");
    });

  const deleteMarketPlace = (market: MarketPlaceModel) => {
    if (!window.confirm(`Delete "${market.name}"?`)) return;
    run(async () => {
      const response = await fetchWithAuth(`${BASE_URL}/marketplaces/${market.id}`, {
        method: "DELETE",
      });
      if (response.status === 409) {
        throw new Error(
          `"${market.name}" already has orders and cannot be deleted. Archive it instead.`,
        );
      }
      if (!response.ok) throw new Error("Cannot delete market place");
    });
  };

  if (isLoading) return <SpinnerLoading />;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="mb-0">Market places</h3>
        <div className="d-flex align-items-center gap-3">
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="show-archived"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="show-archived">
              Show archived
            </label>
          </div>
          <Link to="/marketplaces/add" className="btn btn-primary">
            Add market place
          </Link>
        </div>
      </div>

      {httpError && <div className="alert alert-danger">{httpError}</div>}

      {marketPlaces.length === 0 ? (
        <div className="text-muted py-5 text-center">
          No market places yet. Add the first one, e.g. a Christmas market.
        </div>
      ) : (
        marketPlaces.map((market) => (
          <div
            key={market.id}
            className={`card list-card mb-2 ${market.active ? "" : "opacity-75"}`}
          >
            <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h5 className="card-title mb-1">
                  {market.name}
                  {current?.id === market.id && (
                    <span className="badge bg-success ms-2 align-middle">Current</span>
                  )}
                  {!market.active && (
                    <span className="badge bg-secondary ms-2 align-middle">Archived</span>
                  )}
                </h5>
                <div className="text-muted small">
                  {[
                    MARKET_PLACE_TYPE_LABELS[market.type],
                    market.address,
                    formatMarketDates(market),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                {market.notes && <div className="small mt-1">{market.notes}</div>}
              </div>

              <div className="d-flex flex-wrap gap-2">
                {market.active && current?.id !== market.id && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-ink"
                    onClick={() => run(() => selectMarket(market.id))}
                  >
                    Set as current
                  </button>
                )}
                <Link
                  to={`/marketplaces/edit/${market.id}`}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Edit
                </Link>
                {market.active ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setArchived(market, true)}
                  >
                    Archive
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setArchived(market, false)}
                  >
                    Restore
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteMarketPlace(market)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
