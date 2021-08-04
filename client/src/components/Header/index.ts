import Component from '@/src/core/Component';
import CalendarModel from '@/src/models/Calendar';
import LoginModal from '@/src/components/LoginModal';
import './index.scss';
import SvgIcon from '@/src/assets/svg';
import MonthPicker from '../MonthPicker';
import { router } from '@/src/core/router';
import { html, sibling } from '@/src/utils/codeHelper';
import { qs } from '@/src/utils/selectHelper';
import { checkUser } from '@/src/api/loginAPI';

interface IProp {}

interface IState {
  date: Date;
  darkMode?: boolean;
}
const HEADER_OBSERVER_LISTENER_KEY = 'header';
export default class Header extends Component<IState, IProp> {
  setup() {
    this.$state.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.$state.date = CalendarModel.getDate();
    CalendarModel.subscribe(HEADER_OBSERVER_LISTENER_KEY, () => {
      this.setState({
        date: CalendarModel.getDate(),
      });
    });
    //   const
  }

  template() {
    const { date, darkMode } = this.$state;

    return html`
      <div class="header-wrap">
        <ul>
          <li class="left">Woowa<br />Money Diary</li>
          <li class="center">
            <div class="arrow" data-click="prev"><</div>
            <div class="date-wrap">
              <div class="month">${date.getMonth() + 1}월</div>
              <div class="year">${date.getFullYear()}</div>
            </div>
            <div class="arrow" data-click="next">></div>
          </li>
          <li class="header-wrap-right">
            <div class="svg-icon" data-page="/">${SvgIcon.fileText}</div>
            <div class="svg-icon" data-page="/calendar">${SvgIcon.calendar}</div>
            <div class="svg-icon" data-page="/statistic">${SvgIcon.chart}</div>
            <div class="svg-icon" data-page="/wallet">${SvgIcon.card}</div>
          </li>
          <li class="theme-changer">
            <button class="theme-changer--button ${darkMode ? 'dark' : 'light'}"></button>
          </li>
        </ul>
      </div>
    `;
  }

  async mounted() {
    const dataWrap = document.querySelector('.date-wrap') as HTMLElement;
    const iconsWrap = qs('.header-wrap-right', this.$target) as HTMLElement;
    const themeToggleButton = qs('.theme-changer--button', this.$target) as HTMLElement;
    dataWrap.addEventListener('click', () => this.showMonthPiceker(dataWrap));

    (iconsWrap.querySelector(`[data-page="${location.pathname}"]`) as HTMLElement).classList.add('selected');
    //router
    iconsWrap.addEventListener('click', this.pageRouteClickHandler);
    //month-picker
    const headerCenter = qs('.header-wrap .center', this.$target) as HTMLElement;
    headerCenter.addEventListener('click', this.monthChangeClickHandler);

    themeToggleButton.addEventListener('click', this.themeChangeClickHandler);
  }

  async setEvent() {
    try {
      await checkUser();
      CalendarModel.setDate(new Date());
    } catch (error) {
      this.showLoginModal();
    }
  }

  showLoginModal() {
    new LoginModal(document.body);
  }

  showMonthPiceker = (target: HTMLElement) => {
    let Month: string | string[] | undefined = target.querySelector('.month')?.innerHTML.split('');
    Month?.splice(-1);
    Month = Month?.join('');
    new MonthPicker(document.body);
  };

  pageRouteClickHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const page = target.dataset.page;

    if (page && location.pathname != page) {
      sibling(target).forEach((el: Element) => el.classList.remove('selected'));
      target.classList.add('selected');
      router.push(`${page}`);
    }
  }

  monthChangeClickHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;

    switch (target.dataset.click) {
      case 'prev':
        CalendarModel.prevMonth();
        break;
      case 'next':
        CalendarModel.nextMonth();
        break;
    }
  }

  themeChangeClickHandler(e: MouseEvent) {
    const toggleButton = e.currentTarget as HTMLElement;
    if (toggleButton.classList.contains('dark')) {
      document.body.setAttribute('class', 'light-mode');
      toggleButton.classList.replace('dark', 'light');
    } else {
      document.body.setAttribute('class', 'dark-mode');
      toggleButton.classList.replace('light', 'dark');
    }
  }
}
