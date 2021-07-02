import { IPaymentValidationResult } from '../types/services';
import {
  IPaymentErrorDetails,
  IPaymentValidatorResponse,
  PaymentField,
} from '../types/utils';

/**
 * Extracts the data from a validation result
 * @param validationResults
 * @returns
 */
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
