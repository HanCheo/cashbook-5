import qs from 'qs';
import fetch from 'node-fetch';
import env from '../config/index';

type AuthResponse = {
  access_token: string;
  token_type: string;
  scope: string;
};

type GithubUserResponse = {
  login: string;
  avatar_url: string;
};


const OAUTH_GIT_URL = 'https://github.com/login/oauth';
const API_GIT_URL = 'https://api.github.com/user';

class GithubAuthManager {
  async getAccessInfo(code: string): Promise<AuthResponse> {
    const querystring = qs.stringify({
      client_id: env.GIT_CLIENT_ID,
      client_secret: env.GIT_CLIENT_SECRET,
      code,
    });
    const res = await fetch(`${OAUTH_GIT_URL}/access_token?` + querystring, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
    });
    return res.json();
  }

  async getUserInfo(accessToken: string): Promise<GithubUserResponse> {
    const res = await fetch(`${API_GIT_URL}`, {
      headers: {
        accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.json();
  }
}

const githubManagerInstance =  new GithubAuthManager();
export default githubManagerInstance;
