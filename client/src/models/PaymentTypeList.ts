
import { PaymentType } from '../interfaces/PaymentType';
import Observer from './Observer';

export class PaymentTypeListModel extends Observer {
    paymentTypes: PaymentType[];
    constructor() {
        super();
        this.paymentTypes = [];
    }
    getPaymentTypes() {
        return this.paymentTypes;
    }
    setPaymentTypes(paymentTypes: PaymentType[]) {
        this.paymentTypes = paymentTypes;
        this.notify();
    }
}

const _model = new PaymentTypeListModel();
export default _model;
