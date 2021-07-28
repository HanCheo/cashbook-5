import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import './index.scss';

interface IState {
  text: string;
}

interface IProps {
  text: string;
}

export default class Snackbar extends Component<IState, IProps> {
  setup() {
    const { text } = this.$props;

    this.$state = {
      text,
    };
  }

  template() {
    const { text } = this.$state;
    return html`<div class="snack-bar">
      ${text}
      <hr class="progress" />
    </div>`;
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }

  mounted() {
    const snackBar = this.$target.querySelector('.snack-bar') as HTMLElement;
    setTimeout(() => {
      snackBar.classList.add('show');
      setTimeout(() => {
        snackBar.remove();
      }, 2000);
    }, 10);
  }
}
