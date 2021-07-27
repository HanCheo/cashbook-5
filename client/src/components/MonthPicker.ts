import Component from '../interfaces/Component';
import { MONTH_SHORT, MONTH_LONG, MONTH_UNIT } from '../utils/calender';

export default class MonthPicker {
  date: Date;
  month: string;
  monthShort: string;
  year: number;
  $target: HTMLElement;
  monthName: string[];
  monthShortName: string[];
  constructor(target: HTMLElement, date: Date | null) {
    if (!date) date = new Date();
    this.date = date;
    this.month = date.toLocaleString('eng', { month: 'long' });
    this.monthShort = date.toLocaleString('eng', { month: 'short' });
    this.year = date.getFullYear();
    this.$target = target;
    this.monthName = MONTH_LONG;
    this.monthShortName = MONTH_SHORT;
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
        z-index: 9;
        color: black;
        transform: translate(-50%, 110%);
        box-shadow: 0 3px 5px grey;
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

        monthTarget.textContent = target.dataset.monthNumber + MONTH_UNIT;
        yearTarget.textContent = year;

        MonthPicker.remove();
      }
    });
  }
}
