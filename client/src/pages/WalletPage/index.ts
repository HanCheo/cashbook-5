import './index.scss';
import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { getPaymentTypesAsync, PaymentType } from '@/src/api/paymentTypeAPI';

interface IState {
  paymentTypes: PaymentType[];
}

interface IProps {}

export default class WalletPage extends Component<IState, IProps> {
  setup() {
    getPaymentTypesAsync().then(({ success, data }) => {
      this.setState({
        paymentTypes: data,
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
          <div class="wallet-edit-container--btn">수정</div>
        </div>

        <ul class="card-list">
          ${paymentTypes &&
          paymentTypes
            .map(
              paymentType =>
                html`<li class="card-list--item edit" style="background-color:${paymentType.bgColor}">
                  <div class="card-list--item--name" style="color:${paymentType.fontColor}">${paymentType.name}</div>
                  <span class="card-list--item--delete-btn">X</span>
                </li>`
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  mounted() {}
}
