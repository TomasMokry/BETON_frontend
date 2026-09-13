import ProductModel from "../../../models/ProductModel";

interface ProductProps {
  product: ProductModel;
  onAddToCart: (productId: number) => void;
}

export const Product: React.FC<ProductProps> = (props) => {
  const productInfo = `${props.product.color} · ${props.product.size}`;

  return (
    <div className="col">
      <div className="card product-card h-100">
        <img
          src={props.product.urlImage}
          alt={props.product.name}
          className="card-img-top"
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-1">{props.product.name}</h5>
          <span className="product-price d-block mb-1">
            {props.product.price.toFixed(2)} Kč
          </span>
          <p className="card-text mb-1">{productInfo}</p>
          <p className="card-text small">{props.product.amount} in stock</p>
          <button
            type="button"
            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center mt-auto"
            onClick={() => props.onAddToCart(props.product.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-cart-plus-fill"
              viewBox="0 0 16 16"
            >
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
            </svg>
            <span className="ms-3">Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
