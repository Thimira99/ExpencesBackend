"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthName = exports.getDayName = exports.months = void 0;
exports.months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
function getDayName(dayOfWeek) {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[dayOfWeek - 1];
}
exports.getDayName = getDayName;
function getMonthName(monthIndex) {
    const adjustedIndex = monthIndex - 1;
    return exports.months[adjustedIndex];
}
exports.getMonthName = getMonthName;
//# sourceMappingURL=dateMonthsName.js.map