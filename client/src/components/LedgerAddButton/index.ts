import Component from '@/src/core/Component';

import './index.scss';

interface IState {}

interface IProps {
  onClick: () => void;
}

/**
 * Ledger Add Button is used as FAB(Floating Action Button)
 * by peanut-lover
 * */
export default class LedgerAddButton extends Component<IState, IProps> {
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
