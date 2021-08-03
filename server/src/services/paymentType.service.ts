import { PaymentTypeRequestDTO, PaymentTypeResponseDTO } from "../dto/PaymentTypeDTO";
import paymentTypeRepository from "../repositories/paymentType.repository";
import userRepository from "../repositories/user.repository";

class PaymentTypeService {

    // TODO: 상위 수준에서 Error를 잡아줘야한다.
    // TODO: 필요하다면 Error를 정의.
    async getOwnPaymentTypes(userIdAsNumber: number): Promise<PaymentTypeResponseDTO[]> {
        const userWidthPaymentTypes = await userRepository.getUserWithPaymentTypes(userIdAsNumber);

        if (!userWidthPaymentTypes) {
            throw new Error("존재하지않는 유저의 PaymentType을 조회했습니다.");
        }

        if (!userWidthPaymentTypes.paymentTypes) {
            throw new Error(`해당 계정(${userIdAsNumber})의 계정의 PaymentType을 불러오는데 실패했습니다.`);
        }

        return userWidthPaymentTypes.paymentTypes.map(paymentType => {
            const { id, bgColor, fontColor, name } = paymentType;
            return {
                id: id!,
                bgColor,
                fontColor,
                name
            }
        })
    }

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