import { RequestHandler } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

const validate =
  (validations: ValidationChain[]): RequestHandler =>
  async (req, res, next) => {
    // run validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => err);

    return res.status(422).json({
      error: {
        message: 'Validation error',
        errors: extractedErrors,
      },
    });
  };

export default validate;
