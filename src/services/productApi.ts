import { BASE_URL } from "../config";

// Blank query -> regular /products list (the /search endpoint returns [] for blank q)
export const buildProductsUrl = (query: string, categoryId: number | null) => {
  const q = query.trim();
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (categoryId !== null) params.set("categoryId", String(categoryId));

  const path = q ? "/products/search" : "/products";
  const qs = params.toString();

  return `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;
};
