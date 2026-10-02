import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import { fetchWithAuth } from "../../services/fetchWithAuth";
import { useMarketPlace } from "../../context/MarketPlaceContext";
import {
  MARKET_PLACE_TYPE_LABELS,
  type MarketPlaceModel,
  type MarketPlaceRequest,
  type MarketPlaceType,
} from "../../models/MarketPlaceModel";

/** Add form at /marketplaces/add, edit form at /marketplaces/edit/:id. */
export const MarketPlaceForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const { refresh } = useMarketPlace();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<MarketPlaceType>("CHRISTMAS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;

    const loadMarketPlace = async () => {
      const response = await fetchWithAuth(`${BASE_URL}/marketplaces/${id}`);
      if (!response.ok) throw new Error("Cannot load market place");

      const data: MarketPlaceModel = await response.json();
      setName(data.name);
      setAddress(data.address ?? "");
      setType(data.type);
      setStartDate(data.startDate ?? "");
      setEndDate(data.endDate ?? "");
      setActive(data.active);
      setNotes(data.notes ?? "");
    };

    loadMarketPlace()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (name.trim() === "") {
      setError("Name is required");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      setError("End date must not be before start date");
      return;
    }

    const request: MarketPlaceRequest = {
      name: name.trim(),
      address: address.trim() || null,
      type,
      startDate: startDate || null,
      endDate: endDate || null,
      active,
      notes: notes.trim() || null,
    };

    setSaving(true);
    setError(null);
    try {
      const response = await fetchWithAuth(
        isEdit ? `${BASE_URL}/marketplaces/${id}` : `${BASE_URL}/marketplaces`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        },
      );
      if (!response.ok) throw new Error("Saving market place failed");

      await refresh();
      navigate("/marketplaces");
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading market place...</div>;
  }

  return (
    <div className="container mt-5 mb-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card form-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>{isEdit ? "Edit market place" : "Add market place"}</span>

          <button
            type="button"
            className="btn p-0 border-0"
            onClick={() => navigate("/marketplaces")}
            aria-label="Close"
            title="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-x-circle text-secondary"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={submit}>
            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label required" htmlFor="mp-name">
                  Name
                </label>
                <input
                  id="mp-name"
                  type="text"
                  className="form-control"
                  placeholder="Christmas market Brno"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label required" htmlFor="mp-type">
                  Type
                </label>
                <select
                  id="mp-type"
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as MarketPlaceType)}
                >
                  {Object.entries(MARKET_PLACE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="mp-address">
                Address
              </label>
              <input
                id="mp-address"
                type="text"
                className="form-control"
                placeholder="Náměstí Svobody, Brno"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label" htmlFor="mp-start">
                  Start date
                </label>
                <input
                  id="mp-start"
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label" htmlFor="mp-end">
                  End date
                </label>
                <input
                  id="mp-end"
                  type="date"
                  className="form-control"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3 d-flex align-items-end">
                <div className="form-check form-switch mb-2">
                  <input
                    id="mp-active"
                    className="form-check-input"
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="mp-active">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="mp-notes">
                Notes
              </label>
              <textarea
                id="mp-notes"
                className="form-control"
                rows={3}
                placeholder="Stall number, contact person, fee…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {isEdit ? "Save changes" : "Add market place"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
