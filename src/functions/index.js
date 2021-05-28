export function boolToWord (b) {
    if (b === true) {
        return "Да"
    } else {
        return "Нет"
    }
}

export function timeOptions() {
    return {
        '8:00': false,
        '9:00': false,
        '10:00': false,
        '11:00': false,
        '12:00': false,
        '13:00': false,
        '14:00': false,
        '15:00': false,
        '16:00': false,
        '17:00': false,
        '18:00': false,
        '19:00': false
    }
}

export function momentToDay(mDay) {
    if (mDay === 'Monday') {
        return "Понедельник"
    }
    else if (mDay === 'Tuesday') {
        return "Вторник"
    }
    else if (mDay === 'Wednesday') {
        return "Среда"
    } 
    else if (mDay === 'Thursday') {
        return "Четверг"
    }
    else if (mDay === 'Friday') {
        return "Пятница"
    }
    else if (mDay === 'Saturday') {
        return "Суббота"
    }
    else if (mDay === 'Sunday') {
        return "Воскресенье"
    }
}

export function deleteItemFromArray(array, item) {
    let index = array.indexOf(item);
    console.log(index)
    array = array.splice(index, 1);
    return array;
}

export function today() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 

    today = yyyy+'-'+mm+'-'+dd;
    return today;
}