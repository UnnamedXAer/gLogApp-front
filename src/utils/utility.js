/**
 *
 *
 * @export
 * @class Timeout
 */
export class Timeout {
    constructor(fn, interval) {
        var id = setTimeout(fn, interval);
        this.cleared = false;
        this.clear = () => {
            this.cleared = true;
            clearTimeout(id);
        };
    }
}

/**
 * Get array with removed elements of second array.
 * @export
 * @param {[]} array
 * @param {[]} toRemove
 * @returns []
 */
export function getReducedArray(array, toRemove) {
    let reduced = [...array];
    for (let i = reduced.length - 1; i >= 0; i--) {
        for (let j = 0; j < toRemove.length; j++) {
            if (reduced[i] && (reduced[i].id === toRemove[j].id)) {
                reduced.splice(i, 1);
            }
        }
    }
    return reduced;
}

/**
 * get index of element in array by specific property name
 *
 * @export
 * @param {[]} arr []
 * @param {string} prop
 * @param {string} name
 * @returns number
 */
export function positionInArray (arr, prop, name) {
    
    if (arr.length > 0) {
        if (typeof arr[0] === 'object') {
            const index = name ? name : 'id';
            return arr.map(x => x[index]).indexOf(prop);
        }
        else {
            return arr.indexOf(prop);
        }
    }
    return -1;
}

/**
 * Compare to objects by "name" property/
 */
export function compareByNameProperty(a, b) {
    const valA = a.name.toLowerCase();
    const valB = b.name.toLowerCase();
    if (valA < valB)
      return -1;
    if (valA > valB)
      return 1;
    return 0;
 }

/**
 * Convert date object to input[type="date"] format string.
 */
export function convertToInputDateFormat(date) {
    if (typeof date === "object") {  //eg. new Date()
        let month = date.getMonth()+1;
        if (month < 10) month = "0"+month;
        let day = date.getDate();
        if (day < 10) day = "0"+day;
        const year = date.getFullYear();
        let hour = date.getHours();
        if (hour < 10) hour = "0"+hour;
        let minutes = date.getMinutes();
        if (minutes < 10) minutes = "0"+minutes;

        return year +'-'+ month +'-'+ day +'T'+ hour +':'+ minutes;
        // return month +'-'+ day +'-'+ year +'T'+ hour +':'+ minutes;
        // return month +'/'+ day +'/'+ year +'T'+ hour +':'+ minutes;
    }
    else if (date !== "" && date.indexOf('T') > -1) {
        // console.log(date.substr(0, 16))
        return date.substr(0, 23)//date.substr(0, 16);
    }
    else {
        throw Error('Date format not recognized.');
        // return date;
    }
}

/**
 * Check if given string is correct date.
 */
export function isCorrectDate(date) {
    const d = new Date (date);
    let month = d.getMonth()+1;
    if (month < 10) month = "0"+month;    
    let day = d.getDate();
    if (day < 10) day = "0"+day;    
    let parsedDate = d.getFullYear()+'-'+month+'-'+day;
    if (date.length > 10) {
        let hh = d.getHours();
        if (hh < 10) hh = "0"+hh;
        let mm = d.getMinutes();
        if (mm < 10) mm = "0"+mm;
        parsedDate += 'T'+hh+":"+mm;
    }
    return date === parsedDate;
}

/**
 * Check if date is between yesterday nad 100 years ago.
 */
export function isDob(date) {
    const dob = Date.parse(date);
    const today = Date.now();
    let yesterday = new Date( today - 24*60*60*1000 );
    yesterday.setFullYear(yesterday.getFullYear() - 100); // 100 years in past
    return dob <= today && dob > yesterday;
}
/**
 * Remove leading and trailing spaces.
 * 
 * @param {String} txt
 * @returns {String}
 */
export function trim(txt) {
    return txt.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}
/**
 * Function format given date to local format.
 *
 * @param {Date | String} date : Date as object string.
 * @returns {String} : String with formatted date.
 */
export function formatDateToDisplay(date) {
    // let txt = date.getDate() + date.toLocaleString('en-us', { month: 'long' }) + date.getFullYear()
    const _date = date instanceof Date ? date : new Date(date);
    return _date.toLocaleString(['en-US', 'pl-PL'], {
        month: 'long',
        day: '2-digit',
        year: "numeric",
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
    });
}