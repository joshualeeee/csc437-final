import { Routes, Route, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Write from "./components/Write";
import View from "./components/View";
import { LoginPage } from "./components/LoginPage";
import { ValidRoutes } from "csc437-monorepo-backend/src/common/validRoutes";
import { ProtectedRoute } from "./ProtectedRoute";
import type { IApiJournalData } from "csc437-monorepo-backend/src/common/IApiData";

function App() {
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [journals, setJournals] = useState<IApiJournalData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      fetch("/api/journals", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setJournals(data))
        .catch((error) => console.error("Error fetching journals:", error));
    }
  }, [authToken]);

  const handleAuth = (token: string) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path={ValidRoutes.HOME}
        element={
          <ProtectedRoute authToken={authToken || ""}>
            {" "}
            <Home />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path={ValidRoutes.WRITE}
        element={
          <ProtectedRoute authToken={authToken || ""}>
            <Write authToken={authToken || ""} />
          </ProtectedRoute>
        }
      />
      <Route
        path={ValidRoutes.VIEW}
        element={
          <ProtectedRoute authToken={authToken || ""}>
            <View journals={journals} authToken={authToken || ""} />
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
  );
}

export default App;
