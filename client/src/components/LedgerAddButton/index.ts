import Component from '@/src/core/Component';

import './index.scss';

/**
 * Ledger Add Button is used as FAB(Floating Action Button)
 * by peanut-lover
 * */
export default class LedgerAddButton extends Component {
  template() {
    return /* html */ `
        <div class="ledger-add-button">
          가계부 추가하기
        </div>
    `;
  }

  mounted() {
    const { onClick } = this.$props;
    if (typeof onClick === 'function') {
      const $buttonElement = this.$target.querySelector('.ledger-add-button') as HTMLElement;
      $buttonElement.addEventListener('click', () => onClick());
    }
  }
}
