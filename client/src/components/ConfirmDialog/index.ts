import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import './index.scss';

interface IState {
  confirmCallback: Function;
  confirm: string;
  content: string;
  title?: string;
}

interface IProps {
  confirmCallback: Function;
  confirm: string;
  content: string;
  title?: string;
}

export default class ConfirmDialog extends Component<IState, IProps> {
  setup() {
    this.$state.confirmCallback = this.$props.confirmCallback;
    this.$state.confirm = this.$props.confirm;
    this.$state.content = this.$props.content;
    this.$state.title = this.$props.title;
  }

  template() {
    const { title, content, confirm } = this.$state;

    return html`
      <div class="dialog-backdrop"></div>
      <div class="dialog-wrapper show" id="dialog">
        <div class="title">${title}</div>
        <div class="contents">${content}</div>
        <div class="dialog-buttons">
          <button class="cancle" data-id="cancle">취소</button>
          <button class="confirm" data-id="confirm">${confirm}</button>
        </div>
      </div>
    `;
  }

  render() {
    document.body.insertAdjacentHTML('beforeend', this.template());
    this.mounted();
  }

  mounted() {
    const dialog = document.body.querySelector('#dialog') as HTMLElement;
    const buttons = dialog.querySelector('.dialog-buttons') as HTMLElement;
    const backdrop = document.body.querySelector('.dialog-backdrop') as HTMLElement;

    buttons.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.nodeName !== 'BUTTON') return;
      if (target.dataset.id === 'cancle') {
        this.dialogRemove(dialog, backdrop);
      }
      if (target.dataset.id === 'confirm') {
        this.$state.confirmCallback();
        this.dialogRemove(dialog, backdrop);
      }
    });

    backdrop.addEventListener('click', () => this.dialogRemove(dialog, backdrop));
  }

  dialogRemove(dialog: HTMLElement, backdrop: HTMLElement) {
    dialog.classList.remove('show');
    setTimeout(() => {
      dialog.remove();
      backdrop.remove();
    }, 800);
  }
}
