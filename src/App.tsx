import React from "react";
import "./App.css";
import LogIn from "./components/LogIn";
import SearchPage from "./components/Search/SearchPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatchedDog from "./components/Search/MatchedDog";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/matched-dog/:dogId" element={<MatchedDog />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
