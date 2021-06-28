import { PaymentField } from '../types/utils';
import { PaymentValidatorError } from './errors';

interface IPaymentErrorDetails {
  message: string;
  paymentField: PaymentField;
}

interface IPaymentValidatorResponse {
  valid: boolean;
  errorCode?: number;
  errors?: IPaymentErrorDetails[];
}

export const extractPaymentValidationErrors = (
  error: PaymentValidatorError
): IPaymentValidatorResponse => ({
  valid: false,
  errorCode: 400,
  errors: [
    {
      message: error.message,
      paymentField: error.paymentField,
    },
  ],
});
