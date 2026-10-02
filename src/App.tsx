import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { ProductPage } from "./layouts/SearchProductPage/ProductPage";
import { AdminProductsPage } from "./layouts/SearchProductPage/AdminProductsPage";
import { EditProduct } from "./layouts/ManageProductsPage/components/EditProduct";
import { AddNewProduct } from "./layouts/ManageProductsPage/components/AddNewProduct";
import { HomePage } from "./layouts/HomePage/HomePage";
import { OrdersPage } from "./layouts/SearchProductPage/OrdersPage";
import { AuthProvider } from "./auth/AuthContext";
import { PrivateRoute } from "./auth/PrivateRoute";
import { AdminRoute } from "./auth/AdminRoute";
import { LoginPage } from "./layouts/HomePage/LoginPage";
import { MarketPlaceProvider } from "./context/MarketPlaceContext";
import { MarketPlacesPage } from "./layouts/MarketPlacesPage/MarketPlacesPage";
import { MarketPlaceForm } from "./layouts/MarketPlacesPage/MarketPlaceForm";

function App() {
  return (
    <AuthProvider>
      <MarketPlaceProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />

          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />

              <Route path="/home" element={<HomePage />} />

              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <ProductPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/products/edit/:id"
                element={
                  <AdminRoute>
                    <EditProduct />
                  </AdminRoute>
                }
              />

              <Route
                path="/products/add"
                element={
                  <AdminRoute>
                    <AddNewProduct />
                  </AdminRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <OrdersPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminProductsPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/marketplaces"
                element={
                  <PrivateRoute>
                    <MarketPlacesPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/marketplaces/add"
                element={
                  <PrivateRoute>
                    <MarketPlaceForm />
                  </PrivateRoute>
                }
              />

              <Route
                path="/marketplaces/edit/:id"
                element={
                  <PrivateRoute>
                    <MarketPlaceForm />
                  </PrivateRoute>
                }
              />

              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </MarketPlaceProvider>
    </AuthProvider>
  );
}

export default App;
