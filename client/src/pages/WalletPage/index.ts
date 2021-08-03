import './index.scss';
import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { qs, qsAll } from '@/src/utils/selectHelper';
import { getPaymentTypesAsync, PaymentType } from '@/src/api/paymentTypeAPI';
import PaymentTypeAddModal from '@/src/components/PaymentTypeAddModal';

interface IState {
  paymentTypes: PaymentType[];
  isEditMode?: boolean;
  $editButton?: HTMLElement;
}

interface IProps { }

const EDIT_MODE_ON_STRING = '수정 하기';
const EDIT_MODE_OFF_STRING = '수정 중';

export default class WalletPage extends Component<IState, IProps> {
  template() {
    const { paymentTypes } = this.$state;
    return html`
      <div class="wallet-container">
        <h1>My Wallet</h1>
        <hr />
        <div class="wallet-edit-container">
          <div id="add-payment-btn" class="wallet-edit-container--btn">추가</div>
          <div id="edit-mode-toggle-btn" class="wallet-edit-container--btn">${EDIT_MODE_ON_STRING}</div>
        </div>
        <ul class="card-list"></ul>
      </div>
      <div id="payment-type-modal"></div>
    `;
  }

  setup() {
    this.$state.paymentTypes = [];
    this.$state.isEditMode = false;

    getPaymentTypesAsync().then(({ success, data }) => {
      if (success) {
        this.$state.paymentTypes = data;
        this.renderCardItems();
      } else {
        throw new Error('Payment Types Fetching Fail.');
      }
    });
  }

  renderCardItems() {
    const $cardListElement = qs('.card-list', this.$target) as HTMLElement;
    const { paymentTypes } = this.$state;

    $cardListElement.innerHTML = paymentTypes
      .map(
        paymentType =>
          html`<li class="card-list--item" style="background-color:${paymentType.bgColor}">
            <div class="card-list--item--name" style="color:${paymentType.fontColor}">${paymentType.name}</div>
            <span class="card-list--item--delete-btn">X</span>
          </li>`
      )
      .join('');
  }

  mounted() {
    this.$state.$editButton = qs('#edit-mode-toggle-btn', this.$target) as HTMLElement;

    const $paymentTypeAddModal = qs('#payment-type-modal', this.$target) as HTMLElement;
    const paymentAddModal = new PaymentTypeAddModal($paymentTypeAddModal);

    const $addPaymentTypeButton = qs('#add-payment-btn', this.$target) as HTMLElement;

    $addPaymentTypeButton.addEventListener('click', () => {
      paymentAddModal.show();
    });

    this.bindingEvents();
  }

  bindingEvents() {
    if (this.$state.$editButton) {
      this.$state.$editButton.addEventListener('click', e => {
        this.toggleEditMode();
      });
    } else {
      throw new Error('Edit Button Binding Fail');
    }
  }

  toggleEditMode() {
    const { isEditMode, $editButton } = this.$state;

    const mode = isEditMode ? !isEditMode : true;
    this.$state.isEditMode = mode;
    if (mode) {
      if ($editButton) {
        $editButton.innerText = EDIT_MODE_OFF_STRING;
        $editButton.classList.add('editmode');
        this.changeAllCardsAsEditMode();
      }
    } else {
      if ($editButton) {
        $editButton.innerText = EDIT_MODE_ON_STRING;
        $editButton.classList.remove('editmode');
        this.changeAllCardsAsReadMode();
      }
    }
  }

  changeAllCardsAsEditMode() {
    const cardElements = qsAll('.card-list--item', this.$target);
    for (const $cardElement of cardElements) {
      $cardElement.classList.add('editmode');
    }
  }

  changeAllCardsAsReadMode() {
    const cardElements = qsAll('.card-list--item', this.$target);
    for (const $cardElement of cardElements) {
      $cardElement.classList.remove('editmode');
    }
  }
}
