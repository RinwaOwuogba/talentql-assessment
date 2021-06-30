import { IPaymentValidationResult } from '../types/services';
import { PaymentField } from '../types/utils';
import { PaymentValidatorError } from '../utils/errors/PaymentValidatorError';

export class PaymentValidator {
  constructor(
    public readonly creditCardNumber: string,
    public readonly expirationDate: string,
    public readonly cvv2: string,
    public readonly email: string,
    public readonly phoneNumber: string
  ) {}

  /**
   * Validates the credit card number using Luhn's
   * algorithm: https://en.wikipedia.org/wiki/Luhn_algorithm
   */
  validateCreditCardNumber = (): IPaymentValidationResult => {
    let error: PaymentValidatorError;

    if (this.creditCardNumber.length < 13) {
      error = new PaymentValidatorError(
        PaymentField.creditCardNumber,
        'number too short'
      );

      return {
        valid: false,
        error,
      };
    }

    let counter = this.creditCardNumber.length - 1;

    const excludedDigits: number[] = [];
    const selectedDigitsDoubled: number[] = [];

    excludedDigits.push(Number(this.creditCardNumber[counter]));
    selectedDigitsDoubled.push(Number(this.creditCardNumber[counter - 1]) * 2);

    counter -= 1;

    while (counter >= 0) {
      excludedDigits.push(Number(this.creditCardNumber[counter]));
      selectedDigitsDoubled.push(
        Number(this.creditCardNumber[counter - 1]) * 2
      );

      counter -= 2;
    }

    const sumOfExcludedDigits = excludedDigits.reduce(
      (acc, digit) => acc + digit,
      0
    );
    const sumOfSelectedDigitsDoubled = selectedDigitsDoubled.reduce(
      (acc, digit) => {
        const [firstDigit, secondDigit] = String(digit).split('');

        return acc + Number(firstDigit) + Number(secondDigit);
      },
      0
    );

    const total = sumOfExcludedDigits + sumOfSelectedDigitsDoubled;

    if (total % 10 !== 0) {
      error = new PaymentValidatorError(
        PaymentField.creditCardNumber,
        'number is invalid'
      );

      return {
        valid: false,
        error,
      };
    }

    return {
      valid: false,
    };
  };

  /**
   * Validates expiration date on credit card
   * @returns
   */
  validateExpirationDate = (): IPaymentValidationResult => {
    /**
     * check that date format is correct
     * check that date is in the future
     */

    let error: PaymentValidatorError;

    if (!this.expirationDate.includes('/')) {
      error = new PaymentValidatorError(
        PaymentField.expirationDate,
        `invalid date format - string should have format 'month/year'`
      );

      return {
        valid: false,
        error,
      };
    }

    const [month, year] = this.expirationDate
      .split('/')
      .map((item) => Number(item));
    const parsedDate = new Date(Number(`20${year}`), month);

    if (parsedDate < new Date()) {
      error = new PaymentValidatorError(
        PaymentField.expirationDate,
        'credit card expired'
      );

      return {
        valid: false,
        error,
      };
    }

    return { valid: true };
  };

  /**
   * Validates cvv2 number on credit card
   * @returns
   */
  validateCvv2 = (): IPaymentValidationResult => {
    /**
     * check that length is within 3 - 4
     * check that char is a valid digit
     */

    let error;

    if (![3, 4].includes(this.cvv2.length)) {
      error = new PaymentValidatorError(PaymentField.cvv2, 'invalid length');

      return {
        valid: false,
        error,
      };
    }

    if (/^\d+$/.test(this.cvv2)) return { valid: true };

    error = new PaymentValidatorError(PaymentField.cvv2, 'invalid characters');

    return {
      valid: false,
      error,
    };
  };

  /**
   * Validates the structure of the instance's email
   * @returns
   */
  validateEmail = (): IPaymentValidationResult => {
    const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email);

    if (emailValid)
      return {
        valid: true,
      };

    return {
      valid: false,
      error: new PaymentValidatorError(
        PaymentField.email,
        'invalid email structure'
      ),
    };
  };

  /**
   * Runs all validations
   * @returns
   */
  runAllValidations(): IPaymentValidationResult[] {
    const validations = [
      this.validateCreditCardNumber,
      this.validateCvv2,
      this.validateEmail,
      this.validateExpirationDate,
    ];

    return validations.map((validation) => validation());
  }
}
