import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class JogadoresValidacaoParametrosPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(`value: ${value} metadata: ${metadata.type}`);
    return value;
  }
}
