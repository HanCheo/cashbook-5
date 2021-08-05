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
  nextMonth() {
    this.setDate(new Date(this.datetime.getFullYear(), this.datetime.getMonth() + 1, 1));
  }
  prevMonth() {
    this.setDate(new Date(this.datetime.getFullYear(), this.datetime.getMonth() - 1, 1));
  }
}

const _model = new CalendarModel();
export default _model;
