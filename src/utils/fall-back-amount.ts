export const fallBackAmount = (
    amount: string,
    nonAmount: string | null,
): string => {
    return nonAmount === null || nonAmount.length === 0
        ? String(amount)
        : String(nonAmount);
};
