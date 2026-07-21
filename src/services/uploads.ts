import { http } from './http';
import type { MessageAttachment, UserSummary } from '../types/models';

export async function uploadAvatar(file: File): Promise<UserSummary> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await http.post<UserSummary>('/uploads/avatar', form);
  return data;
}

export async function uploadMedia(file: File): Promise<MessageAttachment> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await http.post<MessageAttachment>('/uploads/media', form);
  return data;
}
