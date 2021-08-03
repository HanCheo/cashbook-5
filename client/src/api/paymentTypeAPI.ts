import { getFetch, postFetch } from "./fetch";

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


export const getOwnPaymentTypesAsync = async (): Promise<Result<PaymentType[]>> => {
  return await getFetch("/paymentType");
};

export const createPaymentTypeAsync = async (name: string, bgColor: string, fontColor: string): Promise<Result<number>> => {
  return await postFetch(`/paymentType`, {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      bgColor,
      fontColor
    })
  });
}