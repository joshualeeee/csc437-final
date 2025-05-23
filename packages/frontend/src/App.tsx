import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Write from "./components/Write";
import View from "./components/View";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<Write />} />
          <Route path="/view" element={<View />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
