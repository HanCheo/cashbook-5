import { PaymentTypeRequestDTO } from "../dto/PaymentTypeDTO";
import paymentTypeRepository from "../repositories/paymentType.repository";

class PaymentTypeService {
    async createPaymentType(paymentTypeDto: PaymentTypeRequestDTO, userId: number): Promise<number | null> {
        const {
            name,
            bgColor,
            fontColor,
        } = paymentTypeDto;

        //TODO: bgColor, fontColor 검증 혹은 default 처리?

        const paymentTypeId = await paymentTypeRepository.createPaymentType(name, bgColor, fontColor, userId);
        if (paymentTypeId) {
            return paymentTypeId;
        } else {
            return null;
        }
    }
}

const paymentTypeService = new PaymentTypeService();

export default paymentTypeService;