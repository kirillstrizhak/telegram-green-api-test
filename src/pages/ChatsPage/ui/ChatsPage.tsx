import { useEffect, useRef, useState } from "react";
import { getEnrichedChats } from "../api/getChats";
import styles from "./ChatsPage.module.scss";
import type { Chat, EnrichedChat, TextMessage } from "../api/types";
import { formaDate } from "../../../shared/helpers/formatDate";
import ButtonBase from "../../../shared/ui/ButtonBase/ButtonBase";
import InputBase from "../../../shared/ui/InputBase/InputBase";
import { getChatMessageHistory } from "../api/getMessagesHistory";
import { deleteNotificationApi, readChat, receiveNotificationApi, sendMessageApi } from "../api/sendOrReceiveMessage";
import Preloader from "../../../shared/ui/Preloader/Preloader";
import { clearAuth } from "../../../features/auth/auth";
import { useNavigate } from "react-router";
import { checkAccount, getChatUserData } from "../api/getChatUserData";

function ChatsPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatList, setChatList] = useState<EnrichedChat[]>();
  const [selectedChat, setSelectedChat] = useState<EnrichedChat | undefined>(undefined);
  const [currentMessagesList, setCurrentMessagesList] = useState<TextMessage[]>();
  const [messageToSend, setMessageToSend] = useState("");
  const [messageToSendPanel, setMessageToSendPanel] = useState("");
  const [phoneToFind, setPhoneToFind] = useState("");
  const [usernameToFind, setUsernameToFind] = useState("");

  const [chatsLoading, setChatsLoading] = useState(false);
  const [messagesLoading, setMessagesLoadingLoading] = useState(false);
  const [newChatError, setNewChatError] = useState("");

  const [lookupMode, setLookupMode] = useState<"phone" | "username">("phone");

  const getUserChats = async () => {
    setChatsLoading(true);

    try {
      const userChats = await getEnrichedChats();
      setChatList(userChats);
      console.log(userChats);
    } finally {
      setChatsLoading(false);
    }
  };

  const getAvatarLetter = (name: string) => {
    if (!name) return "U";
    return name[0];
  };

  const selectChat = async (chat: EnrichedChat | undefined) => {
    if (!chat) {
      setSelectedChat(undefined);
    }

    setSelectedChat(chat);
    getMessagesHistory(chat);
    await readChat(chat?.chatId);
  };

  const getMessagesHistory = async (chat: EnrichedChat | undefined) => {
    if (!chat) {
      setCurrentMessagesList([]);
      return;
    }

    setMessagesLoadingLoading(true);

    setTimeout(async () => {
      try {
        const messages = await getChatMessageHistory(chat.chatId, 150);
        setCurrentMessagesList(messages);
      } finally {
        setMessagesLoadingLoading(false);
      }
    }, 100);
  };

  const sendMessage = async (chatId: string | undefined, message: string) => {
    const text = message.trim();
    if (!text || !chatId) return;

    setMessageToSend("");

    try {
      const response = await sendMessageApi(text, chatId, 1000);

      const newMessage: TextMessage = {
        type: "outgoing",
        idMessage: response?.idMessage ?? crypto.randomUUID(),
        timestamp: Math.floor(Date.now() / 1000),
        typeMessage: "textMessage",
        chatId: chatId,
        chatType: "user",
        textMessage: text,
        isForwarded: false,
        forwardingScore: 0,
        senderId: chatId,
        senderType: "user",
        senderContactName: "",
        deletedMessageId: "",
        editedMessageId: "",
        isEdited: false,
        isDeleted: false,
      };

      addMessageToChat(chatId, newMessage);
    } catch (err) {
      console.error("Не удалось отправить сообщение", err);
    }
  };

  const createNewChat = async () => {
    const text = messageToSendPanel.trim();
    const phone = phoneToFind.trim();
    const username = usernameToFind.trim();

    if (!text) return;

    const lookupParams = lookupMode === "username" ? { username } : { phoneNumber: Number(phone) };

    if (lookupMode === "username" && !username) return;
    if (lookupMode === "phone" && !phone) return;

    const account = await checkAccount(lookupParams);
    if (!account?.exist || !account.chatId) {
      setNewChatError("Аккаунт не найден");
      return;
    }

    setNewChatError("");

    const chatId = account.chatId;

    const existingChat = chatList?.find((chat) => chat.chatId === chatId);
    if (existingChat) {
      setPhoneToFind("");
      setUsernameToFind("");
      setMessageToSendPanel("");
      await selectChat(existingChat);
      await sendMessage(chatId, text);
      return;
    }

    const userData = await getChatUserData(chatId);
    const newChat: EnrichedChat = {
      type: "user",
      chatId,
      name: userData?.name || username || phone,
      username: userData?.username || username,
      phoneNumber: userData?.phoneNumber || Number(phone) || 0,
      avatar: (userData?.avatar as any) ?? null,
      contact: userData ?? null,
      lastMessage: null,
    };

    setChatList((prev) => [newChat, ...(prev ?? [])]);
    setSelectedChat(newChat);
    setCurrentMessagesList([]);
    setPhoneToFind("");
    setUsernameToFind("");
    setMessageToSendPanel("");

    await sendMessage(chatId, text);
  };

  const addMessageToChat = (chatId: string, message: TextMessage) => {
    if (chatId === selectedChat?.chatId || chatId.replace(/@c\.us$/, "") === selectedChat?.phoneNumber.toString()) {
      setCurrentMessagesList((prev) => [...(prev ?? []), message]);
    }

    setChatList((prev) =>
      prev?.map((chat) =>
        chat.chatId === chatId || chatId.replace(/@c\.us$/, "") === chat.phoneNumber.toString() ? { ...chat, lastMessage: message } : chat,
      ),
    );
  };

  const receiveNotificationsPoll = async () => {
    const notification = await receiveNotificationApi();

    if (notification) {
      await deleteNotificationApi(notification.receiptId);

      const incomingMessage = {
        ...notification.body.messageData.textMessageData,
        type: "incoming",
      };

      addMessageToChat(notification.body.senderData.chatId, incomingMessage);
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  useEffect(() => {
    let cancelled = false;

    const loop = async () => {
      while (!cancelled) {
        try {
          await receiveNotificationsPoll();
        } catch (e) {
          console.error("poll error", e);
        }
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 2000));
      }
    };

    getUserChats();
    loop();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [currentMessagesList]);

  return (
    <main>
      <div className={styles["chats-wrapper"]}>
        <div className={styles["chats-container"]}>
          <div className={styles["chats-header"]}>
            <h2>Чаты</h2>
            <ButtonBase onClick={() => logout()} addClass={styles["logout-button"]}>
              Выйти
            </ButtonBase>
          </div>
          <div className={styles["chats-chats-add"]}>
            <p className={styles["hint-base"]}>
              Введите номер телефона пользователя и нажмите "Написать" чтобы отправить сообщение по номеру телефона или никнейму.
            </p>
            <div className={styles["chats-chats-add-form"]}>
              <div className={styles["lookup-mode-toggle"]}>
                <label>
                  <input
                    type="radio"
                    name="lookupMode"
                    value="phone"
                    checked={lookupMode === "phone"}
                    onChange={() => setLookupMode("phone")}
                  />
                  По номеру телефона
                </label>
                <label>
                  <input
                    type="radio"
                    name="lookupMode"
                    value="username"
                    checked={lookupMode === "username"}
                    onChange={() => setLookupMode("username")}
                  />
                  По никнейму
                </label>
              </div>

              {lookupMode === "phone" ? (
                <InputBase value={phoneToFind} onChange={(value) => setPhoneToFind(value)} placeholder="79250000000" />
              ) : (
                <InputBase value={usernameToFind} onChange={(value) => setUsernameToFind(value)} placeholder="@username" />
              )}

              <InputBase
                value={messageToSendPanel}
                onChange={(value) => setMessageToSendPanel(value)}
                placeholder="Введите сообщение..."
                onKeyDown={(e) => e.key === "Enter" && createNewChat()}
              />

              {newChatError && <p className={styles["error-message"]}>{newChatError}</p>}

              <ButtonBase onClick={() => createNewChat()} addClass={styles["logout-button"]}>
                Написать
              </ButtonBase>
            </div>
          </div>
          <div className={styles["chats-list-container"]}>
            {chatsLoading ? (
              <Preloader />
            ) : (
              <>
                {chatList && chatList.length > 0 ? (
                  <div className={styles["chats-list"]}>
                    {chatList.map((chat: EnrichedChat) => (
                      <div className={styles["chat-card"]} key={chat.chatId} onClick={() => selectChat(chat)}>
                        <div className={styles["chat-user"]}>
                          <div className={styles["chat-avatar"]}>
                            {chat.avatar && chat.avatar.urlAvatar ? (
                              <img src={chat.avatar.urlAvatar} alt={chat.name} />
                            ) : (
                              <>{getAvatarLetter(chat.name)}</>
                            )}
                          </div>
                          <div className={styles["chat-main-data"]}>
                            <div className={styles["chat-name"]}>
                              {chat.name}
                              {chat.lastMessage && chat.lastMessage.timestamp && <span>{formaDate(chat.lastMessage.timestamp)}</span>}
                            </div>
                            {chat.lastMessage && chat.lastMessage.textMessage && (
                              <div className={styles["chat-last-message"]}>{chat.lastMessage.textMessage}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles["no-chats"]}>
                    <p>Чатов нет</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {selectedChat && (
          <div className={styles["messages-window"]}>
            <div className={styles["messages-window-header"]}>
              <button onClick={() => selectChat(undefined)}>
                <svg width="23px" height="23px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path
                    stroke="#fff"
                    d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"
                  ></path>
                </svg>
              </button>
              <div className={styles["messages-window-user"]}>
                <div className={styles["chat-avatar"]}>
                  {selectedChat.avatar && selectedChat.avatar.urlAvatar ? (
                    <img src={selectedChat.avatar.urlAvatar} alt={selectedChat.name} />
                  ) : (
                    <>{getAvatarLetter(selectedChat.name)}</>
                  )}
                </div>
                <h2 className={styles["chat-name"]}>{selectedChat.name}</h2>
              </div>
            </div>
            <div className={styles["messages-window-messages-wrapper"]}>
              {messagesLoading ? (
                <Preloader />
              ) : (
                <>
                  <div
                    className={`${styles["messages-window-messages"]} ${messagesLoading || !currentMessagesList || currentMessagesList.length === 0 ? styles["loading"] : ""}`}
                  >
                    {currentMessagesList && currentMessagesList.length > 0 ? (
                      currentMessagesList.map(
                        (message: TextMessage) =>
                          message.typeMessage === "textMessage" && (
                            <div
                              className={`${styles["messages-window-message-wrapper"]} ${message.type === "incoming" ? styles["incoming"] : ""}`}
                              key={message.idMessage}
                            >
                              <div
                                className={`${styles["messages-window-message"]} ${message.type === "incoming" ? styles["incoming"] : ""}`}
                              >
                                {message.textMessage}
                              </div>
                            </div>
                          ),
                      )
                    ) : (
                      <div className={styles["no-chats"]}>
                        <p>Сообщений нет</p>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef}></div>
                </>
              )}
            </div>
            {!messagesLoading && (
              <div className={styles["messages-window-text-box"]}>
                <InputBase
                  value={messageToSend}
                  onChange={(value) => setMessageToSend(value)}
                  placeholder="Введите сообщение..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(selectedChat.chatId, messageToSend)}
                  addClass={styles["message-input"]}
                />
                <ButtonBase onClick={() => sendMessage(selectedChat.chatId, messageToSend)} addClass={styles["send-button"]}>
                  Отправить
                </ButtonBase>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default ChatsPage;
