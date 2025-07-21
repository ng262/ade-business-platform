import { Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/LoginPage";
import ChallengePage from "@/pages/ChallengePage";
import ForbiddenPage from "@/pages/ForbiddenPage";
import HomePage from "@/pages/HomePage";
import AttendancePage from "@/pages/AttendancePage";

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider attribute="class" defaultTheme="system" storageKey="theme">
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
            <Route path="" element={<HomePage />} />
            <Route path="attendance" element={<AttendancePage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </UserProvider>
  );
}
