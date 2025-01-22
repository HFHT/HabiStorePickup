import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
export const theDate = (dateString?: string | undefined) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    const t = dayjs.tz(dateString, 'America/Toronto')
    return t.format('YYYY-MM-DD')
}

// export const daysInMonth = (dateString?: string | undefined) => {
//     console.log(dayjs().month(2).daysInMonth())
//     console.log(dayjs().month(2).startOf('month').toDate())
//     return { daysInMonth: dayjs(dateString).daysInMonth(), month: dayjs(dateString).month() }
// }

// export const threeMonthCalendar = (dateString?: string | undefined) => {
//     let startMonth = dayjs(dateString).month()
//     let daysInMonth = dayjs(dateString).daysInMonth()
//     let startDate = dayjs().month(startMonth).startOf('month').toDate()
//     let calendarDates: string[] = []
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < daysInMonth; j++) {
//             calendarDates = [...calendarDates, dayjs(startDate).add(j, 'days').format('YYYY-MM-DD')]
//         }
//         startMonth++
//         startDate = dayjs().month(startMonth).startOf('month').toDate()
//         daysInMonth = dayjs(startDate).daysInMonth()
//     }
//     return calendarDates
// }