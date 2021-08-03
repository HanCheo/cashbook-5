import PaymentType from "../models/paymentType.model";

class PaymentTypeRepository {

    async createPaymentType(name: string, bgColor: string, fontColor: string, userId: number): Promise<number | null> {
        const paymentType = await PaymentType.create({
            name,
            bgColor,
            fontColor,
            userId
        });
        if (paymentType) {
            return paymentType.id!;
        } else {
            return null;
        }
    }
}


const paymentTypeRepository = new PaymentTypeRepository();

export default paymentTypeRepository;