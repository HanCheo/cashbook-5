import './index.scss';

import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { qs, qsAll } from '@/src/utils/selecthelper';

const backgroundColors = [
  '#6ed5eb',
  '#4cb8b8',
  '#94d3cc',
  '#4ca1de',
  '#d092e2',
  '#817dce',
  '#4a6cc3',
  '#b9d58c',
  '#e6d267',
  '#e2b765',
];

const fontColors = ['#ffffff', '#000000'];

interface IState {
  bgColor: string;
  fontColor: string;
  name: string;
}

interface IProps {}

export default class PaymentTypeAddModal extends Component<IState, IProps> {
  setup() {
    this.$state = {
      bgColor: '',
      fontColor: '',
      name: '',
    };
  }
  template() {
    return html`
      <div class="blur-background"></div>
      <div class="payment-type-modal">
        <div class="payment-type-modal--title">결제 수단 추가</div>
        <div class="payment-type-modal--name-section">
          <label class="payment-type-modal--name-section--label" for="name-input"> 이름 </label>
          <input
            id="name-input"
            class="payment-type-modal--name-section--input"
            placeholder="결제 수단의 이름을 입력해주세요."
          />
        </div>
        <div class="payment-type-modal--bg-section">
          <div class="payment-type-modal--bg-section--label">배경색</div>
          <ul id="bg-color-picker" class="color-picker">
            ${backgroundColors
              .map(
                color => html`
                  <li class="color-picker--item" data-color="${color}">
                    <div class="box" style="background-color:${color}"></div>
                  </li>
                `
              )
              .join('')}
          </ul>
        </div>
        <div class="payment-type-modal--font-section">
          <div class="payment-type-modal--font-section--label">글자색</div>
          <ul id="font-color-picker" class="color-picker">
            ${fontColors
              .map(
                color => html`
                  <li class="color-picker--item" data-color="${color}">
                    <div class="box" style="background-color:${color}"></div>
                  </li>
                `
              )
              .join('')}
          </ul>
        </div>
        <div class="payment-type-modal--preview-section">
          <div class="payment-type-modal--preview-section--label">Preview</div>
          <div class="preview-card"></div>
        </div>
        <div class="payment-type-modal--btn-container">
          <div id="cancel-btn" class="payment-type-modal--btn-container--btn">취소</div>
          <div id="submit-btn" class="payment-type-modal--btn-container--btn">생성</div>
        </div>
      </div>
    `;
  }

  mounted() {
    this.bindingEvents();
  }

  bindingEvents() {
    const $cancelBtn = qs('#cancel-btn', this.$target) as HTMLElement;
    $cancelBtn.addEventListener('click', () => {
      this.clear();
      this.hide();
    });

    const $submitBtn = qs('#submit-btn', this.$target) as HTMLElement;
    $submitBtn.addEventListener('click', () => {
      this.submit();
      this.clear();
      this.hide();
    });

    const $blurBackgroundElement = qs('.blur-background', this.$target) as HTMLElement;
    $blurBackgroundElement.addEventListener('click', () => {
      this.clear();
      this.hide();
    });

    const $bgColorPicker = qs('#bg-color-picker', this.$target) as HTMLElement;
    $bgColorPicker.addEventListener('click', e => this.handleColorPickerClickEvent(e, this.updateBgColor.bind(this)));

    const $fontColorPicker = qs('#font-color-picker', this.$target) as HTMLElement;
    $fontColorPicker.addEventListener('click', e =>
      this.handleColorPickerClickEvent(e, this.updateFontColor.bind(this))
    );

    const $nameInput = qs('#name-input', this.$target) as HTMLElement;
    $nameInput.addEventListener('input', e => this.handleChangeNameInputEvent(e));
  }

  handleColorPickerClickEvent(e: MouseEvent, cb: (color: string) => void) {
    const currentTarget = e.currentTarget as HTMLElement;
    const target = e.target as HTMLElement;

    const pickers = qsAll('.color-picker', this.$target);
    for (const picker of pickers) {
      if (picker === target) return;
    }

    const colorItems = qsAll('.color-picker--item', currentTarget);
    for (const colorItem of colorItems) {
      if (target === colorItem) {
        const { color } = target.dataset;
        colorItem.classList.add('select');
        if (typeof color === 'string') {
          cb(color);
        }
      } else {
        colorItem.classList.remove('select');
      }
    }
  }

  handleChangeNameInputEvent(e: Event) {
    const target = e.target as HTMLInputElement;
    this.$state.name = target.value;
    this.renderPreviewCard();
  }

  updateBgColor(color: string) {
    this.$state.bgColor = color;
    this.renderPreviewCard();
  }

  updateFontColor(color: string) {
    this.$state.fontColor = color;
    this.renderPreviewCard();
  }

  renderPreviewCard() {
    const $previewCardElement = qs('.preview-card', this.$target) as HTMLElement;
    const { fontColor, bgColor, name } = this.$state;

    $previewCardElement.style.color = fontColor;
    $previewCardElement.style.backgroundColor = bgColor;
    $previewCardElement.innerText = name;
  }

  submit() {
    //TODO: 검증 후 카드 생성
  }

  clear() {
    this.$state = {
      bgColor: '',
      fontColor: '',
      name: '',
    };
  }

  show() {
    this.$target.style.display = 'block';
  }

  hide() {
    this.$target.style.display = 'none';
  }
}
