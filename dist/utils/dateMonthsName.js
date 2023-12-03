"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthName = exports.getDayName = void 0;
function getDayName(dayOfWeek) {
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    return days[dayOfWeek - 1];
}
exports.getDayName = getDayName;
function getMonthName(monthIndex) {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const adjustedIndex = monthIndex - 1;
    return months[adjustedIndex];
}
exports.getMonthName = getMonthName;
//# sourceMappingURL=dateMonthsName.js.map