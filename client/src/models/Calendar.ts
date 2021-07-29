import Observer from './Observer';

export class calendarModel extends Observer {
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

const _model = new calendarModel();
export default _model;
