import axios from "axios";
import { loadAuth } from "../../../features/auth/auth";
import type { Chat, EnrichedChat } from "./types";
import { getChatUserAvatar, getChatUserData } from "./getChatUserData";
import { getChatMessageHistory } from "./getMessagesHistory";

let inFlight: Promise<Chat[]> | null = null;

export async function getChats() {
  const authData = loadAuth();
  if (!authData) {
    return [] as Chat[];
  }

  const url = `${import.meta.env.VITE_APP_API_URL}/waInstance${authData.idInstance}/getChats/${authData.apiTokenInstance}`;

  if (inFlight) return inFlight;

  inFlight = axios
    .get(url, { timeout: 10000 })
    .then((res) => res.data as Chat[])
    .catch(() => [] as Chat[])
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

let enrichedInFlight: Promise<EnrichedChat[]> | null = null;
let enrichedCache: { data: EnrichedChat[]; ts: number } | null = null;
const TTL = 30_000;

export async function getEnrichedChats(): Promise<EnrichedChat[]> {
  if (enrichedCache && Date.now() - enrichedCache.ts < TTL) {
    return enrichedCache.data;
  }
  if (enrichedInFlight) {
    return enrichedInFlight;
  }

  enrichedInFlight = (async () => {
    const chats = await getChats();
    if (!chats.length) return [];

    const enriched: EnrichedChat[] = [];
    for (const chat of chats) {
      const [avatar, contact, history] = await Promise.all([
        getChatUserAvatar(chat.chatId),
        getChatUserData(chat.chatId),
        getChatMessageHistory(chat.chatId, 1),
      ]);
      enriched.push({
        ...chat,
        avatar: avatar ?? null,
        contact,
        lastMessage: history[0] ?? null,
      });
      await new Promise((r) => setTimeout(r, 300));
    }

    enrichedCache = { data: enriched, ts: Date.now() };
    return enriched;
  })().finally(() => {
    enrichedInFlight = null;
  });

  return enrichedInFlight;
}
