import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Signup is now handled inside AuthLogin (sliding panel)
// This just redirects to /signup which AuthLogin handles
function AuthSignup() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { replace: true });
    // Small delay then trigger signup panel
    setTimeout(() => navigate("/signup", { replace: true }), 50);
  }, []);
  return null;
}

export default AuthSignup;