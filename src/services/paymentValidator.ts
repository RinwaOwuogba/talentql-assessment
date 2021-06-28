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
  validateCreditCardNumber(): boolean | PaymentValidatorError {
    /**
     * check minimumm number of digits
     * select every other digit from right to left
     * select every omitted digit
     * double every other digit
     * sum the result of the adding every digit together
     * sum the result of adding every omitted digit
     * add both sums
     * find the modulo
     */

    if (this.creditCardNumber.length < 13)
      throw new PaymentValidatorError(
        PaymentField.creditCardNumber,
        'number too short'
      );

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

    if (total % 10 !== 0)
      return new PaymentValidatorError(
        PaymentField.creditCardNumber,
        'number is invalid'
      );

    return true;
  }
}
