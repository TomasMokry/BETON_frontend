export const HomePage = () => {
  return (
    <div className="hero d-flex align-items-center justify-content-center">
      <div className="text-center px-3">
        <img
          src="/images/products/logo/be.ton_big.png"
          alt="be.ton"
          className="hero-mark hero-in"
        />

        <p className="hero-sub mx-auto mt-4 hero-in-delay">
          Small-batch concrete vases, bowls and planters, cast and finished
          by hand.
        </p>

        <p className="hero-in-delay mt-4 mb-2" style={{ color: "rgba(245, 242, 234, 0.75)" }}>
          This is a beta. Sign in with the demo account below to explore
          products and orders.
        </p>

        <dl className="hero-access d-inline-flex gap-4 mx-auto mt-2 mb-0 hero-in-delay">
          <div className="text-start">
            <dt className="mb-1">Demo email</dt>
            <dd className="mb-0">admin@email.com</dd>
          </div>
          <div className="text-start">
            <dt className="mb-1">Demo password</dt>
            <dd className="mb-0">admin</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
