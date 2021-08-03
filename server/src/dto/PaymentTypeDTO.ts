export type PaymentTypeResponseDTO = {
    id: number,
    name: string,
    bgColor: string,
    fontColor: string,
}

export type PaymentTypeRequestDTO = {
    name: string,
    bgColor: string,
    fontColor: string,
}

export type PaymentTypeRemoveRequestDTO = {
    id: number
}