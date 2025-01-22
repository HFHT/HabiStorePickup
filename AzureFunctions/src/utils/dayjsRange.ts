import type { Dayjs, ManipulateType } from 'dayjs';

/**
 * Create a range of Day.js dates between a start and end date.
 *
 * ```js
 * dayjsRange(dayjs('2021-04-03'), dayjs('2021-04-05'), 'day');
 * // => [dayjs('2021-04-03'), dayjs('2021-04-04'), dayjs('2021-04-05')]
 * ```
 */
export function dayjsRange(start: Dayjs, end: Dayjs, unit: ManipulateType, obj = null) {
    const range = [];
    let current = start;
    while (!current.isAfter(end)) {
        range.push({ date: current.format('YYYY-MM-DD'), dow: current.day(), totalPickups: 0, stops: 0, blocks: 0, full: false });
        current = current.add(1, unit);
    }
    return range
}