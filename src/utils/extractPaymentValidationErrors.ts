import { IPaymentValidationResult } from '../types/services';
import { PaymentField } from '../types/utils';

interface IPaymentErrorDetails {
  message: string;
  paymentField: PaymentField;
}

interface IPaymentValidatorResponse {
  valid: boolean;
  errors?: IPaymentErrorDetails[];
}

export const extractPaymentValidationResult = (
  validationResults: IPaymentValidationResult[]
): IPaymentValidatorResponse => {
  const errors = [] as IPaymentErrorDetails[];
  let valid = true;

  validationResults.forEach((result) => {
    if (!result.valid) {
      errors.push({
        message: result.error?.message || '',
        paymentField: result.error?.paymentField as PaymentField,
      });
      valid = false;
    }
  });

  return {
    valid,
    errors,
  };
};
