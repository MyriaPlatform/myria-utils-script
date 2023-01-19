function stripHexPrefix(input: string): string {
    if (input.startsWith('0x')) {
        return input.slice(2);
    }
    return input;
}
function compareHexString(addressOne: string, addressTwo: string): boolean {
    return !!(
        addressOne &&
        addressTwo &&
        stripHexPrefix(addressOne).toLowerCase() ==
            stripHexPrefix(addressTwo).toLowerCase()
    );
}
export { stripHexPrefix, compareHexString };
