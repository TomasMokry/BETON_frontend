interface CategoryNavbarProps {
  categories: { id: number; name: string }[];
  selectedCategory: number | null;
  onSelect: (id: number | null) => void;
}

export const CategoryNavbar = ({
  categories,
  selectedCategory,
  onSelect,
}: CategoryNavbarProps) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light w-100 category-tabs">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#categoryNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="categoryNavbar">
          <ul className="navbar-nav mx-auto">
            {/* ALL */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${selectedCategory === null ? "active" : ""}`}
                onClick={() => onSelect(null)}
              >
                All
              </button>
            </li>

            {categories.map((cat) => (
              <li className="nav-item" key={cat.id}>
                <button
                  className={`nav-link btn btn-link ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => onSelect(cat.id)}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
