import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import './index.scss';

interface IState {
  text: string;
}

interface IProps {
  text: string;
  duration?: number;
}

const defaultProperty = {
  text: '',
  duration: 2,
};

export default class Snackbar extends Component<IState, IProps> {
  setup() {
    const { text, duration } = this.$props;
    if (duration === undefined) this.$props.duration = defaultProperty.duration;
    if (text === undefined) this.$props.text = defaultProperty.text;
  }

  template() {
    const { text } = this.$props;
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
    const { duration } = this.$props;
    if (duration) {
      const dropDuration = duration / 4;
      const progressDuration = duration;
      const snackBar = this.$target.querySelector('.snack-bar') as HTMLElement;
      const snackBarProgress = this.$target.querySelector('.snack-bar > hr') as HTMLElement;
      setTimeout(() => {
        snackBar.style.animation = `topShow ${dropDuration}s ease-in-out forwards`;
        snackBarProgress.style.animation = `progress ${progressDuration}s linear 1 forwards;`;
        setTimeout(() => {
          snackBar.remove();
        }, (progressDuration + dropDuration) * 1000);
      }, 10);
    }
  }
}
