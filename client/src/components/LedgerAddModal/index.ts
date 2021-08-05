import './index.scss';
import Component from '@/src/core/Component';
import { qs } from '@/src/utils/selectHelper';
import { addComma, convertToYYYYMMDD, html } from '@/src/utils/codeHelper';
import CategorySelector from './CategorySelector';
import CardTypeSelector from './CardTypeSelector';
import Snackbar from '../SnackBar';
import { createLedgerData, editLedgerData, getLedgerData } from '@/src/api/ledgerAPI';
import calendarModel from '@/src/models/Calendar';
import { ILedger } from '@/src/interfaces/Ledger';
import { UsageState } from 'webpack';

const MAX_AMOUNT = 100000000;
const MIN_AMOUNT = -100000000;
const AMOUNT_MAX_WARNING_MESSAGE = `금액은 최대 ${addComma(MAX_AMOUNT)}원까지 가능`;
const AMOUNT_MIN_WARNING_MESSAGE = `금액은 최소 ${addComma(MIN_AMOUNT)}원까지 가능`;

interface Error {
  [key: string]: string;
}

interface IState {
  $amountInput: HTMLInputElement;
  $categoryInput: HTMLInputElement;
  $contentInput: HTMLInputElement;
  $paymentTypeInput: HTMLInputElement;
  $dateInput: HTMLInputElement;

  ledger?: ILedger;
  paymentTypeId: number;
  categoryId: number;
}

interface IProps {
  ledger?: ILedger;
}

interface IProps {}

export default class LedgerAddModal extends Component<IState, IProps> {
  setup() {
    this.$state.ledger = this.$props.ledger;
    if (this.$state.ledger) {
      this.$state.paymentTypeId = this.$state.ledger.paymentType.id;
      this.$state.categoryId = this.$state.ledger.category.id;
    }
  }
  template() {
    const ledger = this.$state.ledger;
    let date = '',
      categoryName = '',
      content = '',
      paymentName = '',
      amount = 0;

    if (ledger) {
      date = ledger.date!;
      categoryName = ledger.category.name;
      content = ledger.content;
      paymentName = ledger.paymentType.name;
      amount = ledger.amount;
    } else {
      date = convertToYYYYMMDD(new Date());
    }

    return html`
      <div class="blur-background"></div>
      <div class="ledger-modal-container">
        ${ledger ? html`<div class="edit-label">가계부 수정</div>` : ''}
        <div class="ledger-modal-container--input-box">
          <label for="date-input">날짜</label>
          <input id="date-input" type="date" value="${date}" />
        </div>
        <span class="spliter"></span>
        <div class="ledger-modal-container--input-box">
          <label for="category-input">분류</label>
          <input id="category-input" type="text" placeholder="선택하세요" readonly value="${categoryName}" />
          <div id="category-selector-container"></div>
        </div>
        <span class="spliter"></span>
        <div class="ledger-modal-container--input-box">
          <label for="content-input">내용</label>
          <input id="content-input" type="text" placeholder="입력하세요" value="${content}" />
        </div>
        <span class="spliter"></span>
        <div class="ledger-modal-container--input-box">
          <label for="card-type-input">결제수단</label>
          <input id="card-type-input" type="text" placeholder="선택하세요" readonly value="${paymentName}" />
          <div id="card-type-selector-container"></div>
        </div>
        <span class="spliter"></span>
        <div class="ledger-modal-container--input-box">
          <label for="amount-input">금액</label>
          <input id="amount-input" type="number" placeholder="입력하세요" value="${amount}" />
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
    this.$state.$paymentTypeInput = qs('#card-type-input', this.$target) as HTMLInputElement;
    this.$state.$dateInput = qs('#date-input', this.$target) as HTMLInputElement;

    const $categorySelectorElement = qs('#category-selector-container', this.$target) as HTMLElement;
    new CategorySelector($categorySelectorElement, {
      onClickCategory: (id, name: string) => this.handleSelectCategory(id, name),
    });

    const $cardTypeSelectorElement = qs('#card-type-selector-container', this.$target) as HTMLElement;
    new CardTypeSelector($cardTypeSelectorElement, {
      onClickCard: (id: number, name: string) => {
        this.handleSelectPaymentType(id, name);
      },
    });

    this.bindingEvents();
  }

  bindingEvents() {
    const $submitBtnElement = qs('.submit-btn', this.$target) as HTMLElement;
    $submitBtnElement.addEventListener('click', () => {
      const result = this.submit();
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

    this.$state.$amountInput.addEventListener('input', e => {
      const element = e.target as HTMLInputElement;
      const amount = parseInt(element.value);

      if (amount > MAX_AMOUNT) {
        this.$state.$amountInput.value = MAX_AMOUNT.toString();
        new Snackbar(document.body, { text: AMOUNT_MAX_WARNING_MESSAGE, duration: 2 });
      } else if (amount < MIN_AMOUNT) {
        this.$state.$amountInput.value = MIN_AMOUNT.toString();
        new Snackbar(document.body, { text: AMOUNT_MIN_WARNING_MESSAGE, duration: 2 });
      }
    });
  }

  handleSelectPaymentType(id: number, name: string) {
    this.$state.$paymentTypeInput.value = name;
    this.$state.paymentTypeId = id;
  }

  handleSelectCategory(id: number, name: string) {
    this.$state.$categoryInput.value = name;
    this.$state.categoryId = id;
  }

  async createLedgerAsync(date: Date, paymentTypeId: number, categoryId: number, amount: number, content: string) {
    const formatedDate = convertToYYYYMMDD(date);

    const { success } = await createLedgerData(formatedDate, paymentTypeId, categoryId, amount, content);
    if (success) {
      this.clear();
      this.hide();
      calendarModel.setDate(calendarModel.getDate()); // for refresh main page;
    }
  }
  async editLedgerAsync(
    id: number,
    date: Date,
    paymentTypeId: number,
    categoryId: number,
    amount: number,
    content: string
  ) {
    const formatedDate = convertToYYYYMMDD(date);
    const { success } = await editLedgerData(id, formatedDate, paymentTypeId, categoryId, amount, content);
    if (success) {
      this.clear();
      this.hide();
      calendarModel.setDate(calendarModel.getDate()); // for refresh main page;
    }
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

    const { $amountInput, $contentInput, $dateInput, categoryId, paymentTypeId } = this.$state;

    const date = new Date($dateInput.value);
    const amount = Number($amountInput.value);
    const content = $contentInput.value;

    if (this.$state.ledger) {
      this.editLedgerAsync(this.$state.ledger.id, date, paymentTypeId, categoryId, amount, content);
    } else {
      this.createLedgerAsync(date, paymentTypeId, categoryId, amount, content);
    }
    return true;
  }

  validateForm(): Error {
    const { $amountInput, $categoryInput, $contentInput, $paymentTypeInput, $dateInput, categoryId, paymentTypeId } =
      this.$state;
    const error: Error = {};

    if (!$dateInput.value) {
      error.date = '날짜를 입력해주세요.';
    }

    if (!$categoryInput.value || !categoryId) {
      error.category = '분류를 선택해주세요.';
    }

    if (!$contentInput.value) {
      error.content = '내용을 입력해주세요.';
    }

    if (!$paymentTypeInput.value || !paymentTypeId) {
      error.cardType = '결제 수단을 선택해주세요.';
    }

    if (!$amountInput.value) {
      error.amount = '금액을 입력해주세요.';
      // TODO Number Validation
    }
    return error;
  }

  clear() {
    const { $amountInput, $categoryInput, $contentInput, $paymentTypeInput, $dateInput } = this.$state;
    $amountInput.value = '';
    $categoryInput.value = '';
    $contentInput.value = '';
    $paymentTypeInput.value = '';
    $dateInput.value = '';
  }

  hide() {
    this.$target.style.display = 'none';
  }

  show() {
    this.$target.style.display = 'flex';
    this.setState({
      ...this.$state,
    });
  }
}
