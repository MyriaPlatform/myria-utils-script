import { HttpStatus } from '@nestjs/common';

export class MyriaErrorException {
    public constructor(
        public readonly code: number,
        public readonly message: string,
        public readonly status: HttpStatus,
    ) {}
}
