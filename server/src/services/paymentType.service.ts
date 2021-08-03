import { PaymentTypeRequestDTO, PaymentTypeResponseDTO } from "../dto/PaymentTypeDTO";
import paymentTypeRepository from "../repositories/paymentType.repository";
import userRepository from "../repositories/user.repository";

class PaymentTypeService {

    async getOwnPaymentTypes(userIdAsNumber: number): Promise<PaymentTypeResponseDTO[]> {
        const userWidthPaymentTypes = await userRepository.getUserWithPaymentTypes(userIdAsNumber);

        if (!userWidthPaymentTypes) {
            throw new Error("존재하지않는 유저의 PaymentType을 조회했습니다.");
        }

        if (!userWidthPaymentTypes.paymentTypes) {
            throw new Error(`해당 계정(${userIdAsNumber})의 PaymentType을 불러오는데 실패했습니다.`);
        }

        return userWidthPaymentTypes.paymentTypes
            .filter(paymentType => !paymentType.isDeleted) // filtering soft deleted items 
            .map(paymentType => {
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

    async deletePaymentType(paymentId: number): Promise<boolean> {
        const isSuccess = await paymentTypeRepository.deletePaymentType(paymentId);
        return isSuccess;
    }


    async isOwnPaymentType(paymentTypeId: number, userId: number): Promise<boolean> {
        const paymentType = await paymentTypeRepository.getPaymentType(paymentTypeId);
        if (!paymentType) {
            throw Error(`paymentType(id:${paymentTypeId}) 가 존재하지않습니다.`);
        }

        return paymentType.userId === userId
    }
}

const paymentTypeService = new PaymentTypeService();

export default paymentTypeService;