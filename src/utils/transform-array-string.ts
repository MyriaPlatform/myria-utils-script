import { TransformFnParams } from 'class-transformer';
import SqlString from 'sqlstring';

export const transformArrayString = (
    parameters: TransformFnParams,
    arrayData?: Array<any>,
): Array<any> => {
    if (Array.isArray(parameters.value)) {
        return parameters.value.filter((parameter: string) => {
            if (parameter.length === 0) {
                return;
            }
            if (arrayData && arrayData.indexOf(parameter) > -1) {
                return SqlString.escape(parameter.trim());
            }
            return SqlString.escape(parameter.trim());
        });
    }
    return parameters.value.split(',').filter((parameter: string) => {
        if (parameter.length === 0) {
            return;
        }
        if (arrayData && arrayData.indexOf(parameter) > -1) {
            return SqlString.escape(parameter.trim());
        }
        return SqlString.escape(parameter.trim());
    });
};
