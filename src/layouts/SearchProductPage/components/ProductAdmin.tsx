import { Link } from "react-router-dom";
import ProductModel from "../../../models/ProductModel";
import { useState } from "react";

export const ProductAdmin: React.FC<{ product: ProductModel }> = (props) => {
  const [expanded, setExpanded] = useState(false);
  const productInfo = (
    <>
      {props.product.color} - {props.product.size} -{" "}
      <strong>{props.product.price} CZK</strong>
    </>
  );

  const toggleDetails = () => setExpanded((prev) => !prev);

  return (
    <div className="card list-card mt-2 mb-2">
      {/* TOP ROW */}
      <div className="row g-0">
        <div className="col-md-4">
          <div className="card-body">
            <h5 className="card-title">{props.product.name}</h5>
            <p className="card-text">{productInfo}</p>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card-body text-end">
            <div className="btn-group" role="group" aria-label="Basic example">
              <div className="me-5 mt-2 text-secondary">
                <h4 className="card-title"> {props.product.amount} ks</h4>
              </div>

              <Link
                to={`/products/edit/${props.product.id}`}
                className="btn-icon mx-2"
                data-bs-toggle="tooltip"
                title="Edit Product"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                  />
                </svg>
              </Link>

              {/* PRODUCT DETAIL TOGGLE BUTTON */}
              <button
                className="btn-icon mx-2"
                data-bs-toggle="tooltip"
                title="Product Detail"
                onClick={toggleDetails}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  fill="currentColor"
                  className="bi bi-search-heart"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018" />
                  <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`expand-section ${expanded ? "open" : ""}`}>
        {expanded && (
          <div className="card-body border-top bg-white">
            <div className="row">
              {/* LEFT COLUMN */}
              <div className="col-md-2">
                <p>
                  <strong>Height:</strong> {props.product.height} cm
                </p>
                <p>
                  <strong>Width:</strong> {props.product.width} cm
                </p>
                <p>
                  <strong>Length:</strong> {props.product.length} cm
                </p>
                <p>
                  <strong>Weight:</strong> {props.product.weight} g
                </p>
              </div>

              <div className="col-md-5">
                <p>
                  <strong>Short description:</strong>
                </p>
                <p>{props.product.description}</p>
                <p>
                  <strong>Price:</strong> {props.product.price} Kč
                </p>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-md-5 d-flex justify-content-end">
                <div className="mb-1 text-end">
                  <img
                    src={props.product.urlImage}
                    alt={props.product.name}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
