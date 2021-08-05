import { Op } from 'sequelize';
import Ledger from '../models/ledger.model';
import PaymentTypeRepository from './paymentType.repository';

class LedgerRepository {
  /**
   * Get All Ledgers between startDate and endDate
   * @param startDate Date
   * @param endDate Date
   * @param userId number
   * @returns  Promise<Ledger[]>
   */
  async userLedgersByMonth(startDate: Date, endDate: Date, userId: number): Promise<Ledger[]> {
    const Ledgers = await Ledger.findAll({
      include: [Ledger.associations.category, Ledger.associations.user, Ledger.associations.paymentType],
      order: [['date', 'ASC']],
      where: {
        userId: userId,
        date: { [Op.between]: [startDate, endDate] },
      },
    });

    return Ledgers;
  }

  /**
   * Get All Ledgers between startDate and endDate
   * @param startDate Date
   * @param endDate Date
   * @param userId number
   * @returns  Promise<Ledger[]>
   */
  async userExpenseLedgersByMonth(startDate: Date, endDate: Date, userId: number): Promise<Ledger[]> {
    const Ledgers = await Ledger.findAll({
      include: [Ledger.associations.category, Ledger.associations.user, Ledger.associations.paymentType],
      order: [['date', 'ASC']],
      where: {
        userId: userId,
        amount: { [Op.lt]: [0] },
        date: { [Op.between]: [startDate, endDate] },
      },
    });

    return Ledgers;
  }

  /**
   * Ledger를 생성하는 API
   * @param userId 유저의 고유 식별자(id)
   * @param categoryId 카테고리의 고유 식별자(id)
   * @param content Ledger의 내용
   * @param amount Ledger의 비용
   * @param date Ledger의 생성 일자
   * @returns 생성된 Ledger 데이터의 id
   */
  async createLedger(
    userId: number,
    categoryId: number,
    paymentTypeId: number,
    content: string,
    amount: number,
    date: string
  ): Promise<number | null> {
    const newLedger = await Ledger.create<Ledger>({
      userId,
      paymentTypeId,
      categoryId,
      date,
      content,
      amount,
    });
    if (newLedger) {
      return newLedger.id!;
    } else {
      return null;
    }
  }

  /**
   * 하나의 Ledger를 조회하는 API
   * @param id Ledger Id
   */
  async getLedger(id: number): Promise<Ledger | null> {
    return await Ledger.findOne({
      include: [Ledger.associations.category, Ledger.associations.paymentType, Ledger.associations.user],
      where: { id },
    });
  }

  /**
   * id를 이용해서 Ledger 삭제
   * * @param id Ledger Id
   */
  async deleteLedger(id: number): Promise<number> {
    const countOfDeleted = await Ledger.destroy({ where: { id } });
    return countOfDeleted;
  }

  /**
   * Ledger를 변경하는 API
   * @param userId 유저의 고유 식별자(id)
   * @param categoryId 카테고리의 고유 식별자(id)
   * @param content Ledger의 내용
   * @param amount Ledger의 비용
   * @param date Ledger의 생성 일자
   * @returns 생성된 Ledger 데이터의 id
   */
  async updateLedger(
    id: number,
    userId: number,
    categoryId: number,
    paymentTypeId: number,
    content: string,
    amount: number,
    date: string
  ): Promise<Ledger> {
    const originLedger = await Ledger.findOne({
      where: { id },
    });

    if (!originLedger) throw Error('not exist ledger');

    originLedger.userId = userId;
    originLedger.paymentTypeId = paymentTypeId;
    originLedger.categoryId = categoryId;
    originLedger.date = date;
    originLedger.content = content;
    originLedger.amount = amount;

    return originLedger.save();
  }

  async initLedgersData(userId: number) {
    try {
      const paymentTypes = await PaymentTypeRepository.initPaymentType(userId);
      const date = new Date();
      const basicYearMonth = date.getFullYear() + '-' + (date.getMonth() + 1) + '-';
      const initData = [
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 1,
          content: '안녕하세요 :)',
          amount: 100000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 1,
          content: '이건 데모 및 테스트용 데이터 입니다.',
          amount: -100000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 2,
          content: '유저를 생성할때 자동으로 만들어지며',
          amount: -5000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 3,
          content: '좀더 원활한 테스트 진행을 위해 만들어졌습니다.',
          amount: -25000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 4,
          content: '재미있게 구경해주세요 :)',
          amount: -15000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 5,
          content: '시퀄라이저를 사용하였는데 다른 OMR에 비해 코딩할 내용이 많은것 같습니다.',
          amount: -8000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 5,
          content: '옵션으로 항상 추가해주어야 하는 부분도 있고',
          amount: 5000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 5,
          content: '생각보다 옵션이 많아서 계속 찾게되는 경향이 있었습니다.',
          amount: 9000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 5,
          content: '트랜잭션을 키면 왜 쿼리에 옵션으로 넣어 연결해야하는지도 잘 모르겠습니다.',
          amount: -1500,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 5,
          content: '자료가 많은 이유가 이러한 이유지 않을까 싶습니다.',
          amount: 9000,
        },
        {
          userId,
          paymentTypeId: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
          categoryId: Math.floor(Math.random() * 10) + 1,
          date: basicYearMonth + 5,
          content: '다음부터는 다른 ORM을 사용할 계획입니다. :)',
          amount: -1500,
        },
      ];

      await Ledger.bulkCreate(initData);
    } catch (error) {
      console.log(error);
    }
  }
}

const ledgerRepository = new LedgerRepository();
export default ledgerRepository;
