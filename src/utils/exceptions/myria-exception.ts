import { HttpException } from '@nestjs/common';
import { MYRIA_ERROR } from '../status-code/const';

export class MyriaException extends HttpException {
    constructor(error: MYRIA_ERROR, ...args: string[] | number[]) {
        let message = error.message;
        if (args && args.length > 0) {
            for (let i = 1; i <= args.length; i++) {
                const token = String(args[i - 1]);
                const regex = new RegExp('(\\{' + i + '\\})', 'g');
                message = message.replace(regex, token);
            }
        }

        super(
            HttpException.createBody(
                {
                    errorCode: error.code,
                    message: message,
                },
                message,
                error.status,
            ),
            error.status,
        );
    }
}
