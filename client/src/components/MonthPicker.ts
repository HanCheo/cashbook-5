import Component from '../core/Component';
import { MONTH_SHORT, MONTH_LONG, MONTH_UNIT } from '../utils/calendar';
import { html } from '../utils/codeHelper';

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
      .calendar-wrapper {
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
      .calendar-wrapper .calendar-inner {
        position: relative;
        z-index:9;
      }
      .calendar-wrapper .calendar-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .calendar-wrapper .calendar-header div {
        cursor: pointer;
      }
      .calendar-wrapper .calendar-body {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-column-gap: .5em;
        padding: 1em 1em 0;
      }
      .calendar-wrapper .calendar-body .month {
        padding: 10px;
        cursor: pointer;
      }

      .calendar-wrapper .calendar-body .month.selected { 
        background: var(--primary-color);
        border-radius: 9px;
      }
    `;
  }

  template() {
    const currentYear = this.date.getFullYear() == this.year;
    return html`
      <div class="calendar-wrapper">
        <style>
          ${this.style()}
        </style>
        <div class="calendar-inner">
          <div class="calendar-header">
            <div class="prev"><</div>
            <div class="year">${this.year}</div>
            <div class="next">></div>
          </div>
          <div class="calendar-body">
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
    const MonthPicker = document.querySelector('.calendar-wrapper') as HTMLElement;
    MonthPicker?.remove();
    this.$target.insertAdjacentHTML('afterend', this.template());
    this.mounted();
  }

  mounted() {
    const MonthPicker = document.querySelector('.calendar-wrapper') as HTMLElement;
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
