import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((store) => store.user?.data || store.user);

  if (!user?._id) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;  
};

export default ProtectedRoute;
