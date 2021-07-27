import Component from '@/src/interfaces/Component';
import calendarModel from '@/src/models/Canlendar';
import './header.scss';
import SvgIcon from '@/src/assets/svg';

export default class Header extends Component {
  template() {
    return /*html*/ `
      <div class="hader-wrap">
        <ul>
          <li class="left">우아한 가계부</li>
          <li class="center">
            <div class="arrow"><</div>
            <div class="date-wrap">
              <div class="month">7월</div>
              <div class="year">2021</div>
            </div>
            <div class="arrow">></div>
          </li>
          <li class="right">
            <div class="selected" data-page="fileText">${SvgIcon.fileText}</div>
            <div data-page="calender">${SvgIcon.calender}</div>
            <div data-page="chart">${SvgIcon.chart}</div>
          </li>
        </ul>
      </div>
    `;
  }

  mounted() {
    const dataWrap = document.querySelector('.date-wrap') as HTMLElement;

    // const $monthLabelElement = document.querySelector('.month');
    // $monthLabelElement?.addEventListener('click', () => {
    //   calendarModel.setDate(new Date());
    // });

    dataWrap.addEventListener('click', () => {
      let Month: string | string[] | undefined = dataWrap.querySelector('.month')?.innerHTML.split('');
      Month?.splice(-1);
      Month = Month?.join('');
      const Year = dataWrap.querySelector('.year')?.innerHTML;
      new MonthPicker(dataWrap, new Date(`${Year}-${Month}`));
    });
  }

  setup() {
    calendarModel.subscribe(() => {
      this.setState({
        date: calendarModel.getDate(),
      });
    });
  }
}

class MonthPicker {
  date: Date;
  month: string;
  monthShort: string;
  year: number;
  $target: HTMLElement;
  monthName: string[];
  monthShortName: string[];
  constructor(target: HTMLElement, date: Date | null) {
    if (!date) date = new Date();
    console.log(date);
    this.date = date;
    this.month = date.toLocaleString('eng', { month: 'long' });
    this.monthShort = date.toLocaleString('eng', { month: 'short' });
    this.year = date.getFullYear();
    this.$target = target;
    this.monthName = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.monthShortName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.render();
  }

  setPreviousYear() {
    this.year -= 1;
    this.render();
  }
  setNextYear() {
    this.year += 1;
    this.render();
  }

  style() {
    return ` 
      .calender-wrapper {
        position: absolute;
        bottom: 0;
        background: white;
        padding: .9em;
        left: 50%;
        border-radius: 9px;
        font-size: 16px;
        color: black;
        transform: translate(-50%, 110%);
        box-shadow: 0 3px 5px grey;
      }
      .calender-wrapper::before {
        content: '';
        position : fixed;
        top: 0;
        z-index: 1;
        left: 0;
        width: 100vw;
        height: 100vh;
      }
      .calender-wrapper .calender-inner {
        position: relative;
        z-index:9;
      }
      .calender-wrapper .calender-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .calender-wrapper .calender-header div {
        cursor: pointer;
      }
      .calender-wrapper .calender-body {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-column-gap: .5em;
        padding: 1em 1em 0;
      }
      .calender-wrapper .calender-body .month {
        padding: 10px;
        cursor: pointer;
      }

      .calender-wrapper .calender-body .month.selected { 
        background: var(--primary-color);
        border-radius: 9px;
      }
    `;
  }

  template() {
    const currentYear = this.date.getFullYear() == this.year;
    return /*html*/ `
      <div class="calender-wrapper">
        <style>${this.style()}</style>
        <div class="calender-inner">
          <div class="calender-header">
            <div class="prev"><</div>
            <div class="year">${this.year}</div>
            <div class="next">></div>
          </div>
          <div class="calender-body">
          ${this.monthShortName
            .map((month, i) => {
              return /*html*/ ` <div class="month ${
                currentYear && this.monthShort == month ? 'selected' : ''
              }" data-month-number="${i + 1}">${month}</div>
              `;
            })
            .join('')}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const MonthPicker = document.querySelector('.calender-wrapper') as HTMLElement;
    MonthPicker?.remove();
    this.$target.insertAdjacentHTML('afterend', this.template());
    this.mounted();
  }

  mounted() {
    const MonthPicker = document.querySelector('.calender-wrapper') as HTMLElement;
    const prev = MonthPicker.querySelector('.prev') as HTMLElement;
    const next = MonthPicker.querySelector('.next') as HTMLElement;

    prev.addEventListener('click', () => this.setPreviousYear());
    next.addEventListener('click', () => this.setNextYear());

    MonthPicker.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('month')) {
        const year = this.year.toString();
        const monthTarget = this.$target.querySelector('.month') as HTMLElement;
        const yearTarget = this.$target.querySelector('.year') as HTMLElement;

        monthTarget.textContent = target.dataset.monthNumber + '월';
        yearTarget.textContent = year;

        MonthPicker.remove();
      }
    });
  }
}
