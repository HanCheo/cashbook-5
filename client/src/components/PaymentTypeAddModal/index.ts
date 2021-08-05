import './index.scss';

import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { qs, qsAll } from '@/src/utils/selectHelper';
import { createPaymentTypeAsync, getOwnPaymentTypesAsync } from '@/src/api/paymentTypeAPI';
import paymentTypeListModel from '@/src/models/PaymentTypeList';
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

interface Error {
  [field: string]: string;
}

interface IState {
  bgColor: string;
  fontColor: string;
  name: string;
  error: Error;
}

interface IProps {}

export default class PaymentTypeAddModal extends Component<IState, IProps> {
  setup() {
    this.$state = {
      bgColor: '',
      fontColor: '',
      name: '',
      error: {},
    };
  }
  template() {
    const { error, name, fontColor, bgColor } = this.$state;
    return html`
      <div class="blur-background"></div>
      <div class="payment-type-modal">
        <div class="payment-type-modal--title">결제 수단 추가</div>
        <div class="payment-type-modal--name-section">
          <label class="payment-type-modal--name-section--label" for="name-input"> 이름 </label>
          <input
            id="name-input"
            class="payment-type-modal--name-section--input"
            value="${name ? name : ''}"
            placeholder="결제 수단의 이름을 입력해주세요."
          />
        </div>
        <div class="payment-type-modal--bg-section">
          <div class="payment-type-modal--bg-section--label">배경색</div>
          <ul id="bg-color-picker" class="color-picker">
            ${backgroundColors
              .map(
                color => html`
                  <li class="color-picker--item ${bgColor === color ? 'select' : ''}" data-color="${color}">
                    <div class="box" style="background-color:${color}"></div>
                  </li>
                `
              )
              .join('')}
          </ul>
        </div>
        <div class="payment-type-modal--font-section">
          <div class="payment-type-modal--font-section--label ">글자색</div>
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
          ${Object.keys(error).length > 0 ? html`<p class="error-message">${Object.values(error)[0]}</p>` : ''}
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

  async createPaymentTypeAsync(name: string, bgColor: string, fontColor: string) {
    const { success: creatSuccess } = await createPaymentTypeAsync(name, bgColor, fontColor);
    if (creatSuccess) {
      this.clear();
      const { success: retrieveSuccess, data } = await getOwnPaymentTypesAsync();
      if (retrieveSuccess) {
        paymentTypeListModel.setPaymentTypes(data);
        this.hide();
      } else {
        // TODO: add loading spinner
        console.error('retrieve payment types fail');
      }
    }
  }

  submit() {
    const { fontColor, bgColor, name } = this.$state;
    const error = this.validate();
    if (Object.keys(error).length === 0) {
      this.createPaymentTypeAsync(name, bgColor, fontColor);
      return true;
    } else {
      this.setState({ ...this.$state, error });
      return false;
    }
  }

  clear() {
    this.setState({
      bgColor: '',
      fontColor: '',
      name: '',
      error: {},
    });
  }

  validate(): Error {
    const error: Error = {};
    const { fontColor, bgColor, name } = this.$state;
    if (!name || name === '') {
      error.name = '카드 이름을 입력해주세요.';
    }

    if (!fontColor || fontColor === '') {
      error.fontColor = '카드 글씨색을 선택해주세요.';
    }

    if (!bgColor || bgColor === '') {
      error.bgColor = '카드 배경색을 선택해주세요.';
    }
    return error;
  }

  show() {
    this.clear();
    this.$target.style.display = 'block';
  }

  hide() {
    this.clear();
    this.$target.style.display = 'none';
  }
}
