import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Write from "./components/Write";
import View from "./components/View";
import Entry from "./components/Entry";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/write" element={<Write />} />
          <Route path="/view" element={<View />} />
          <Route path="/entry/:id" element={<Entry />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
