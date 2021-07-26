import Component from '@/src/interfaces/Component';
import calendarModel from '@/src/models/Canlendar';
import './header.scss';

export default class Header extends Component {
  template() {
    return `
        <div class="hader-wrap">
          <div class="title">가계부</div>
          <div class="month">${this.$state.date}</div>
          <div class="icons">아이콘</div>
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
