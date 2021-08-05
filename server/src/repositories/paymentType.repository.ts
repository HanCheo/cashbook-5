import sequelize from '../db/sequlze';
import PaymentType from '../models/paymentType.model';

class PaymentTypeRepository {
  // Soft Delete
  async deletePaymentType(paymentTypeId: number): Promise<boolean> {
    const originPaymentType = await this.getPaymentType(paymentTypeId);
    if (!originPaymentType) {
      return false;
    } else {
      originPaymentType.isDeleted = true;
      const test = await originPaymentType.save();
      console.log('DELETE RESULT :' + test);
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
      userId,
    });
    if (paymentType) {
      return paymentType.id!;
    } else {
      return null;
    }
  }

  async initPaymentType(userId: number): Promise<number[]> {
    const t = await sequelize.transaction();
    try {
      const result = await PaymentType.bulkCreate(
        [
          { userId, name: '신한카드', bgColor: '#3AA2C8', fontColor: '#333333' },
          { userId, name: '국민카드', bgColor: '#F7C603', fontColor: '#333333' },
          { userId, name: '삼성카드', bgColor: '#0D3278', fontColor: '#FFFFFF' },
          { userId, name: '현대카드', bgColor: '#F7F7F7', fontColor: '#333333' },
          { userId, name: '카카오뱅크', bgColor: '#F6D608', fontColor: '#333333' },
          { userId, name: '현금', bgColor: '#AFE7B4', fontColor: '#333333' },
        ],
        { returning: true }
      );
      const ids = result.map(a => a.id!);
      console.log(ids);
      return ids;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

const paymentTypeRepository = new PaymentTypeRepository();

export default paymentTypeRepository;
