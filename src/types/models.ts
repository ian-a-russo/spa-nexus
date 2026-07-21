export type AttachmentType = 'IMAGE' | 'VIDEO';

export interface UserSummary {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface AuthResult {
  accessToken: string;
  user: UserSummary;
}

export interface MessageAttachment {
  url: string;
  type: AttachmentType;
  mimeType: string;
  size: number;
}

export interface LastMessagePreview {
  text: string | null;
  senderId: string;
  createdAt: string;
  attachmentType: AttachmentType | null;
}

export interface ConversationSummary {
  id: string;
  participant: UserSummary;
  lastMessage: LastMessagePreview | null;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  text: string | null;
  createdAt: string;
  sender: UserSummary;
  attachment: MessageAttachment | null;
}

export interface Invite {
  id: string;
  sender: UserSummary;
  receiver: UserSummary;
  createdAt: string;
}
