export const HomePage = () => {
  return (
    <div className="hero d-flex align-items-center justify-content-center">
      <div className="text-center px-3">
        <img
          src="/images/products/logo/be.ton_big.png"
          alt="be.ton"
          className="hero-mark hero-in"
        />

        <dl className="hero-access d-inline-flex gap-4 mx-auto mt-4 mb-0 hero-in-delay">
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
