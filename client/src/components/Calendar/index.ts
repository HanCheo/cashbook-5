import Component from '@/src/core/Component';
import { YOIL_ENG_SHORT } from '@/src/utils/calendar';
import './index.scss';

interface IState {
  date: Date;
}

interface IProps {}

export default class calendar extends Component<IState, IProps> {
  setup() {
    this.$state.date = new Date();
  }

  template() {
    return `<div class="calendar-container">
              <ul class="header"></ul>
              <ul class="body"></ul>
            </div>`;
  }

  renderCalendar() {
    //calendar headers
    const calendarHeader = this.$target.querySelector('.calendar-container .header') as HTMLElement;
    const yoil = YOIL_ENG_SHORT;
    calendarHeader.innerHTML = yoil.map(yi => `<li>${yi}</li>`).join('');

    //calendar body
    const calendarBody = this.$target.querySelector('.calendar-container .body') as HTMLElement;
    const date = this.$state.date;
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    // 지난 달 마지막 Date, 이번 달 마지막 Date
    const prevLast = new Date(viewYear, viewMonth, 0);
    const thisLast = new Date(viewYear, viewMonth + 1, 0);

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
        return `
        <li class="date">
          <div class="${condition ? '' : 'other'}" data-key="${day}">${day}</div>
        </li>`;
      })
      .join('');
  }

  mounted() {
    this.renderCalendar();
  }
}
