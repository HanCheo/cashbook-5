import Component from '@/src/core/Component';
import CategorySelector from './CategorySelector';
import { qs } from '@/src/utils/selecthelper';
import './index.scss';

const mockCategories = [
  { id: 1, name: '취미' },
  { id: 2, name: '월급' },
  { id: 3, name: '적금' },
  { id: 4, name: '예금' },
  { id: 5, name: '비상금' },
  { id: 6, name: '보험비' },
];

interface IState {
  $amountInput: HTMLInputElement;
  $categoryInput: HTMLInputElement;
  $contentInput: HTMLInputElement;
  $cardTypeInput: HTMLInputElement;
  $dateInput: HTMLInputElement;
}

interface IProps {}

export default class LedgerAddModal extends Component<IState, IProps> {
  template() {
    return /*html*/ `
        <div class="blur-background"></div>
        <div class="ledger-modal-container">
            <div class="ledger-modal-container--input-box">
              <label for="date-input">날짜</label>
              <input 
                id="date-input" 
                type="date" />
            </div>
            <span class="spliter"></span>
            <div class="ledger-modal-container--input-box">
              <label for="category-input">분류</label>
              <input 
                id="category-input" 
                type="text"
                placeholder="선택하세요"
                readonly
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
              <input id="card-type-input" type="text"  placeholder="선택하세요" readonly/>
              <div id="card-type-selector-container"></div>
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
    this.$state.$amountInput = qs('#amount-input', this.$target) as HTMLInputElement;
    this.$state.$categoryInput = qs('#category-input', this.$target) as HTMLInputElement;
    this.$state.$contentInput = qs('#content-input', this.$target) as HTMLInputElement;
    this.$state.$cardTypeInput = qs('#card-type-input', this.$target) as HTMLInputElement;
    this.$state.$dateInput = qs('#date-input', this.$target) as HTMLInputElement;

    const $categorySelectorElement = qs('#category-selector-container', this.$target) as HTMLElement;
    new CategorySelector($categorySelectorElement, {
      categories: mockCategories,
      onClickCategory: this.handleSelectCategory,
    });

    this.bindingEvents();
  }

  bindingEvents() {
    const $submitBtnElement = qs('.submit-btn', this.$target) as HTMLElement;
    $submitBtnElement.addEventListener('click', () => {
      this.submit();
      this.clear();
      this.hide();
    });

    const $cancelBtnElement = this.$target.querySelector('.cancel-btn') as HTMLElement;
    $cancelBtnElement.addEventListener('click', () => {
      this.clear();
      this.hide();
    });

    const $blurBgElement = this.$target.querySelector('.blur-background') as HTMLElement;
    $blurBgElement.addEventListener('click', () => {
      this.hide();
    });
  }

  handleSelectCategory = (category: string) => {
    this.$state.$categoryInput.value = category;
  };

  submit() {
    const { $amountInput, $categoryInput, $contentInput, $cardTypeInput, $dateInput } = this.$state;

    // TODO: 입력값 validation 추가
    // TODO: data inset api call
  }

  clear() {
    const { $amountInput, $categoryInput, $contentInput, $cardTypeInput, $dateInput } = this.$state;
    $amountInput.value = '';
    $categoryInput.value = '';
    $contentInput.value = '';
    $cardTypeInput.value = '';
    $dateInput.value = '';
  }

  hide() {
    this.$target.style.display = 'none';
  }

  show() {
    this.$target.style.display = 'flex';
  }
}
