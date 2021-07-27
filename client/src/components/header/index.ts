import Component from '@/src/interfaces/Component';
import calendarModel from '@/src/models/Canlendar';
import './header.scss';
import SvgIcon from '@/src/assets/svg';
import MonthPicker from '../MonthPicker';

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
          <li class="header-wrap-right">
            <div class="svg-icon selected" data-page="fileText">${SvgIcon.fileText}</div>
            <div class="svg-icon" data-page="calender">${SvgIcon.calender}</div>
            <div class="svg-icon" data-page="chart">${SvgIcon.chart}</div>
          </li>
        </ul>
      </div>
    `;
  }

  mounted() {
    const dataWrap = document.querySelector('.date-wrap') as HTMLElement;

    dataWrap.addEventListener('click', () => this.showDatePiceker(dataWrap));
  }

  showDatePiceker = (target: HTMLElement) => {
    let Month: string | string[] | undefined = target.querySelector('.month')?.innerHTML.split('');
    Month?.splice(-1);
    Month = Month?.join('');
    const Year = target.querySelector('.year')?.innerHTML;
    new MonthPicker(target, new Date(`${Year}-${Month}`));
  };

  setup() {
    calendarModel.subscribe(() => {
      this.setState({
        date: calendarModel.getDate(),
      });
    });
  }
}
