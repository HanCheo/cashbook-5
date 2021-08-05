import './index.scss';
import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { qs, qsAll } from '@/src/utils/selectHelper';
import { deleteOwnPaymentTypeAsync, getOwnPaymentTypesAsync } from '@/src/api/paymentTypeAPI';
import PaymentTypeAddModal from '@/src/components/PaymentTypeAddModal';
import paymentTypeListModel from '@/src/models/PaymentTypeList';
import { PaymentType } from '@/src/interfaces/PaymentType';

interface IState {
  paymentTypes: PaymentType[];
  isEditMode?: boolean;
  $editButton?: HTMLElement;
}

interface IProps {}

const EDIT_MODE_ON_STRING = '수정';
const EDIT_MODE_OFF_STRING = '확인';

const PAYMENT_TYPE_LIST_OBSERVER_LISTENER_KEY = 'wallet';

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
      <div id="payment-delete-alert-modal"></div>
    `;
  }

  setup() {
    this.$state.paymentTypes = [];
    this.$state.isEditMode = false;

    getOwnPaymentTypesAsync().then(({ success, data }) => {
      if (success) {
        this.$state.paymentTypes = data;
        this.renderCardItems();
      } else {
        throw new Error('Payment Types Fetching Fail.');
      }
    });
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

  renderCardItems() {
    const $cardListElement = qs('.card-list', this.$target) as HTMLElement;
    const { paymentTypes } = this.$state;

    $cardListElement.innerHTML = paymentTypes
      .map(
        paymentType =>
          html`<li class="card-list--item" style="background-color:${paymentType.bgColor}">
            <div class="card-list--item--name" style="color:${paymentType.fontColor}">${paymentType.name}</div>
            <span class="card-list--item--delete-btn" data-id="${paymentType.id}">X</span>
          </li>`
      )
      .join('');
  }

  bindingEvents() {
    if (this.$state.$editButton) {
      this.$state.$editButton.addEventListener('click', e => {
        this.toggleEditMode();
      });
    } else {
      throw new Error('Edit Button Binding Fail');
    }

    // deletgate item delete event
    const $cardList = qs('.card-list', this.$target) as HTMLElement;
    $cardList.addEventListener('click', (e: MouseEvent) => {
      const cardDeleteBtns = qsAll('.card-list--item--delete-btn', $cardList);
      const target = e.target as HTMLElement;
      for (const btn of cardDeleteBtns) {
        if (target === btn) {
          const paymentTypeId = Number(target.dataset.id);
          this.handleCardDeleteBtnClickEvent(paymentTypeId);
        }
      }
    });
  }

  async handleCardDeleteBtnClickEvent(id: number) {
    const { success: deleteSuccess } = await deleteOwnPaymentTypeAsync(id);
    if (deleteSuccess) {
      const { success: retrieveSuccess, data } = await getOwnPaymentTypesAsync();
      if (retrieveSuccess) {
        paymentTypeListModel.setPaymentTypes(data);
      }
    }
  }

  toggleEditMode() {
    const { isEditMode, $editButton } = this.$state;

    const mode = isEditMode ? !isEditMode : true;
    this.$state.isEditMode = mode;
    this.updateEditButton(this.$state.isEditMode);
  }

  updateEditButton(isEditMode = false) {
    const { $editButton } = this.$state;
    if (isEditMode) {
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

  paymentTypeListModelSubscribeFunction() {
    const newPaymentTypes = paymentTypeListModel.getPaymentTypes();
    this.$state.paymentTypes = newPaymentTypes;
    this.renderCardItems();
    this.updateEditButton(this.$state.isEditMode);
  }

  setUnmount() {
    paymentTypeListModel.unsubscribe(PAYMENT_TYPE_LIST_OBSERVER_LISTENER_KEY);
  }

  setEvent() {
    paymentTypeListModel.subscribe(
      PAYMENT_TYPE_LIST_OBSERVER_LISTENER_KEY,
      this.paymentTypeListModelSubscribeFunction.bind(this)
    );
    this.resetEvent();
  }
}
