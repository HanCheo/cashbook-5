interface IEventListener {
  type: string;
  listener: (e: Event) => void;
}

/**
 * S: State Type
 * P: PropertyType
 */

export default class Component<S, P> {
  $target: HTMLElement;
  $state: S;
  $props: P;
  eventlisteners: IEventListener[];

  constructor($target: HTMLElement, $props: P = {} as P) {
    this.$target = $target;
    this.$props = { ...$props };
    this.$state = {} as S;
    this.eventlisteners = [];
    this.init();
  }
  async init() {
    await this.setup();
    await this.render();
    await this.setEvent();
  }

  setup() {}
  template() {
    return ``;
  }
  render() {
    this.$target.innerHTML = this.template();
    this.mounted();
  }
  mounted() {}
  setEvent() {}

  // 컴포넌트가 unmount 되는 시점에 호출되는 메서드
  resetEvent() {
    document.addEventListener(
      'componentWillUnmount',
      () => {
        this.removeEvent();
        this.setUnmount();
      },
      {
        once: true,
      }
    );
  }

  // addEvent를 통해 등록된 이벤트 리스트를 모두 초기화하는 메서드
  removeEvent() {
    this.eventlisteners.forEach(({ type, listener }) => {
      this.$target.removeEventListener(type, listener);
    });
    this.eventlisteners = [];
  }

  // 컴포넌트 단위에서 언마운트 되는 시점에 지정할 작업을 작성하는 메서드
  setUnmount() {}

  setState(newState: S) {
    this.$state = { ...this.$state, ...newState };
    this.render();
  }

  addEvent(this: any, eventType: string, selector: string, callback: Function) {
    const children: Element[] = [...this.$target.querySelectorAll(selector)];
    const isTarget = (target: Element) => children.includes(target) || target.closest(selector);

    const listener = (event: Event) => {
      if (!isTarget(event.target as Element)) return false;
      callback();
    };

    this.$target.addEventListener(eventType, listener);
    this.eventlisteners.push({ type: eventType, listener });
  }
}
