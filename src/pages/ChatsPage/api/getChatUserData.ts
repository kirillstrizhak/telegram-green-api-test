import axios from "axios";
import { loadAuth } from "../../../features/auth/auth";
import type { ChatUserAvatar, ChatUserData } from "./types";

export async function getChatUserData(chatId: string) {
  const authData = loadAuth();
  if (!authData) {
    return null;
  }

  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${authData.idInstance}/getContactInfo/${authData.apiTokenInstance}`;;

  try  {
    const response = await axios.post(url, {chatId});  
    return response.data as ChatUserData;
  } catch (error) {
    return null;
  }
}

export async function getChatUserAvatar(chatId: string) {
  const authData = loadAuth();
  if (!authData) {
    return null;
  }

  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${authData.idInstance}/getAvatar/${authData.apiTokenInstance}`;;

  try  {
    const response = await axios.post(url, {chatId});  
    return response.data as ChatUserAvatar;
  } catch (error) {
    return null;
  }
}

export async function checkAccount(phoneNumber: number) {
  const authData = loadAuth();
  if (!authData) {
    return null;
  }

  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${authData.idInstance}/checkAccount/${authData.apiTokenInstance}`;;

  try  {
    const response = await axios.post(url, {phoneNumber});  
    return response.data as any;
  } catch (error) {
    return null;
  }
}