import Calendar from '@/src/components/Calendar';
import Component from '@/src/core/Component';
import './index.scss';

interface IState {}
interface IProps {}

export default class CalendarPages extends Component<IState, IProps> {
  template() {
    return `<div class="calendar-wrapper"></div>`;
  }

  mounted() {
    const target = this.$target.querySelector('.calendar-wrapper') as HTMLElement;

    new Calendar(target);
  }
}
