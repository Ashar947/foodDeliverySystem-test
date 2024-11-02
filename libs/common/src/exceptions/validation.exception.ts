import { BadRequestException, ValidationError } from '@nestjs/common';

export const validationExceptionFactory = (errors: ValidationError[]) => {
  console.log(errors, 'Fields Error');
  const errMsg = {};
  errors.forEach((error: ValidationError) => {
    errMsg[error.property] = Object.values(error.constraints);
  });
  return new ValidationException(errMsg);
};

// shared/exceptions/validation.exception.ts
export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, unknown>) {
    super('Fields Error');
    this.validationErrors = validationErrors;
  }
}
