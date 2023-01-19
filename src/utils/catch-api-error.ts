export const catchApiError = (error: any): number | null => {
    if (
        error &&
        error.response &&
        error.response.apiErrors &&
        error.response.apiErrors.errors.length > 0
    ) {
        // return first founded
        const pickFirstError = error.response.apiErrors.errors.find(
            (item) => item,
        );
        const { errorCode } = pickFirstError;

        return errorCode;
    }

    return null;
};
