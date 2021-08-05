import Component from '@/src/core/Component';
import { ILedger, ILedgerList } from '@/src/interfaces/Ledger';
import CalendarModel from '@/src/models/Calendar';
import LedgerDataModel from '@/src/models/Ledgers';
import { YOIL_ENG_SHORT } from '@/src/utils/calendar';
import { addComma, html, sibling } from '@/src/utils/codeHelper';
import { qs } from '@/src/utils/selectHelper';
import LedgerList from '../LedgerList';
import './index.scss';

interface IState {
  date: Date;
  ledgerData: ILedgerList[] | undefined;
  totalCount: number;
  totalIncomes: number;
  totalSpand: number;
}

interface IProps {
  date: Date;
  ledgerData: ILedgerList[] | undefined;
}

const PREV_MONTHDAY_KEY = 'prev';
const NEXT_MONTHDAY_KEY = 'next';

export default class Calendar extends Component<IState, IProps> {
  setup() {
    this.$state.ledgerData = this.$props.ledgerData;
    this.$state.date = this.$props.date;

    this.$state.totalIncomes = 0;
    this.$state.totalSpand = 0;
    this.$state.ledgerData?.forEach((ledgerList: ILedgerList) => {
      ledgerList.ledgers.forEach((ledger: ILedger) => {
        ledger.amount < 0
          ? ((this.$state.totalSpand) += ledger.amount)
          : ((this.$state.totalIncomes) += ledger.amount);
      });
    });
  }

  template() {
    const { totalIncomes, totalSpand } = this.$state;

    return html`<div class="calendar-container">
        <ul class="header"></ul>
        <ul class="body"></ul>
        <div class="calendar--footer">
          <div class="amouts">
            <div>총 수입 : ${'' + totalIncomes}</div>
            <div>총 지출 : ${'' + totalSpand}</div>
          </div>
          <div class="total-amount">총계 : ${'' + (totalIncomes + totalSpand)}</div>
        </div>
      </div>
      <div class="day-ledger-info"></div>`;
  }

  mounted() {
    this.renderCalendar();
    this.renderLedgersInCalendar();

    const calendarBody = qs('.calendar-container .body', this.$target) as HTMLElement;
    calendarBody.addEventListener('click', this.showDayLedger.bind(this));
  }

  renderCalendar() {
    //calendar headers
    const calendarHeader = qs('.calendar-container .header', this.$target) as HTMLElement;
    const yoil = YOIL_ENG_SHORT;
    calendarHeader.innerHTML = yoil.map(yi => `<li>${yi}</li>`).join('');

    //calendar body
    const calendarBody = qs('.calendar-container .body', this.$target) as HTMLElement;
    const date = this.$state.date;
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth() + 1;

    // 지난 달 마지막 Date, 이번 달 마지막 Date
    const prevLast = new Date(viewYear, viewMonth - 1, 0);
    const curLast = new Date(viewYear, viewMonth, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = curLast.getDate();
    const TLDay = curLast.getDay();

    // Dates 기본 배열들
    const prevDates: number[] = [];
    const curDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates: number[] = [];

    // prevDates 계산
    if (PLDay !== 6) {
      for (let i = 0; i < PLDay + 1; i++) {
        prevDates.unshift(PLDate - i);
      }
    }

    // nextDates 계산
    for (let i = 1; i < 7 - TLDay; i++) {
      nextDates.push(i);
    }

    // Dates 합치기
    const dates = prevDates.concat(curDates, nextDates);

    // 현재달이 아닌 일자 확인용
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(TLDate);

    // Dates 그리기
    calendarBody.innerHTML = dates
      .map((day, i) => {
        const condition = i >= firstDateIndex && i < lastDateIndex + 1;

        let key: string = '';
        key += viewMonth < 10 ? '0' + viewMonth : viewMonth;
        key += day < 10 ? '0' + day : day;

        if (!condition) {
          key = i >= firstDateIndex ? NEXT_MONTHDAY_KEY : key;
          key = i < lastDateIndex + 1 ? PREV_MONTHDAY_KEY : key;
        }

        return html` <li class="date" data-key="${key}">
          <div ${condition ? '' : 'class="other"'}>${day}</div>
        </li>`;
      })
      .join('');
  }

  renderLedgersInCalendar() {
    const { ledgerData } = this.$state;

    ledgerData?.forEach(ledgerDayData => {
      const { numDate, income, spand, ledgers } = ledgerDayData;
      let incomeCnt = 0;
      let spandCnt = 0;
      ledgers.forEach(ledger => {
        if (ledger.amount > 0) incomeCnt++;
        if (ledger.amount < 0) spandCnt++;
      });

      const day = qs(`li[data-key="${numDate}"]`, this.$target) as HTMLElement;

      day?.insertAdjacentHTML(
        'beforeend',
        html`<div class="day-amount">
          <div class="income">${addComma(income)}</div>
          <div class="spand">${addComma(spand)}</div>
          <div class="amount">${addComma(spand + income)}</div>

          ${incomeCnt ? `<div class="income mobile"> ${incomeCnt} 건</div>` : ''}
          ${spandCnt ? `<div class="spand mobile"> ${spandCnt} 건 </div>` : ''}
        </div>`
      );
    });
  }

  showDayLedger(e: MouseEvent) {
    const { ledgerData } = this.$state;
    const target = e.target as HTMLElement;
    const key = target.dataset.key;
    const dayLedgerInfo = qs('.day-ledger-info', this.$target) as HTMLElement;

    if (key == PREV_MONTHDAY_KEY) CalendarModel.prevMonth();
    if (key == NEXT_MONTHDAY_KEY) CalendarModel.nextMonth();

    sibling(target).forEach(el => el.classList.remove('selected'));
    target.classList.add('selected');

    const ledgerList = ledgerData?.find(data => data.numDate == key);
    if (!ledgerList) {
      dayLedgerInfo.innerHTML = '';
      return;
    }

    dayLedgerInfo.innerHTML = '';
    new LedgerList(dayLedgerInfo, { ledgerList: ledgerList });

    dayLedgerInfo.scrollIntoView({ behavior: 'smooth' });
  }
}
