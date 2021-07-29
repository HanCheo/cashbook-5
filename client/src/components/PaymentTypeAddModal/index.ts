import './index.scss';

import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { qs } from '@/src/utils/selecthelper';

interface IState {}

interface IProps {}

export default class PaymentTypeAddModal extends Component<IState, IProps> {
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
          <ul class="bg-color-picker">
            <li class="bg-color-picker--item">
              <div class="box"></div>
            </li>
            <li class="bg-color-picker--item select">
              <div class="box"></div>
            </li>
            <li class="bg-color-picker--item">
              <div class="box"></div>
            </li>
            <li class="bg-color-picker--item">
              <div class="box"></div>
            </li>
          </ul>
        </div>
        <div class="payment-type-modal--font-section">
          <div class="payment-type-modal--font-section--label">글자색</div>
          <ul class="font-color-picker">
            <li class="font-color-picker--item select">
              <div class="box"></div>
            </li>
            <li class="font-color-picker--item">
              <div class="box"></div>
            </li>
            <li class="font-color-picker--item">
              <div class="box"></div>
            </li>
            <li class="font-color-picker--item">
              <div class="box"></div>
            </li>
          </ul>
        </div>
        <div class="payment-type-modal--preview-section">
          <div class="payment-type-modal--preview-section--label">Preview</div>
          <div class="preview-card">임시 테스트 카드입니다.</div>
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
      // TODO: data clear

      this.hide();
    });

    const $submitBtn = qs('#submit-btn', this.$target) as HTMLElement;
    $submitBtn.addEventListener('click', () => {
      // TODO: data clear
      this.hide();
    });

    const $blurBackgroundElement = qs('.blur-background', this.$target) as HTMLElement;
    $blurBackgroundElement.addEventListener('click', () => {
      this.hide();
    });
  }

  show() {
    this.$target.style.display = 'block';
  }

  hide() {
    this.$target.style.display = 'none';
  }
}
