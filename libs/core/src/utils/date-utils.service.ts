export class DateUtilsService {
    public isNextDay(currentDay: Date, previousDay: Date | null): boolean {
        if (previousDay == null) {
            return false;
        }

        const currentDayStart = new Date(currentDay);
        currentDayStart.setHours(0, 0, 0, 0);

        const previousDayStart = new Date(previousDay);
        previousDayStart.setHours(0, 0, 0, 0);

        return currentDayStart.getTime() - previousDayStart.getTime() === 24 * 60 * 60 * 1000;
    }
}
