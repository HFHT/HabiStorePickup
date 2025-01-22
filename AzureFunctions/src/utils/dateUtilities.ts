
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
export const theDate = (dateString?: string | undefined) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    const t = dayjs.tz(dateString, 'America/Toronto')
    return t.format('YYYY-MM-DD')
}
export const theTime = (dateString?: string | undefined) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    const t = dayjs.tz(dateString, 'America/Toronto')
    return t.format('h:mm A')
}
// export const theDate = () => {return '2025-01-05'}
// export const theTime = () => {return '09:42 AM'}