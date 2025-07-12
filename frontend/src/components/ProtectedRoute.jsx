import React from "react";
import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";
import { useUserContext } from "../context/UserContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { userRole } = useUserContext();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (requireAdmin && userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
