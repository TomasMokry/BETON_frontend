interface ProductSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ProductSearchBox = ({
  value,
  onChange,
  placeholder = "Search products",
}: ProductSearchBoxProps) => {
  return (
    <input
      className="form-control"
      type="search"
      placeholder={placeholder}
      aria-label="Search products"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") onChange("");
      }}
    />
  );
};
