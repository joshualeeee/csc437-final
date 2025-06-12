import { Routes, Route, useNavigate } from "react-router";
import { useState } from "react";
import Home from "./components/Home";
import Write from "./components/Write";
import View from "./components/View";
import { LoginPage } from "./components/LoginPage";
import { ValidRoutes } from "csc437-monorepo-backend/src/shared/ValidRoutes";

function App() {
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const navigate = useNavigate();

  const handleAuth = (token: string) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/write" element={<Write authToken={authToken || ""} />} />
      <Route path="/view" element={<View authToken={authToken || ""} />} />
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
