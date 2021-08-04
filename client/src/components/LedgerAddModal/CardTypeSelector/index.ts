import './index.scss';

import { qs, qsAll } from '@/src/utils/selectHelper';
import Component from '@/src/core/Component';
import { html } from '@/src/utils/codeHelper';
import { getOwnPaymentTypesAsync } from '@/src/api/paymentTypeAPI';
import { PaymentType } from '@/src/interfaces/PaymentType';

interface IState {
  isShowCardTypes: boolean;
  paymentTypes: PaymentType[];
}

interface IProps {
  onClickCard: (id: number, value: string) => void;
}

export default class CardTypeSelector extends Component<IState, IProps> {
  setup() {
    this.$state = {
      paymentTypes: [],
      isShowCardTypes: false,
    };
    getOwnPaymentTypesAsync().then(({ success, data }) => {
      if (success) {
        this.setState({
          ...this.$state,
          paymentTypes: data,
        })
      } else {
        console.error("결제수단을 가져오는데 실패했습니다.");
      }
    })
  }

  template() {
    const { paymentTypes } = this.$state;
    return html`
      <div class="card-type-selector">
        <div class="card-type-selector--toggle">선택</div>
        <ul class="card-type-selector--list">
          ${paymentTypes &&
      paymentTypes
        .map(
          paymentType => html`
                <li
                  data-id="${paymentType.id}"
                  class="card-type-selector--list--item"
                  style="background-color:${paymentType.bgColor};color:${paymentType.fontColor}"
                >
                  <div>${paymentType.name}</div>
                </li>
              `
        )
        .join('')}
        </ul>
      </div>
    `;
  }

  mounted() {
    this.bindingEvents();
  }
  bindingEvents() {
    const $toggleElement = qs('.card-type-selector--toggle', this.$target) as HTMLElement;

    // Add eventListener for toggle button click event
    $toggleElement.addEventListener('click', e => this.handleToggleClickEvent());

    // Add eventListener for focuse out click event
    window.addEventListener('click', e => this.handleFocusOutClickEvent(e));

    // Add eventListener for clicking card Item
    this.$target.addEventListener('click', e => this.handleCardItemClickEvent(e));
  }

  handleCardItemClickEvent(e: MouseEvent) {
    const { onClickCard } = this.$props;

    const target = e.target as HTMLElement;

    const itemElements = qsAll('.card-type-selector--list--item', this.$target);
    for (const itemElement of Array.from(itemElements)) {
      if (target === itemElement) {
        const { id } = target.dataset;
        const idAsNumber = Number(id);
        if (!isNaN(idAsNumber)) {
          const paymentType = this.$state.paymentTypes.find(paymentType => paymentType.id === idAsNumber);
          if (paymentType) {
            onClickCard(idAsNumber, paymentType.name);
          }
        }
        this.toggleCardTypeList(false);
      }
    }
  }

  handleFocusOutClickEvent(e: MouseEvent) {
    const eventTargetElement = e.target;

    const $toggleElement = qs('.card-type-selector--toggle', this.$target);
    if ($toggleElement === eventTargetElement) {
      return;
    }
    const $listElement = qs('.card-type-selector--list', this.$target);
    if ($listElement === eventTargetElement) {
      return;
    }

    const childElements = qsAll('.card-type-selector--list--item', this.$target);
    for (const element of Array.from(childElements)) {
      if (eventTargetElement === element) {
        return;
      }
    }
    this.toggleCardTypeList(false);
  }

  handleToggleClickEvent() {
    const { isShowCardTypes } = this.$state;
    this.toggleCardTypeList(!isShowCardTypes);
  }

  toggleCardTypeList(flag = false) {
    const $selectorList = qs('.card-type-selector--list', this.$target) as HTMLElement;
    $selectorList.style.display = flag ? 'block' : 'none';
    this.$state.isShowCardTypes = flag;
  }
}
