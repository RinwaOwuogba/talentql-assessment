import { body, header } from 'express-validator';
import { ContentType } from '../../types/utils';
import validate from '../../utils/validate';

const fields = [
  'creditCardNumber',
  'expirationDate',
  'cvv2',
  'email',
  'phoneNumber',
];

export const defaultSanitizer = validate([
  header('content-type').custom((value: ContentType, { req }) => {
    const contentType: ContentType = req.headers?.['content-type'];

    if (
      contentType &&
      ![ContentType.xml, ContentType.json].includes(contentType)
    )
      throw new Error('Invalid content-type');

    if (contentType === ContentType.xml && !req.body.root)
      throw new Error('Invalid XML payload');

    return true;
  }),
  body().customSanitizer((_: any, { req }) => {
    const contentType: ContentType = req.headers?.['content-type'];

    // perform no manipulations on request containing
    // payload or requests containing no content-type
    // header
    if (!contentType || contentType === ContentType.json) return req.body;

    // return content of root xml element
    return req.body.root;
  }),
]);

export const defaultValidator = validate([
  body(fields).isString().withMessage('field must contain a string'),
]);
