import './normalize.css';
import Header from './components/Header/';
import { initRouter } from './core/router';
import { MainPage, StatisticPage } from './pages';

const routes = [
  { path: '/', component: MainPage },
  { path: '/statistic', component: StatisticPage },
];

const $header = document.querySelector('#header') as HTMLElement;
const $app = document.querySelector('#app') as HTMLElement;

async function init() {
  new Header($header);
  initRouter({ $app, routes });
}
init();
