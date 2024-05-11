export function secondsToHourString(seconds) {
    const hours = Math.floor(seconds / 60 / 60)
    const minutes = (Math.floor(seconds / 60) % 60).toString().padStart(2, '0')
    return `${hours}h ${minutes}m`
}

export function extractTime(dateStr) {
    return dateStr.substring(11, 16)
}
