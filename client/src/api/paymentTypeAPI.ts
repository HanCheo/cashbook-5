interface Result<D> {
  success: boolean;
  data: D;
}

export interface PaymentType {
  id: number;
  accountId: number;
  name: string;
  bgColor: string;
  fontColor: string;
  createAt: Date;
  updateAt: Date;
  image: string;
}

export const getPaymentTypesAsync = async (): Promise<Result<PaymentType[]>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            accountId: 1,
            name: 'Test Card',
            bgColor: '#00ffff',
            fontColor: '#ffffff',
            createAt: new Date(),
            updateAt: new Date(),
            image: '',
          },
          {
            id: 2,
            accountId: 1,
            name: 'Test Card',
            bgColor: '#ff00ff',
            fontColor: '#ffffff',
            createAt: new Date(),
            updateAt: new Date(),
            image: '',
          },
          {
            id: 3,
            accountId: 1,
            name: 'Test Card',
            bgColor: '#ff0000',
            fontColor: '#ffffff',
            createAt: new Date(),
            updateAt: new Date(),
            image: '',
          },
        ],
      });
    }, 500);
  });
};
