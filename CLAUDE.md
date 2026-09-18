# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This git repository lives at `react-library/` inside a parent folder `E:\BETON\react`. The parent folder itself is *not* part of this repo (no `.git`) and its `package.json` (only dependency: `jwt-decode`) is a stray/unrelated file — ignore it. Always run commands from `react-library/`.

## Commands

- `npm run dev` — start the Vite dev server (default port 5173)
- `npm run build` — type-check (`tsc -b`) then build for production via Vite
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

There is no test suite/framework configured in this project.

## Architecture

This is a Vite + React 19 + TypeScript SPA (client only, no server code in this repo) for a webshop admin/storefront called BETON. Routing is via `react-router-dom` (`BrowserRouter` in `src/main.tsx`); all routes are declared in `src/App.tsx`.

**API backend**: A separate backend service, reached via `BASE_URL` from `src/config.ts` (`import.meta.env.VITE_API_BASE_URL`, set in `.env`). Currently points at `https://beton-production.up.railway.app`.

**Auth**: JWT-based, with the access token decoded client-side via `jwt-decode` and stored in `localStorage` under `"token"`.
- `src/auth/AuthContext.tsx` provides `AuthProvider`/`useAuth()` — holds `isAuthenticated`, `user`, `token`, and an `initialized` flag (used to avoid flashing unauthenticated UI before the initial `/auth/refresh` call resolves). Login/logout hit `${BASE_URL}/auth/login` and `/auth/logout` with `credentials: "include"` (refresh token is an httpOnly cookie).
- `src/auth/PrivateRoute.tsx` wraps protected routes — shows `SpinnerLoading` until `initialized`, then redirects to `/` if not authenticated.
- `src/services/fetchWithAuth.ts` is a fetch wrapper used for all authenticated API calls: it checks JWT expiry client-side before each request, refreshes proactively if needed, retries once on a `401`, and hard-redirects to `/` (via `window.location.href`, not React Router) if refresh fails. It calls `${BASE_URL}/auth/refresh` (from `config.ts`), consistent with `AuthContext.tsx`.

**Data flow**: No global state library — each page (e.g. `ProductPage`, `AdminProductsPage`, `OrdersPage`) manages its own fetched data with `useState`/`useEffect`, calling `fetchWithAuth` directly against `${BASE_URL}/...` REST endpoints (`/products`, `/categories`, `/carts`, `/carts/:id/items`, `/checkout`, `/orders`, etc.) and mapping JSON responses onto model classes in `src/models/` (e.g. `ProductModel`, `CartModel`, `CartItemModel`, `OrderModel`, `AddProductRequest`).

**Pages/layouts** (`src/layouts/`):
- `HomePage/` — public landing page and `LoginPage`
- `SearchProductPage/` — storefront `ProductPage` (product grid + cart sidebar + checkout), `AdminProductsPage`, `OrdersPage`, with shared pieces in `SearchProductPage/components/` (`Product`, `ProductAdmin`, `CategoryNavbar`, `Order`, `NotificationToast`)
- `ManageProductsPage/components/` — `AddNewProduct` and `EditProduct` forms (admin-only, behind `PrivateRoute`)
- `NavbarAndFooter/` — global `Navbar`/`Footer` rendered in `App.tsx` around all routes
- `utils/SpinnerLoading` — shared loading spinner

**Styling**: Bootstrap 5 is vendored as static files under `public/bootstrap/` (not an npm dependency) and referenced from `index.html`; component markup uses Bootstrap utility classes directly.

**Product images**: static assets under `public/images/products/<category>/`.
