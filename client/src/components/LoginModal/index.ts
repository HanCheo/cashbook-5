import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import svg from '@/src/assets/svg';
import './index.scss';
import { qs } from '@/src/utils/selectHelper';
import { getGitLoginUrl } from '@/src/api/loginAPI';

interface IState { }

interface IProps { }

export default class LoginModal extends Component<IState, IProps> {
  template() {
    return html`
      <div class="login-modal-wrapper">
        <div class="blur-background"></div>
        <div class="login-modal-container">
          <div class="login-modal--title">
            <div class="logo">Woowa<br />Money Diary</div>
            <div class="avatar">${svg.userAvatar}</div>
          </div>
          <div class="title">Login</div>
          <div class="oauth" id="gitOAuthPath">
            ${svg.octocat}
            <a>깃허브 로그인</a>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const gitOAuthPathTarget = qs('#gitOAuthPath', this.$target) as HTMLElement;
    gitOAuthPathTarget.addEventListener('click', async () => {
      const { url } = await getGitLoginUrl();
      location.href = url;
    });
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }
}
