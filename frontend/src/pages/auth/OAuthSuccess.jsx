import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { jwtDecode } from "jwt-decode";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const decoded = jwtDecode(token);

      const user = {
        id: decoded.id,
        email: decoded.email,
        name:
          decoded.name || decoded.given_name || decoded.email?.split("@")[0],
        avatar: decoded.picture || "",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.avatar) {
        localStorage.setItem("userAvatar", user.avatar);
      }

      login(user, token);

      // ✅ GO TO LANDING PAGE AFTER OAUTH
      navigate("/", { replace: true });
    } catch (err) {
      console.error("OAuth error:", err);
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-300">
      Signing you in…
    </div>
  );
}
