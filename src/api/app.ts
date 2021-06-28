import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xmlparser from 'express-xml-bodyparser';
import { defaultErrorHandler } from './middlewares/errorHandler';
import { PaymentValidator } from '../services/paymentValidator';
import { defaultSanitizer, defaultValidator } from './middlewares/validator';
import { PaymentValidatorError } from '../utils';
import { extractPaymentValidationErrors } from '../utils/extractPaymentValidationErrors';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  xmlparser({
    normalizeTags: false,
    explicitArray: false,
  })
);

const API_VERSION = '/api/v1';

const router = express.Router();

router.post('/', defaultSanitizer, defaultValidator, async (req, res, next) => {
  try {
    const { creditCardNumber, expirationDate, cvv2, email, phoneNumber } =
      req.body;

    const paymentValidator = new PaymentValidator(
      creditCardNumber,
      expirationDate,
      cvv2,
      email,
      phoneNumber
    );

    const result = paymentValidator.validateCreditCardNumber();

    if (result instanceof PaymentValidatorError)
      return res.status(400).json(extractPaymentValidationErrors(result));

    return res.json({
      valid: true,
    });
  } catch (error) {
    return next(error);
  }
});

app.use(API_VERSION, router);

app.use(defaultErrorHandler);

export default app;
