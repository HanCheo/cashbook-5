import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import svg from '@/src/assets/svg';
import './index.scss';

interface IState {}

interface IProps {}

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
          <div class="oauth">
            ${svg.octocat}
            <a href="https://github.com/login/oauth/authorize?client_id=a7dc79e69898ab6de34d">깃허브 로그인</a>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }
}
