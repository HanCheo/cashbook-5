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

/**
getUserInfo 리턴값
{
  login: 'HanCheo',
  id: number,
  node_id: string,
  avatar_url: 'https://avatars.githubusercontent.com/u/38929712?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/HanCheo',
  html_url: 'https://github.com/HanCheo',
  followers_url: 'https://api.github.com/users/HanCheo/followers',
  following_url: 'https://api.github.com/users/HanCheo/following{/other_user}',
  gists_url: 'https://api.github.com/users/HanCheo/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/HanCheo/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/HanCheo/subscriptions',
  organizations_url: 'https://api.github.com/users/HanCheo/orgs',
  repos_url: 'https://api.github.com/users/HanCheo/repos',
  events_url: 'https://api.github.com/users/HanCheo/events{/privacy}',
  received_events_url: 'https://api.github.com/users/HanCheo/received_events',
  type: 'User',
  site_admin: false,
  name: 'HanCh',
  company: null,
  blog: '',
  location: null,
  email: null,
  hireable: null,
  bio: null,
  twitter_username: null,
  public_repos: 13,
  public_gists: 0,
  followers: 8,
  following: 3,
  created_at: '2018-05-03T01:27:47Z',
  updated_at: '2021-07-31T06:32:25Z'

getAccessInfo 리턴값
} {
  access_token: 'access_token',
  token_type: 'bearer',
  scope: ''
} 
*/

const OAUTH_GIT_URL = 'https://github.com/login/oauth';
const API_GIT_URL = 'https://api.github.com/user';

class GitHubAPI {
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

export default new GitHubAPI();
