import type { UserSummary } from '../types/models';
import { http } from './http';

export async function searchUsers(query: string): Promise<UserSummary[]> {
  const { data } = await http.get<UserSummary[]>('/users/search', { params: { q: query } });
  return data;
}
