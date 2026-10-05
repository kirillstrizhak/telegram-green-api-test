import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./pages/AuthPage/ui/AuthPage";
import ChatsPage from "./pages/ChatsPage/ui/ChatsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
