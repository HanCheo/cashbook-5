import Observer from './Observer';

export class CalendarModel extends Observer {
  datetime: Date;
  constructor() {
    super();
    this.datetime = new Date();
  }
  getDate() {
    return this.datetime;
  }
  setDate(datetime: Date) {
    this.datetime = datetime;
    this.notify();
  }
}

const _model = new CalendarModel();
export default _model;
