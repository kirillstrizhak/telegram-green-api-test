import { useEffect } from "react";
import { loadAuth } from "../../../shared/features/auth/auth";
import { useNavigate } from "react-router";

function ChatsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadAuth()) {
      navigate("/");
    }
  });

  return <main>chats</main>;
}

export default ChatsPage;
