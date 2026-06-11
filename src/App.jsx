import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import Projects from "./Pages/Projects";
import "./App.css";
import Contact from "./Pages/Contact";
import Admin from "./Admin/Admin";
import About from "./Pages/About";
function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />
        <Route
          path="/about"
          element={<About />} 
        />
        <Route
          path="/contact"
          element={<Contact />} 

        />



<Route
  path="/corepanel-admin"
  element={<Admin />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;