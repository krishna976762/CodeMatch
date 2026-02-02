import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = useSelector((store) => store.user?.data || store.user);

  // If user exists, redirect to home
  if (user?._id) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
