import { Routes, Route, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import { AllJournals } from "./AllJournals";
import { LoginPage } from "./components/LoginPage";
import { ValidRoutes } from "csc437-monorepo-backend/src/common/validRoutes";
import { ProtectedRoute } from "./ProtectedRoute";
import type { IApiJournalData } from "csc437-monorepo-backend/src/common/IApiData";
import { Toaster } from "react-hot-toast";

enum JournalComponent {
  WRITE = "write",
  VIEW = "view",
}

function App() {
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [journals, setJournals] = useState<IApiJournalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const fetchJournals = () => {
    if (!authToken) return;

    setIsLoading(true);
    setHasError(false); // reset error on new attempt

    fetch("/api/journals", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch journals");
        }
        return response.json();
      })
      .then((data) => {
        setJournals(data);
        setIsLoading(false);
        setHasError(false);
      })
      .catch((error) => {
        console.error("Error fetching journals:", error);
        setIsLoading(false);
        setHasError(true);
      });
  };

  useEffect(() => {
    fetchJournals();
  }, [authToken]);

  const handleAuth = (token: string) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
    navigate("/");
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path={ValidRoutes.HOME}
          element={
            <ProtectedRoute authToken={authToken || ""}>
              <Home />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path={ValidRoutes.WRITE}
          element={
            <ProtectedRoute authToken={authToken || ""}>
              <AllJournals
                authToken={authToken || ""}
                isLoading={isLoading}
                hasError={hasError}
                journals={journals}
                component={JournalComponent.WRITE}
                refetchJournals={fetchJournals}
              ></AllJournals>
            </ProtectedRoute>
          }
        />
        <Route
          path={ValidRoutes.VIEW}
          element={
            <ProtectedRoute authToken={authToken || ""}>
              <AllJournals
                authToken={authToken || ""}
                isLoading={isLoading}
                hasError={hasError}
                journals={journals}
                component={JournalComponent.VIEW}
                refetchJournals={fetchJournals}
              ></AllJournals>
            </ProtectedRoute>
          }
        />
        <Route
          path={ValidRoutes.LOGIN}
          element={<LoginPage isRegistering={false} onAuth={handleAuth} />}
        />
        <Route
          path={ValidRoutes.REGISTER}
          element={<LoginPage isRegistering={true} onAuth={handleAuth} />}
        />
      </Routes>
    </>
  );
}

export default App;
