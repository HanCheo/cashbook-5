import Component from '@/src/core/Component';
import calenderModel from '@/src/models/Calendar';
import './index.scss';
import SvgIcon from '@/src/assets/svg';
import MonthPicker from '../MonthPicker';
import { router } from '@/src/core/router';
import { html, sibling } from '@/src/utils/codeHelper';

interface IProp {}

interface IState {}

export default class Header extends Component<IState, IProp> {
  template() {
    return html`
      <div class="header-wrap">
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
            <div class="svg-icon" data-page="/">${SvgIcon.fileText}</div>
            <div class="svg-icon" data-page="/calendar">${SvgIcon.calendar}</div>
            <div class="svg-icon" data-page="/statistic">${SvgIcon.chart}</div>
            <div class="svg-icon" data-page="/wallet">${SvgIcon.card}</div>
          </li>
        </ul>
      </div>
    `;
  }

  mounted() {
    const dataWrap = document.querySelector('.date-wrap') as HTMLElement;
    const iconsWrap = this.$target.querySelector('.header-wrap-right') as HTMLElement;
    dataWrap.addEventListener('click', () => this.showMonthPiceker(dataWrap));

    (iconsWrap.querySelector(`[data-page="${location.pathname}"]`) as HTMLElement).classList.add('selected');
    //router
    iconsWrap.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const page = target.dataset.page;

      if (page && location.pathname != page) {
        sibling(target).forEach((el: Element) => el.classList.remove('selected'));
        target.classList.add('selected');
        router.push(`${page}`);
      }
    });
  }

  showMonthPiceker = (target: HTMLElement) => {
    let Month: string | string[] | undefined = target.querySelector('.month')?.innerHTML.split('');
    Month?.splice(-1);
    Month = Month?.join('');
    const Year = target.querySelector('.year')?.innerHTML;
    new MonthPicker(target, new Date(`${Year}-${Month}`));
  };

  setup() {
    calenderModel.subscribe(() => {
      this.setState({
        date: calenderModel.getDate(),
      });
    });
  }
}
