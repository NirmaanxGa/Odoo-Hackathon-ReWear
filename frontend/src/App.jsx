import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { UserProvider } from "./context/UserContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import LottieLoader from "./components/LottieLoader";

// Pages
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import AddItem from "./pages/AddItem";
import ItemDetail from "./pages/ItemDetail";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Cart from "./pages/Cart";
import History from "./pages/History";
import Rewards from "./pages/Rewards";

const AppContent = () => {
  const { isLoading: dynamicLoading } = useLoading();

  return (
    <>
      {dynamicLoading && <LottieLoader />}
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/admin" element={<AdminPanel />} />

            {/* Protected Routes */}
            <Route
              path="/add-item"
              element={
                <ProtectedRoute>
                  <AddItem />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      404
                    </h1>
                    <p className="text-gray-600 mb-8">Page not found</p>
                    <a
                      href="/"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{
            fontSize: "14px",
          }}
          toastStyle={{
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    </>
  );
};

const App = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Check if this is a page refresh
    const isRefresh =
      performance.navigation.type === performance.navigation.TYPE_RELOAD ||
      sessionStorage.getItem("isRefresh") === "true";

    if (isRefresh) {
      sessionStorage.setItem("isRefresh", "false");
    }

    // Simulate app initialization/loading
    const timer = setTimeout(
      () => {
        setIsInitialLoading(false);
      },
      isRefresh ? 3000 : 2500
    ); // Longer loading for refresh

    return () => clearTimeout(timer);
  }, []);

  // Listen for page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isRefresh", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Show Lottie loader while app is loading initially
  if (isInitialLoading) {
    return <LottieLoader />;
  }

  return (
    <LoadingProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </LoadingProvider>
  );
};

export default App;
