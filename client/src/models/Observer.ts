export default class Observer {
  _observers: Map<string, any>;

  constructor() {
    this._observers = new Map();
  }

  subscribe(key: string, observer: Function) {
    this._observers.set(key, observer);
  }

  unsubscribe(key: string) {
    this._observers.delete(key);
  }

  notify() {
    this._observers.forEach(observer => observer());
  }
}
