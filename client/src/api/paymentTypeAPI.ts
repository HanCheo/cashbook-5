import { PaymentType } from "../interfaces/PaymentType";
import { deleteFetch, getFetch, postFetch, Result } from "./fetch";


export const getOwnPaymentTypesAsync = async (): Promise<Result<PaymentType[]>> => {
  return await getFetch("/paymentType");
};

export const deleteOwnPaymentTypeAsync = async (id: number): Promise<Result<any>> => {
  return await deleteFetch(`/paymentType/${id}`, { headers: { contentType: 'application/json' } });
}

export const createPaymentTypeAsync = async (name: string, bgColor: string, fontColor: string): Promise<Result<number>> => {

  return await postFetch(`/paymentType`, {
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify({
      name,
      bgColor,
      fontColor
    })
  });
}