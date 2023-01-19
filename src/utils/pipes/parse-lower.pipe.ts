import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseLowerPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        return value.toLocaleLowerCase();
    }
}
