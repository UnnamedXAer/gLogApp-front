
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

/** getReducedArray - get array with removed elements of second array
 * array: []
 * toRemve: []
 * return: []
 */
export function getReducedArray(array, toRemve) {
    let reduced = [...array];
    for (let i = reduced.length - 1; i >= 0; i--) {
        for (let j = 0; j < toRemve.length; j++) {
            if (reduced[i] && (reduced[i].id === toRemve[j].id)) {
                reduced.splice(i, 1);
            }
        }
    }
    return reduced;
}

/** positionInArray - get indefx of element in array by specific property name
 * arr: [],
 * prop: number | string
 * name: string
 * return: position: number
 *  */ 
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


export function compareByNameProperty(a, b) {
    const valA = a.name.toLowerCase();
    const valB = b.name.toLowerCase();
    if (valA < valB)
      return -1;
    if (valA > valB)
      return 1;
    return 0;
 }


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
    else if (date.indexOf('T') === -1) {
        throw Error('Not implemented: date conversion for input type date.');
    }
    else {
        return date;
    }
}