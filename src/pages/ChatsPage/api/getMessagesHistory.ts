import axios from "axios";
import { loadAuth } from "../../../features/auth/auth";
import type { TextMessage } from "./types";

export async function getChatMessageHistory(chatId: string, count: number) {
  const authData = loadAuth();
  if (!authData) {
    return [] as TextMessage[];
  }

  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${authData.idInstance}/getChatHistory/${authData.apiTokenInstance}`;;

  try  {
    const response = await axios.post(url, {chatId, count});  
    return response.data as TextMessage[];
  } catch (error) {
    return [] as TextMessage[];
  }
}