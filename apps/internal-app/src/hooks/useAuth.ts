import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthListener() {
  const { setUser } = useUser();

  useEffect(() => {
    const handle = () => setUser(null);
    window.addEventListener("unauthorized", handle);
    return () => window.removeEventListener("unauthorized", handle);
  }, []);
}

export function useAuthRedirect() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
}

export function useAuth() {
  useAuthRedirect();
  useAuthListener();
}
