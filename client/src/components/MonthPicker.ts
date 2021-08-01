import Component from '../core/Component';
import { MONTH_SHORT, MONTH_LONG, MONTH_UNIT } from '../utils/calendar';
import { html } from '../utils/codeHelper';
import CalendarModel from '../models/Calendar';

export default class MonthPicker {
  date: Date;
  month: string;
  monthShort: string;
  year: number;
  $target: HTMLElement;
  monthName: string[];
  monthShortName: string[];

  constructor(target: HTMLElement) {
    this.date = CalendarModel.getDate();
    this.month = this.date.toLocaleString('eng', { month: 'long' });
    this.monthShort = this.date.toLocaleString('eng', { month: 'short' });
    this.year = this.date.getFullYear();
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
      .month-calendar-wrapper {
        position: absolute;
        bottom: 0;
        background: var(--background-color);
        padding: .9em;
        left: 50%;
        border-radius: 9px;
        font-size: 16px;
        z-index: 9;
        transform: translate(-50%, 110%);
        box-shadow: 0 3px 5px grey;
      }
      .month-calendar-wrapper .month-calendar-inner {
        position: relative;
        z-index:9;
      }
      .month-calendar-wrapper .month-calendar-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .month-calendar-wrapper .month-calendar-header div {
        cursor: pointer;
      }
      .month-calendar-wrapper .month-calendar-body {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-column-gap: .5em;
        padding: 1em 1em 0;
      }
      .month-calendar-wrapper .month-calendar-body .month {
        padding: 10px;
        cursor: pointer;
      }

      .month-calendar-wrapper .month-calendar-body .month.selected { 
        background: var(--primary-color);
        border-radius: 9px;
      }
    `;
  }

  template() {
    const currentYear = this.date.getFullYear() == this.year;
    return html`
      <div class="month-calendar-wrapper">
        <style>
          ${this.style()}
        </style>
        <div class="month-calendar-inner">
          <div class="month-calendar-header">
            <div class="prev"><</div>
            <div class="year">${this.year}</div>
            <div class="next">></div>
          </div>
          <div class="month-calendar-body">
            ${this.monthShortName
              .map((month, i) => {
                return html`
                  <div
                    class="month ${currentYear && this.monthShort == month ? 'selected' : ''}"
                    data-month-number="${i + 1}"
                  >
                    ${month}
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const MonthPicker = document.querySelector('.month-calendar-wrapper') as HTMLElement;
    MonthPicker?.remove();
    this.$target.insertAdjacentHTML('afterend', this.template());
    this.mounted();
  }

  mounted() {
    const MonthPicker = document.querySelector('.month-calendar-wrapper') as HTMLElement;
    const prev = MonthPicker.querySelector('.prev') as HTMLElement;
    const next = MonthPicker.querySelector('.next') as HTMLElement;

    prev.addEventListener('click', () => this.setPreviousYear());
    next.addEventListener('click', () => this.setNextYear());

    MonthPicker.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('month')) {
        CalendarModel.setDate(new Date(this.year, Number(target.dataset.monthNumber) - 1, 1));
        MonthPicker.remove();
      }
    });
  }
}
