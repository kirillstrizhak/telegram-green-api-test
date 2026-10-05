export type Chat = {
  chatId: string;
  name: string;
  type: string;
  phoneNumber: number;
  username: string;
};

export type ChatUserData = {
  avatar: string;
  name: string;
  contactName: string;
  chatId: string;
  chatType: string;
  lastSeen: number;
  phoneNumber: number;
  phoneNumberTimestamp: number;
  username: string;
  isPremium: boolean;
  isVerified: boolean;
  isScam: boolean;
  description: string;
};

export type ChatUserAvatar = {
  urlAvatar: string;
};

export type EnrichedChat = Chat & {
  avatar: ChatUserAvatar | null;
  contact: ChatUserData | null;
  lastMessage: TextMessage;
};

export type TextMessage = {
  type: string;
  idMessage: string;
  timestamp: number;
  typeMessage: string;
  chatId: string;
  chatType: string;
  textMessage: string;
  isForwarded: boolean;
  forwardingScore: number;
  statusMessage: string;
  sendByApi: boolean;
  deletedMessageId: string;
  editedMessageId: string;
  isEdited: boolean;
  isDeleted: boolean;
};
