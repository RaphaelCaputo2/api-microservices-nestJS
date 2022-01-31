import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export class ValidarIdMongoose implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value))
      throw new BadRequestException(
        `O valor do parametro ID: ${value} deve ser um id válido`,
      );
    return value;
  }
}
