Date.prototype.isSameDay = function (other) {
    return this.getDate() === other.getDate() &&
        this.getMonth() === other.getMonth() &&
        this.getFullYear() == other.getFullYear()
}
Date.prototype.isSameDayDBString = function(otherString) {
    const [year, month, day, hour, min, sec] = otherString.replace('T', ':').split(/-|:/).map(Number)
    return this.isSameDay(new Date(year, month - 1, day, hour, min, sec))
}
Date.prototype.getDBString = function () {
    const month = (this.getMonth() + 1).toString().padStart(2, '0')
    const day = (this.getDate()).toString().padStart(2, '0')
    const hour = (this.getHours()).toString().padStart(2, '0')
    const min = (this.getMinutes()).toString().padStart(2, '0')
    const sec = (this.getSeconds()).toString().padStart(2, '0')
    return `${this.getFullYear()}-${month}-${day}T${hour}:${min}:${sec}`
}
Date.prototype.getDateStringWithWeekDay = function() {
    return `${this.getWeekDay()}, ${this.toLocaleDateString()}`
}
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.getWeekDay = function() {
    return this.toLocaleString((Intl.DateTimeFormat()).resolvedOptions().locale, {weekday: 'long'})
}