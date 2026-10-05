import { useEffect, useState } from "react";
import { getEnrichedChats } from "../api/getChats";
import styles from "./ChatsPage.module.scss";
import type { Chat, EnrichedChat } from "../api/types";
import { formaDate } from "../../../shared/helpers/formatDate";
import ButtonBase from "../../../shared/ui/ButtonBase/ButtonBase";
import InputBase from "../../../shared/ui/InputBase/InputBase";

function ChatsPage() {
  const [chatList, setChatList] = useState<EnrichedChat[]>();
  const [chatsLoading, setChatsLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<EnrichedChat | undefined>(undefined);
  const [message, setMessage] = useState("");

  const getUserChats = async () => {
    setChatsLoading(true);

    try {
      const userChats = await getEnrichedChats();
      setChatList(userChats);
    } finally {
      setChatsLoading(false);
    }
  };

  const getAvatarLetter = (name: string) => {
    if (!name) return "U";
    return name[0];
  };

  const selectChat = (chat: EnrichedChat | undefined) => {
    if(!chat) {
      setSelectedChat(undefined);
    }

    setSelectedChat(chat);
  };

  useEffect(() => {
    setTimeout(() => {
      getUserChats();
    }, 200);
  }, []);

  return (
    <main>
      <div className={styles["chats-wrapper"]}>
        <div className={styles["chats-container"]}>
          <div className={styles["chats-header"]}>
            <h2>Чаты</h2>
          </div>
          {chatList && chatList.length > 0 ? (
            <div className={styles["chats-list"]}>
              {chatList.map((chat: EnrichedChat) => (
                <div
                  className={styles["chat-card"]}
                  key={chat.chatId}
                  onClick={() => selectChat(chat)}
                >
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
                        {chat.lastMessage && chat.lastMessage.timestamp && (
                          <span>{formaDate(chat.lastMessage.timestamp)}</span>
                        )}
                      </div>
                      <div className={styles["chat-last-message"]}>
                        {chat.lastMessage.textMessage}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles["no-chats"]}>Чатов нет</div>
          )}
        </div>
        {selectedChat && (
          <div className={styles["messages-window"]}>
            <div className={styles["messages-window-header"]}>
              <button onClick={() => selectChat(undefined)}>
                <svg
                  width="23px"
                  height="23px"
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                >
                  <path
                    stroke="#fff"
                    d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"
                  ></path>
                </svg>
              </button>
              <div className={styles["messages-window-user"]}>
                <div className={styles["chat-avatar"]}>
                  {selectedChat.avatar && selectedChat.avatar.urlAvatar ? (
                    <img
                      src={selectedChat.avatar.urlAvatar}
                      alt={selectedChat.name}
                    />
                  ) : (
                    <>{getAvatarLetter(selectedChat.name)}</>
                  )}
                </div>
                <h2 className={styles["chat-name"]}>{selectedChat.name}</h2>
              </div>
            </div>
            <div className={styles["messages-window-messages"]}></div>
            <div className={styles["messages-window-text-box"]}>
              <InputBase value={message} onChange={(value) => setMessage(value)} placeholder="Введите сообщение..." addClass={styles["message-input"]}/>
              <ButtonBase onClick={() => console.log("Отправить")} addClass={styles["send-button"]}>Отправить</ButtonBase>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ChatsPage;
