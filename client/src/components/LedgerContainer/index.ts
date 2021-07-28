import Component from '@/src/core/Component';
import LedgerDataModel from '@/src/models/Ledgers';
import { html } from '@/src/utils/codeHelper';
import LedgerList from '../LedgerList';
import { ILedgerList, ILedger } from '@/src/interfaces/Ledger';
import './index.scss';
import Snackbar from '../SnackBar';

interface IState {
  ledgerData: ILedgerList[];
  totalCount?: number;
  totalIncomes?: number;
  totalSpand?: number;
  checked?: string[];
}

interface IProps {}

export default class LedgerContainer extends Component<IState, IProps> {
  setup() {
    this.$state.ledgerData = LedgerDataModel.getData();
    this.$state.totalCount = 0;
    this.$state.totalIncomes = 0;
    this.$state.totalSpand = 0;
    this.$state.checked = ['spand', 'income'];

    this.$state.ledgerData.forEach((ledgerList: ILedgerList) => {
      (this.$state.totalCount as number) += ledgerList.ledgers.length;
      ledgerList.ledgers.forEach((ledger: ILedger) => {
        ledger.amount < 0
          ? ((this.$state.totalSpand as number) += ledger.amount)
          : ((this.$state.totalIncomes as number) += ledger.amount);
      });
    });
  }

  template() {
    return html`
      <div class="ledger-container">
        <div class="ledger-container--header">
          <div class="total-count">전체 건수 : ${this.$state.totalCount}</div>
          <div class="fillter">
            <div class="checkbox-wrapper">
              <input type="checkbox" id="income" name="filterCheckbox" />
              <label for="income">수입 ${this.$state.totalIncomes}</label>
            </div>
            <div class="checkbox-wrapper">
              <input type="checkbox" id="spand" name="filterCheckbox" />
              <label for="spand">지출 ${this.$state.totalSpand}</label>
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

    if (!ledgerData.length) {
      new Snackbar(document.body, { text: '앗 ! 데이터가 없어요 !' });
    }

    ledgerData.forEach((ledgerList: ILedgerList) => {
      new LedgerList(wrapper, { ledgerList: ledgerList });
    });
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

  setEvent() {
    LedgerDataModel.subscribe(() => {
      this.setState({
        ledgerData: LedgerDataModel.getData(),
      });
    });
  }
}
