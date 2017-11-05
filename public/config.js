var CKEDITOR_BASEPATH = '/static/ckeditor/';
var appConfig = {

    // apiUrl: 'http://sportsensus.ru:8080/api',
    apiUrl: 'http://sportsensus.ru/api',
    imageUploadUrl: 'http://sportsensus.ru/api/ckupload',
    //proxyURL: 'https://cors-anywhere.herokuapp.com/',
    
    colors: {
        sport: {
            'football': '#fc4a1a',
            'hockey': '#4b78bf',
            'basketball': '#ff9750',
            'car': '#af9d94',
            'figskating': '#86cfe2',
            'biathlon': '#ffc85a',
            'boxing': '#8f6ec4',
            'tennis': '#a6dd83',
            'волейбол': '#5cad7d',
            'киберспорт': '#d156c2'
        },
        fan_type: {
            1: '#fed3c8', // Монолайнеры
            2: '#fd9276', // Традиционалисты
            3: '#fc4a1a', // Спокойные
            4: '#d6371d', // Горячие
            5: '#bc1d0d' // Одержимые
        },
        tvhome: {
            1: '#ec9d1e', // Эфирное
            2: '#f5b031', // Кабельное
            3: '#ffd37e', // Спутниковое
            4: '#fae5a4', // Другое
        },
        electronics_exist: {
            1: '#76a94c', // Смартфон
            2: '#8cc365', // Планшет
            3: '#b2dc9a', // Ноутбук
            4: '#e0fbce', // ПК
        }
    }
    
}; 