import PaymentType from "../models/paymentType.model";

class PaymentTypeRepository {
    // Soft Delete
    async deletePaymentType(paymentTypeId: number): Promise<boolean> {
        const originPaymentType = await this.getPaymentType(paymentTypeId);
        if (!originPaymentType) {
            return false;
        } else {
            originPaymentType.isDeleted = true;
            const test = await originPaymentType.save();
            console.log("DELETE RESULT :" + test);
            return true;
        }
    }

    async getPaymentType(id: number): Promise<PaymentType | null> {
        const paymentType = await PaymentType.findOne({ where: { id } });
        return paymentType;
    }

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