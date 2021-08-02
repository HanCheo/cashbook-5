import GitHubAPI from '../OAuth/git.oauth';

class AuthService {
  async getGitAccessToken(code: string) {
    const { access_token: accessToken } = await GitHubAPI.getAccessInfo(code);
    return accessToken;
  }
}

export default new AuthService();
