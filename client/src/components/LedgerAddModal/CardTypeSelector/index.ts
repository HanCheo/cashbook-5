import './index.scss';

import { qs, qsAll } from '@/src/utils/selectHelper';
import Component from '@/src/core/Component';
import { CardType } from '@/src/interfaces/CardType';
import { html } from '@/src/utils/codeHelper';

interface IState {
  isShowCardTypes: boolean;
}

interface IProps {
  cardTypes: CardType[];
  onClickCard: (value: string) => void;
}

export default class CardTypeSelector extends Component<IState, IProps> {
  setup() {
    this.$state = {
      isShowCardTypes: false,
    };
  }
  template() {
    const { cardTypes } = this.$props;
    return html`
      <div class="card-type-selector">
        <div class="card-type-selector--toggle">선택</div>
        <ul class="card-type-selector--list">
          ${cardTypes &&
      cardTypes
        .map(
          cardType => html`
                <li
                  data-card="${cardType.name}"
                  class="card-type-selector--list--item"
                  style="background-color:${cardType.color}"
                >
                  <div>${cardType.name}</div>
                  <div>${cardType.color}</div>
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
        const { card } = target.dataset;
        if (card) {
          onClickCard(card);
          this.toggleCardTypeList(false);
        }
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
