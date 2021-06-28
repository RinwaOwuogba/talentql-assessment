import { PaymentField } from '../../types/utils';
import { BaseError } from './BaseError';

export class PaymentValidatorError extends BaseError {
  constructor(
    public readonly paymentField: PaymentField,
    public readonly message: string
  ) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PaymentValidatorError.prototype);

    Error.captureStackTrace(this);
  }
}
