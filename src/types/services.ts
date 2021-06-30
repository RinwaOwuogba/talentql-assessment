import { PaymentValidatorError } from '../utils';

export interface IPaymentValidationResult {
  valid: boolean;
  error?: PaymentValidatorError;
}
