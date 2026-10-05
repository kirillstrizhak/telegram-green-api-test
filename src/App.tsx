import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./pages/AuthPage/ui/AuthPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
