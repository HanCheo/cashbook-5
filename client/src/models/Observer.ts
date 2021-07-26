export default class Observer {
  _observers: Set<any>;
  constructor() {
    this._observers = new Set();
  }

  subscribe(observer: Function) {
    this._observers.add(observer);
  }

  notify() {
    this._observers.forEach(observer => observer());
  }
}
