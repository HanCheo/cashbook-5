import './index.scss';
import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { qs, qsAll } from '@/src/utils/selecthelper';
import { getPaymentTypesAsync, PaymentType } from '@/src/api/paymentTypeAPI';

interface IState {
  paymentTypes: PaymentType[];
  isEditMode?: boolean;
  $editButton?: HTMLElement;
}

interface IProps {}

const EDIT_MODE_ON_STRING = '수정 하기';
const EDIT_MODE_OFF_STRING = '수정 중';

export default class WalletPage extends Component<IState, IProps> {
  setup() {
    getPaymentTypesAsync().then(({ success, data }) => {
      this.setState({
        paymentTypes: data,
        isEditMode: false,
      });
    });
  }

  template() {
    const { paymentTypes } = this.$state;
    return html`
      <div class="wallet-container">
        <h1>My Wallet</h1>
        <hr />

        <div class="wallet-edit-container">
          <div class="wallet-edit-container--btn">추가</div>
          <div id="edit-mode-toggle-btn" class="wallet-edit-container--btn">${EDIT_MODE_ON_STRING}</div>
        </div>

        <ul class="card-list">
          ${paymentTypes &&
          paymentTypes
            .map(
              paymentType =>
                html`<li class="card-list--item" style="background-color:${paymentType.bgColor}">
                  <div class="card-list--item--name" style="color:${paymentType.fontColor}">${paymentType.name}</div>
                  <span class="card-list--item--delete-btn">X</span>
                </li>`
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  mounted() {
    this.$state.$editButton = qs('#edit-mode-toggle-btn', this.$target) as HTMLElement;
    this.$state.$editButton.addEventListener('click', e => {
      this.toggleEditMode();
    });
  }

  toggleEditMode() {
    const { isEditMode, $editButton } = this.$state;
    if (isEditMode) {
      if ($editButton) {
        $editButton.innerText = EDIT_MODE_OFF_STRING;
        $editButton.classList.add('editmode');
        this.changeAllCardsAsEditMode();
      }
      this.$state.isEditMode = false;
    } else {
      if ($editButton) {
        $editButton.innerText = EDIT_MODE_ON_STRING;
        $editButton.classList.remove('editmode');
        this.changeAllCardsAsReadMode();
      }
      this.$state.isEditMode = true;
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
