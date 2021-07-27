import Component from '@/src/interfaces/Component';
import LedgerList from '../LedgerList';
import './index.scss';

const TEST_DATA: ILedgerList[] = [
  {
    numDate: '0727',
    date: '07월 27일',
    day: '화',
    income: 200000,
    spand: -150000,
    ledgers: [
      {
        categoryType: '6',
        category: '미분류',
        content: '온라인 세미나 신청',
        cardType: '현금',
        balance: -100000,
      },
      {
        categoryType: '4',
        category: '식비',
        content: '저녁밥',
        cardType: '현대카드',
        balance: -50000,
      },
      {
        categoryType: '8',
        category: '월급',
        content: '7월 급여',
        cardType: '현급',
        balance: 200000,
      },
    ],
  },
  {
    numDate: '0728',
    date: '07월 28일',
    day: '수',
    income: 300000,
    spand: -200000,
    ledgers: [
      {
        categoryType: '6',
        category: '미분류',
        content: '온라인 세미나 신청',
        cardType: '국민카드',
        balance: -150000,
      },
      {
        categoryType: '4',
        category: '식비',
        content: '저녁밥',
        cardType: '삼성카드',
        balance: -50000,
      },
      {
        categoryType: '8',
        category: '월급',
        content: '7월 보너스',
        cardType: '현급',
        balance: 300000,
      },
    ],
  },
];

export default class extends Component {
  setup() {
    // TODO 옵저버 이동 필요
    this.$state = TEST_DATA;
  }
  template() {
    // TODO 옵저버 이동 필요
    let totalIncomes = 0;
    let totalSpand = 0;
    let totalCount = 0;
    TEST_DATA.forEach((ledgerList: ILedgerList) => {
      totalCount += ledgerList.ledgers.length;
      ledgerList.ledgers.forEach((ledger: ILedger) => {
        ledger.balance < 0 ? (totalSpand += ledger.balance) : (totalIncomes += ledger.balance);
      });
    });

    return /*html*/ `
    <div class="ledger-container">
      <div class="ledger-container-header">
        <div class="total-count">전체 건수 : ${totalCount}</div>
        <div class="fillter">
          <div class="checkbox-wrapper">
            <input type="checkbox" id="income"/>
            <label for="income">수입 ${totalIncomes}</label>
          </div>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="spand"/>
            <label for="spand">지출 ${totalSpand}</label>
          </div>
        </div>
      </div>
      <div class="ledger-list-wrapper"></div>
    </div>
    `;
  }
  mounted() {
    const wrapper = this.$target.querySelector('.ledger-list-wrapper') as HTMLElement;

    this.$state.forEach((ledgerList: ILedgerList) => {
      new LedgerList(wrapper, { state: ledgerList });
    });

    wrapper.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('ledger-header')) {
        target.classList.toggle('active');
      }
    });
  }
}
