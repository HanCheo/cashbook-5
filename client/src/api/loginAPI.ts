import { getFetch, Result } from './fetch';

export interface User {
  id: number;
  gitUsername: string;
  avatarURL: string;
}

export const checkUser = (): Promise<Result<User>> =>
  getFetch('/user/account', { headers: { 'Content-Type': 'application/json' } });

export const getGitLoginUrl = (): Promise<{ [key: string]: string }> =>
  getFetch('/auth/giturl', { headers: { 'Content-Type': 'application/json' } });
