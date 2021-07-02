export enum PaymentField {
  creditCardNumber = 'creditCardNumber',
  expirationDate = 'expirationDate',
  cvv2 = 'cvv2',
  email = 'email',
  phoneNumber = 'phoneNumber',
}

export enum ContentType {
  json = 'application/json',
  xml = 'application/xml',
}

export interface IPaymentErrorDetails {
  message: string;
  paymentField: PaymentField;
}

export interface IPaymentValidatorResponse {
  valid: boolean;
  errors?: IPaymentErrorDetails[];
}
