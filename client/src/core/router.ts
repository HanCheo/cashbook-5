import { isClass } from './routerHelper';
import { customEvent, listen } from '../utils/customEvent';

/**
 * **DO NOT MODIFY THIS FILE**
 */

export interface RouterType {
  $app: HTMLElement;
  routes: Route[];
  fallback?: string;
}

export interface Route {
  path: string;
  redirect?: string;
  component?: any;
  middlewares?: any;
}

class Router {
  $app: HTMLElement;
  fallback: string = '';
  routes: {
    [key: string]: Route;
  } = {};

  constructor({ $app, routes, fallback = '/' }: RouterType) {
    this.$app = $app;
    this.fallback = fallback;
    this.generateRoutes(routes);
    this.initEvent();
  }
  generateRoutes(routes: Route[]) {
    this.routes = {};
    routes.forEach(route => {
      this.routes[route.path] = route;
    });
  }
  //pages에서 동적인 이동을 위한 커스텀 이벤트
  //historyAPI 이벤트 감지
  initEvent() {
    listen('routechange', this.routerHendler.bind(this) as EventListener);
    window.onpopstate = () => this.popstateHandler();
  }

  //path경로의 라우터 정보를 가져옴
  getRoute(path: string) {
    const route = this.routes[path];
    if (!route) throw new Error(`Not found route: ${path}`);
    return route;
  }

  //path 경로가 있는지 확인
  hasRoute(path: string) {
    return typeof this.routes[path] !== 'undefined';
  }

  //route의 component를 가져옴
  getComponent(route: Route) {
    const component = route.component;
    return component;
  }

  //component에 unmount라는 이벤트를 발생시키고
  //history에 정보저장 -> 새로운 컴포넌트 렌더링
  routerHendler(event: CustomEvent) {
    this.unmountComponent();
    const path: string = event.detail.path;
    history.pushState(event.detail, '', path);
    this.renderComponent(path, event.detail);
  }

  //history에 있는 정보 가져옴
  popstateHandler() {
    this.unmountComponent();
    this.renderComponent(history.state.path, history.state);
  }

  //커스텀 이벤트 발생
  unmountComponent() {
    customEvent('componentWillUnmount');
  }

  //path와 정보를 이용하여 컴포넌트 렌더링
  renderComponent(path: string, detail: object) {
    let route: Route;

    if (this.hasRoute(path)) route = this.getRoute(path);
    else route = this.getRoute(this.fallback);

    if (route.redirect) {
      this.push(route.redirect);
      return;
    }
    const component = this.getComponent(route);
    if (component && isClass(component)) {
      new component(this.$app, detail);
    } else {
      throw new Error('Router Error : It is not Component');
    }
  }

  //Page에서 동적으로 route하기 위한 함수.
  push(path: string) {
    customEvent('routechange', {
      ...history.state,
      path,
    });
  }
}

//외부에서 router.push에 접근하기 위한 변수
export let $router: {
  push: (path: string) => void;
};

//router init;
export function initRouter(options: RouterType) {
  const router = new Router(options);
  $router = {
    push: (path: string) => router.push(path),
  };

  customEvent(
    'routechange',
    history.state ?? {
      path: '/',
    }
  );
}
