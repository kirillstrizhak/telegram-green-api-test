import axios from "axios";
import { loadAuth } from "../../../features/auth/auth";

let inFlight: Promise<any> | null = null;

export async function sendMessageApi(
  message: string,
  chatId: string,
  typingTime: number,
) {
  const authData = loadAuth();
  if (!authData) {
    return undefined;
  }
  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${authData.idInstance}/sendMessage/${authData.apiTokenInstance}`;

  try {
    const { data } = await axios.post<{ idMessage: string }>(
      url,
      { chatId, message, typingTime },
      { headers: { "Content-Type": "application/json" } },
    );
    return data;
  } catch (error) {
    return undefined;
  }
}

export async function receiveNotificationApi() {
  const authData = loadAuth();
  if (!authData) {
    return undefined;
  }
  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${authData.idInstance}/receiveNotification/${authData.apiTokenInstance}`;

  try {
    const response = await axios(url);
    return response.data;
  } catch (error) {
    return undefined;
  }
}

export async function deleteNotificationApi(receiptId: number) {
  const authData = loadAuth();
  if (!authData) {
    return undefined;
  }
  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${authData.idInstance}/deleteNotification/${authData.apiTokenInstance}/${receiptId}`;

  try {
    const response = await axios(url);
    return response.data;
  } catch (error:  any) {
    return error?.data ?? undefined;
  }
}