import { useState } from "react";
import AddProductRequest from "../../../models/AddProductRequest";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../services/fetchWithAuth";
import { BASE_URL } from "../../../config";

export const AddNewProduct = () => {
  // New Product fields
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [weight, setWeight] = useState(0);
  const [length, setLength] = useState(0);
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [amount, setAmount] = useState(0);

  // Flags
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const navigate = useNavigate();

  // Available categories
  const allCategories = [
    { id: 1, name: "Vases" },
    { id: 2, name: "Trays" },
    { id: 3, name: "Planters" },
    { id: 4, name: "Pebbles" },
    { id: 5, name: "Bowls" },
    { id: 6, name: "Candles" },
  ];

  async function submitNewProduct() {
    const url = `${BASE_URL}/products`;

    if (
      name.trim() !== "" &&
      size.trim() !== "" &&
      color.trim() !== "" &&
      description.trim() !== "" &&
      urlImage.trim() !== "" &&
      price > 0 &&
      height > 0 &&
      width > 0 &&
      weight > 0 &&
      length > 0 &&
      amount > 0 &&
      categoryId > 0
    ) {
      const product = new AddProductRequest(
        name,
        size,
        price,
        height,
        width,
        weight,
        length,
        color,
        description,
        urlImage,
        amount,
        categoryId,
      );

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      };

      const response = await fetchWithAuth(url, requestOptions);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      // Reset form
      setName("");
      setSize("");
      setPrice(0);
      setHeight(0);
      setWidth(0);
      setWeight(0);
      setLength(0);
      setColor("");
      setDescription("");
      setUrlImage("");
      setCategoryId(0);
      setAmount(0);
      setDisplaySuccess(true);
      setDisplayWarning(false);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
    window.scrollTo(0, 0);
  }

  return (
    <div className="container mt-5 mb-5">
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Product added successfully
        </div>
      )}

      {displayWarning && (
        <div className="alert alert-danger" role="alert">
          All fields must be filled out
        </div>
      )}

      <div className="card form-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>New product</span>

          <button
            type="button"
            className="btn p-0 border-0"
            onClick={() => navigate("/admin")}
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
          <form>
            {/* BASIC PRODUCT INFO */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label required">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label required">Color</label>
                <input
                  type="text"
                  className="form-control"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label required">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={price === 0 ? "" : price}
                  onChange={(e) =>
                    setPrice(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* DIMENSIONS */}
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label required">Size</label>
                <input
                  type="text"
                  className="form-control"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label required">Height</label>
                <input
                  type="number"
                  className="form-control"
                  value={height === 0 ? "" : height}
                  onChange={(e) =>
                    setHeight(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label required">Width</label>
                <input
                  type="number"
                  className="form-control"
                  value={width === 0 ? "" : width}
                  onChange={(e) =>
                    setWidth(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label required">Weight</label>
                <input
                  type="number"
                  className="form-control"
                  value={weight === 0 ? "" : weight}
                  onChange={(e) =>
                    setWeight(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* URL FIELDS */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label required">Url Image</label>
                <input
                  type="text"
                  className="form-control"
                  value={urlImage}
                  onChange={(e) => setUrlImage(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label required">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount === 0 ? "" : amount}
                  onChange={(e) =>
                    setAmount(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label required">Length</label>
                <input
                  type="number"
                  className="form-control"
                  value={length === 0 ? "" : length}
                  onChange={(e) =>
                    setLength(e.target.value === "" ? 0 : Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* CATEGORIES */}
            <hr />
            <div className="row ms-3">
              {allCategories.map((cat) => (
                <div className="form-check col-md-2 mb-3" key={cat.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="category"
                    id={`cat-${cat.id}`}
                    checked={categoryId === cat.id}
                    onChange={() => setCategoryId(cat.id)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>

            {/* DESCRIPTIONS */}
            <hr />
            <div className="col-md-12 mb-3">
              <label className="form-label required">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* SUBMIT */}
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={submitNewProduct}
            >
              Create new product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
