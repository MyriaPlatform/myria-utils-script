function isDateInPast(firstDate: Date, secondDate: Date): boolean {
    if (firstDate.setHours(0, 0, 0, 0) < secondDate.setHours(0, 0, 0, 0)) {
        return true;
    }

    return false;
}

function addDays(originalDate: Date, numberOfDays: number): Date {
    originalDate.setDate(originalDate.getDate() + numberOfDays);
    return originalDate;
}

export { isDateInPast, addDays };
