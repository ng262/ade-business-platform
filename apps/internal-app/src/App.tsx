import { Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/LoginPage";
import ChallengePage from "@/pages/ChallengePage";
import ForbiddenPage from "@/pages/ForbiddenPage";
import AttendancePage from "@/pages/AttendancePage";
import BillingPage from "@/pages/BillingPage";

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="billing" element={<BillingPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </UserProvider>
  );
}
