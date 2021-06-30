import { describe, expect, test } from '@jest/globals';
import { PaymentValidator } from '../../../src/services/paymentValidator';
import { PaymentField } from '../../../src/types/utils';

describe('Payment validator class', () => {
  describe('expiration date validation', () => {
    test('should return invalid date format error', () => {
      const expirationDate = '0203';
      const paymentValidator = new PaymentValidator(
        '',
        expirationDate,
        '',
        '',
        ''
      );

      const result = paymentValidator.validateExpirationDate();

      expect(result.valid).toBe(false);
      expect(result.error?.paymentField).toBe(PaymentField.expirationDate);
      expect(result.error?.message).toBe(
        `invalid date format - string should have format 'month/year'`
      );
    });

    test('should return expired card error', () => {
      const expirationDate = '03/21';

      const paymentValidator = new PaymentValidator(
        '',
        expirationDate,
        '',
        '',
        ''
      );

      const result = paymentValidator.validateExpirationDate();

      expect(result.valid).toBe(false);
      expect(result.error?.paymentField).toBe(PaymentField.expirationDate);
      expect(result.error?.message).toBe(`credit card expired`);
    });

    test('should validate date successfully', () => {
      const expirationDate = `${new Date().getMonth() + 1}/21`;
      const paymentValidator = new PaymentValidator(
        '',
        expirationDate,
        '',
        '',
        ''
      );

      const result = paymentValidator.validateExpirationDate();

      expect(result.valid).toBe(true);
    });
  });

  describe('cvv2 validation', () => {
    test('should return invalid length error', () => {
      const cvv2 = '02030';
      const paymentValidator = new PaymentValidator('', '', cvv2, '', '');

      const result = paymentValidator.validateCvv2();

      expect(result.valid).toBe(false);
      expect(result.error?.paymentField).toBe(PaymentField.cvv2);
      expect(result.error?.message).toBe(`invalid length`);
    });

    test('should return invalid characters error', () => {
      const cvv2 = '0f30';
      const paymentValidator = new PaymentValidator('', '', cvv2, '', '');

      const result = paymentValidator.validateCvv2();

      expect(result.valid).toBe(false);
      expect(result.error?.paymentField).toBe(PaymentField.cvv2);
      expect(result.error?.message).toBe(`invalid characters`);
    });

    test('should validate cvv2 successfully', () => {
      const cvv2 = '0200';
      const paymentValidator = new PaymentValidator('', '', cvv2, '', '');

      const result = paymentValidator.validateCvv2();

      expect(result.valid).toBe(true);
    });
  });

  describe('email validation', () => {
    test('should return invalid email error', () => {
      let email = 'something@som';
      let paymentValidator = new PaymentValidator('', '', '', email, '');

      let result = paymentValidator.validateEmail();

      expect(result.valid).toBe(false);
      expect(result.error?.paymentField).toBe(PaymentField.email);
      expect(result.error?.message).toBe(`invalid email structure`);

      email = '@som';
      paymentValidator = new PaymentValidator('', '', '', email, '');

      result = paymentValidator.validateEmail();

      expect(result.valid).toBe(false);
      expect(result.error?.paymentField).toBe(PaymentField.email);
      expect(result.error?.message).toBe(`invalid email structure`);
    });

    test('should validate email', () => {
      const email = 'something@som.co';
      const paymentValidator = new PaymentValidator('', '', '', email, '');

      const result = paymentValidator.validateEmail();

      expect(result.valid).toBe(true);
    });
  });
});
