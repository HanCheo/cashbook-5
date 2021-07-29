import Component from '@/src/core/Component';
import { ILedgerList } from '@/src/interfaces/Ledger';
import LedgerDataModel from '@/src/models/Ledgers';
import { YOIL_ENG_SHORT } from '@/src/utils/calendar';
import { addComma } from '@/src/utils/codeHelper';
import { qs } from '@/src/utils/selecthelper';
import LedgerList from '../LedgerList';
import './index.scss';

interface IState {
  date: Date;
  ledgerData: ILedgerList[];
}

interface IProps {}

export default class calendar extends Component<IState, IProps> {
  setup() {
    this.$state.ledgerData = LedgerDataModel.getData();
    this.$state.date = new Date();
  }

  template() {
    return `<div class="calendar-container">
              <ul class="header"></ul>
              <ul class="body"></ul>
            </div>
            <div class="day-ledger-info"></div>`;
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
    const thisLast = new Date(viewYear, viewMonth, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    // Dates 기본 배열들
    const prevDates: number[] = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
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
    const dates = prevDates.concat(thisDates, nextDates);

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

        return `
        <li class="date" ${condition ? `data-key="${key}"` : ''}>
          <div ${condition ? '' : 'class="other"'}>${day}</div>
        </li>`;
      })
      .join('');
  }

  mounted() {
    this.renderCalendar();
    this.ledgerFetchCalendar();

    const calendarBody = qs('.calendar-container .body', this.$target) as HTMLElement;
    calendarBody.addEventListener('click', this.showDayLedger.bind(this));

    //ledger-header Dropdown Event
    // 의견 공유 필요 어차피 하루 일자밖에 나오지 않아서 드롭다운이 필요 없을 것 같이 느껴짐
    // const dayLedgerInfo = qs('.day-ledger-info', this.$target) as HTMLElement;
    // dayLedgerInfo.addEventListener('click', e => {
    //   const target = e.target as HTMLElement;
    //   if (target.classList.contains('ledger-header')) {
    //     target.classList.toggle('active');
    //   }
    // });
  }

  ledgerFetchCalendar() {
    const { ledgerData } = this.$state;

    ledgerData.forEach(ledgerDayData => {
      const { numDate, income, spand } = ledgerDayData;

      const day = qs(`li[data-key="${numDate}"]`, this.$target) as HTMLElement;

      day.insertAdjacentHTML(
        'beforeend',
        `<div class="day-amount">
        <div class="income">${addComma(income)}</div>
        <div class="spand">${addComma(spand)}</div>
        <div class="amount">${addComma(spand + income)}</div>
      </div>`
      );
    });
  }

  showDayLedger(e: MouseEvent) {
    const { ledgerData } = this.$state;
    const key = (e.target as HTMLElement).dataset.key;
    const dayLedgerInfo = qs('.day-ledger-info', this.$target) as HTMLElement;

    const ledgerList = ledgerData.find(data => data.numDate == key);

    console.log(ledgerData, key, dayLedgerInfo);
    if (!ledgerList) return;

    dayLedgerInfo.innerHTML = '';
    new LedgerList(dayLedgerInfo, { ledgerList: ledgerList });

    dayLedgerInfo.scrollIntoView({ behavior: 'smooth' });
  }
}
