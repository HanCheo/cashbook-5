import Component from '@/src/interfaces/Component';
import calendarModel from '@/src/models/Canlendar';
import './header.scss';

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
          <li class="right">아이콘</li>
        </ul>
      </div>
    `;
  }

  mounted() {
    const $monthLabelElement = document.querySelector('.month');
    $monthLabelElement?.addEventListener('click', () => {
      calendarModel.setDate(new Date());
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
