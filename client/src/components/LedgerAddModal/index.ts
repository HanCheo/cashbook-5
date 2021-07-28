import Component from '@/src/core/Component';
import CategorySelector from './CategorySelector';

import './index.scss';

const mockCategories = [
  { id: 1, name: '취미' },
  { id: 2, name: '월급' },
  { id: 3, name: '적금' },
  { id: 4, name: '예금' },
];

interface IState {}

interface IProps {}

export default class LedgerAddModal extends Component<IState, IProps> {
  setup() {
    // state
  }

  template() {
    return /*html*/ `
        <div class="blur-background"></div>
        <div class="ledger-modal-container">
            <div class="ledger-modal-container--input-box">
              <label for="datetime-input">날짜</label>
              <input 
                id="datetime-input" 
                type="text" 
                placeholder="(TODO: 현재 날짜)"/>
            </div>
            <span class="spliter"></span>
            <div class="ledger-modal-container--input-box">
              <label for="category-input">분류</label>
              <input 
                id="category-input" 
                type="text"
                placeholder="선택하세요"
              />

              <div id="category-selector-container"></div>
            </div>
            <span class="spliter"></span>
            <div class="ledger-modal-container--input-box">
              <label for="content-input">내용</label>
              <input id="content-input" type="text"  placeholder="입력하세요"/>
            </div>
            <span class="spliter"></span>
            <div class="ledger-modal-container--input-box">
              <label for="card-type-input">결제수단</label>
              <input id="card-type-input" type="text"  placeholder="선택하세요"/>
            </div>
            <span class="spliter"></span>
            <div class="ledger-modal-container--input-box">
              <label for="amount-input">금액</label>
              <input id="amount-input" type="text" placeholder="입력하세요"/>
            </div>
            <span class="spliter"></span>
            <div class="ledger-modal-container--submit-box">
              <div class="cancel-btn">취소</div>
              <div class="submit-btn">완료</div>
            </div>
        </div>
    `;
  }

  mounted() {
    const $categorySelectorElement = this.$target.querySelector('#category-selector-container') as HTMLElement;
    new CategorySelector($categorySelectorElement, {
      categories: mockCategories,
      onClickCategory: (categoryId: number) => {
        console.log(categoryId);
      },
    });

    const $submitBtnElement = this.$target.querySelector('.submit-btn') as HTMLElement;
    $submitBtnElement.addEventListener('click', () => {
      // TODO: data inset api call
      this.hide();
    });

    const $cancelBtnElement = this.$target.querySelector('.cancel-btn') as HTMLElement;
    $cancelBtnElement.addEventListener('click', () => {
      // TODO: state clear
      this.hide();
    });

    const $blurBgElement = this.$target.querySelector('.blur-background') as HTMLElement;
    $blurBgElement.addEventListener('click', () => {
      // TODO: state clear
      this.hide();
    });
  }

  hide() {
    this.$target.style.display = 'none';
  }

  show() {
    this.$target.style.display = 'flex';
  }
}
