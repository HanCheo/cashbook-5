import './normalize.css';
import Header from './components/header/header';
import { initRouter } from './core/router';
import { Main } from './pages';

/**
 * route
 * - path: string
 * - component: string | class | HTMLElement | () => types | () => Promise<types>
 *   - string: $app.innerHTML에 대입됩니다.
 *   - class: new로 생성하면서 생성자 파라메터로 $app을 넘겨줍니다.
 *   - HTMLElement: $app.appendChild로 추가됩니다.
 * - middlewares: [() => boolean | () => Promise<boolean>]
 *   - 함수 호출 결과가 true이면, 페이지를 이동하고 false 이면, 페이지를 이동하지 않습니다.
 * - redirect: string
 *   - redirect로 바로 이동합니다.
 */
const routes = [{ path: '/', component: Main }];

const $header = document.querySelector('#header') as HTMLElement;
const $app = document.querySelector('#app') as HTMLElement;

async function init() {
  initRouter({ $app, routes });
}
init();
new Header($header);
