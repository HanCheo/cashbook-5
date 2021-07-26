export default class Component {
  $target: HTMLElement;
  $state: any;
  $props?: any;

  constructor($target: HTMLElement, $props?: any) {
    this.$target = $target;
    this.$props = { ...$props };
    this.setup();
    this.render();
    this.setEvent();
  }
  setup() {}
  mounted() {}
  template() {
    return ``;
  }
  render() {
    this.$target.innerHTML = this.template();
    this.mounted();
  }
  setEvent() {}
  setState(newState: any) {
    this.$state = { ...this.$state, ...newState };
    this.render();
  }
  addEvent(this: any, eventType: string, selector: string, callback: Function) {
    const children = [...this.$target.querySelectorAll(selector)];
    const isTarget = (target: any) => children.includes(target) || target.closest(selector);
    this.$target.addEventListener(eventType, (event: Event) => {
      if (!isTarget(event.target)) return false;
      callback(event);
    });
  }
}
