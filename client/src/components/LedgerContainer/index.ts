import Component from '@/src/core/Component';
import LedgerDataModel from '@/src/models/Ledgers';
import { addComma, html } from '@/src/utils/codeHelper';
import LedgerList from '../LedgerList';
import { ILedgerList, ILedger } from '@/src/interfaces/Ledger';
import './index.scss';
import LedgerAddModal from '../LedgerAddModal';
import { qs } from '@/src/utils/selectHelper';
import { getLedgerDataByID } from '@/src/api/ledgerAPI';
import Snackbar from '../SnackBar';

interface IState {
  ledgerData: ILedgerList[] | undefined;
  totalCount?: number;
  totalIncomes?: number;
  totalSpand?: number;
  checked?: string[];
}

interface IProps {
  ledgerData: ILedgerList[] | undefined;
}

export default class LedgerContainer extends Component<IState, IProps> {
  setup() {
    this.$state.ledgerData = this.$props.ledgerData;
    this.$state.totalIncomes = 0;
    this.$state.totalSpand = 0;
    this.$state.checked = ['spand', 'income'];
    this.$state.ledgerData?.forEach((ledgerList: ILedgerList) => {
      ledgerList.ledgers.forEach((ledger: ILedger) => {
        ledger.amount < 0
          ? ((this.$state.totalSpand as number) += +ledger.amount)
          : ((this.$state.totalIncomes as number) += +ledger.amount);
      });
    });
  }

  template() {
    const { totalIncomes, totalSpand } = this.$state;
    const totalCount = this.$state.ledgerData?.reduce((sum, ledger) => (sum += ledger.ledgers.length), 0) || 0;

    return html`
      <div class="ledger-container">
        <div class="ledger-container--header">
          <div class="total-count">전체 건수 : ${addComma(totalCount)}</div>
          <div class="fillter">
            <div class="checkbox-wrapper">
              <input type="checkbox" id="income" name="filterCheckbox" />
              <label for="income">수입 ${addComma(totalIncomes!)}</label>
            </div>
            <div class="checkbox-wrapper">
              <input type="checkbox" id="spand" name="filterCheckbox" />
              <label for="spand">지출 ${addComma(totalSpand!)}</label>
            </div>
          </div>
        </div>
        <div class="ledger-list-wrapper"></div>
      </div>
    `;
  }

  mounted() {
    const wrapper = this.$target.querySelector('.ledger-list-wrapper') as HTMLElement;
    const checkBoxs = [...this.$target.querySelectorAll('input[name="filterCheckbox"]')] as HTMLInputElement[];
    const { ledgerData, checked } = this.$state;

    wrapper.addEventListener('click', this.ledgerButtonsToggleHandler.bind(this));

    //checkBok
    checked?.forEach((id: string) => {
      (this.$target.querySelector(`input#${id}`) as HTMLInputElement).checked = true;
    });

    //Get filter Data
    checkBoxs.forEach(box => {
      box.addEventListener('change', () => this.getFilterData(checkBoxs));
    });

    //ledger-header Dropdown Event
    wrapper.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('ledger-header')) {
        target.classList.toggle('active');
      }
    });

    ledgerData?.forEach((ledgerList: ILedgerList) => {
      new LedgerList(wrapper, { ledgerList: ledgerList });
    });
  }

  ledgerButtonsToggleHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.nodeName === 'LI') {
      target.classList.toggle('selected');
    }
    this.ledgerEditButtonClickHandler(target);
  }

  async ledgerEditButtonClickHandler(target: HTMLElement) {
    if (target.nodeName !== 'BUTTON' && target.dataset.type !== 'edit') return;
    const $editModal = qs('#ledger-edit-modal', document.body) as HTMLElement;
    const ledgerId = target.dataset.id ? +target.dataset.id : -1;
    const response = await getLedgerDataByID(ledgerId);

    if (!response.success) {
      new Snackbar(document.body, { text: '없는 가계부 정보에요.' });
    }

    const ledgerAddModal = new LedgerAddModal($editModal, { ledger: response.data });
    ledgerAddModal.show();
  }

  getFilterData(checkBoxs: HTMLInputElement[]) {
    let filter = '';
    checkBoxs.forEach(e => (e.checked ? (filter += e.getAttribute('id')) : ''));

    switch (filter) {
      case 'spand':
        this.setState({ ledgerData: LedgerDataModel.getSpandData(), checked: ['spand'] });
        break;
      case 'income':
        this.setState({ ledgerData: LedgerDataModel.getIncomeData(), checked: ['income'] });
        break;
      case '':
        this.setState({ ledgerData: [], checked: [] });
        break;
      default:
        this.setState({ ledgerData: LedgerDataModel.getData(), checked: ['spand', 'income'] });
    }
  }
}
