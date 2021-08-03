import './index.scss';
import Component from '@/src/core/Component';
import { qs } from '@/src/utils/selectHelper';
import { html } from '@/src/utils/codeHelper';
import CategorySelector from './CategorySelector';
import CardTypeSelector from './CardTypeSelector';
import Snackbar from '../SnackBar';

const mockCategories = [
  { id: 1, name: '취미' },
  { id: 2, name: '월급' },
  { id: 3, name: '적금' },
  { id: 4, name: '예금' },
  { id: 5, name: '비상금' },
  { id: 6, name: '보험비' },
  { id: 6, name: '보험비' },
  { id: 6, name: '보험비' },
  { id: 6, name: '보험비' },
  { id: 6, name: '보험비' },
  { id: 6, name: '보험비' },
  { id: 6, name: '보험비' },
];

interface Error {
  [key: string]: string;
}

interface IState {
  $amountInput: HTMLInputElement;
  $categoryInput: HTMLInputElement;
  $contentInput: HTMLInputElement;
  $cardTypeInput: HTMLInputElement;
  $dateInput: HTMLInputElement;
}

interface IProps { }

export default class LedgerAddModal extends Component<IState, IProps> {
  template() {
    return html`
      <div class="blur-background"></div>
      <div class="ledger-modal-container">
        <div class="ledger-modal-container--input-box">
          <label for="date-input">날짜</label>
          <input id="date-input" type="date" />
        </div>
        <span class="spliter"></span>
        <div class="ledger-modal-container--input-box">
          <label for="category-input">분류</label>
          <input id="category-input" type="text" placeholder="선택하세요" readonly />
          <div id="category-selector-container"></div>
        </div>
        <span class="spliter"></span>
        <div class="ledger-modal-container--input-box">
          <label for="content-input">내용</label>
          <input id="content-input" type="text" placeholder="입력하세요" />
        </div>
        <span class="spliter"></span>
        <div class="ledger-modal-container--input-box">
          <label for="card-type-input">결제수단</label>
          <input id="card-type-input" type="text" placeholder="선택하세요" readonly />
          <div id="card-type-selector-container"></div>
        </div>
        <span class="spliter"></span>
        <div class="ledger-modal-container--input-box">
          <label for="amount-input">금액</label>
          <input id="amount-input" type="text" placeholder="입력하세요" />
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
      onClickCategory: (category: string) => this.handleSelectCategory(category),
    });

    const $cardTypeSelectorElement = qs('#card-type-selector-container', this.$target) as HTMLElement;
    new CardTypeSelector($cardTypeSelectorElement, {
      cardTypes: [
        { id: 'test', name: 'test card', color: 'blue' },
        { id: 'test', name: 'test card', color: 'red' },
        { id: 'test', name: 'test card', color: 'tomato' },
        { id: 'test', name: 'test card', color: 'green' },
        { id: 'test', name: 'test card', color: '#000000' },
        { id: 'test', name: 'test card', color: '#000000' },
        { id: 'test', name: 'test card', color: '#000000' },
        { id: 'test', name: 'test card', color: '#000000' },
        { id: 'test', name: 'test card', color: '#000000' },
        { id: 'test', name: 'test card', color: '#000000' },
        { id: 'test', name: 'test card', color: '#000000' },
      ],
      onClickCard: (card: string) => {
        this.handleSelectCardType(card);
      },
    });

    this.bindingEvents();
  }

  bindingEvents() {
    const $submitBtnElement = qs('.submit-btn', this.$target) as HTMLElement;
    $submitBtnElement.addEventListener('click', () => {
      const result = this.submit();
      if (result) {
        this.clear();
        this.hide();
      }
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

  handleSelectCardType(card: string) {
    this.$state.$cardTypeInput.value = card;
  }

  handleSelectCategory(category: string) {
    this.$state.$categoryInput.value = category;
  }

  submit() {
    // TODO: 입력값 validation 추가
    // TODO: data inset api call
    const errors = this.validateForm();
    const errorNames = Object.keys(errors);
    if (errorNames.length > 0) {
      new Snackbar(document.body, { text: errors[errorNames[0]], duration: 2 });
      return false;
    }

    return true;
  }

  validateForm(): Error {
    const { $amountInput, $categoryInput, $contentInput, $cardTypeInput, $dateInput } = this.$state;
    const error: Error = {};

    if (!$dateInput.value) {
      error.date = '날짜를 입력해주세요.';
    }

    if (!$categoryInput.value) {
      error.category = '분류를 선택해주세요.';
    }

    if (!$contentInput.value) {
      error.content = '내용을 입력해주세요.';
    }

    if (!$cardTypeInput.value) {
      error.cardType = '결제 수단을 선택해주세요.';
    }

    if (!$amountInput.value) {
      error.amount = '금액을 입력해주세요.';
      // TODO Number Validation
    }
    return error;
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
