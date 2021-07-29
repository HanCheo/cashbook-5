import './normalize.css';
import Header from './components/Header/';
import { initRouter } from './core/router';
import { CalendarPage, MainPage, StatisticPage } from './pages';

const routes = [
  { path: '/', component: MainPage },
  { path: '/statistic', component: StatisticPage },
  { path: '/calendar', component: CalendarPage },
];

const $header = document.querySelector('#header') as HTMLElement;
const $app = document.querySelector('#app') as HTMLElement;

async function init() {
  new Header($header);
  initRouter({ $app, routes });
}
init();
