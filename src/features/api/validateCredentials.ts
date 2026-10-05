import axios from 'axios';
import type { AuthData } from '../auth/auth';

export async function validateCredentials(authData: AuthData) {
  const { idInstance, apiTokenInstance } = authData;
  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;

  try {
    const response = await axios.get(url, { timeout: 10000 });

    if (response.data.stateInstance === 'authorized') {
      return { valid: true, state: response.data.stateInstance };
    }

    return {
      valid: false,
      reason: `Инстанс не авторизован (статус: ${response.data.stateInstance}). Подключите Telegram-аккаунт в личном кабинете GREEN-API.`,
    };
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        return { valid: false, reason: 'Неверный apiTokenInstance' };
      }
      if (status === 403) {
        return { valid: false, reason: 'Неверный idInstance' };
      }
      return { valid: false, reason: `Ошибка API: ${status}` };
    }

    if (error.request) {
      return { valid: false, reason: 'Нет ответа от сервера. Проверьте интернет или CORS.' };
    }

    return { valid: false, reason: `Ошибка: ${error.message}` };
  }
}