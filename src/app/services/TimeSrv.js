(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('TimeSrv', TimeSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['TimeSrv', function(TimeSrv) { }]);

    TimeSrv.$inject = [
        // '$rootScope',
        // '$q',
        // 'ApiSrv',
        // 'UserSrv'
        'PluralSrv'
    ];


    function TimeSrv(
        // $rootScope,
        // $q,
        // ApiSrv,
        // UserSrv
        PluralSrv
    ) {
        var secInMin = 60;
        var secInHour = secInMin * 60;
        var secInDay = secInHour * 24;
        var secInMonth = secInDay * 31;
        var secInYear = secInDay * 365;
            
        /**
         * Возвращает текстовое представление времени в годах, месяцах, днях, часах, минутах, секундах
         * 
         */
        function secondsToDateTime(sec){
            //var sec = parseInt(this, 10); // don't forget the second param
            
            
            var years = Math.floor(sec / secInYear);
            sec = sec - years * secInYear;
        
            var months = Math.floor(sec / secInMonth);
            sec = sec - months * secInMonth;
            
            
            var days = Math.floor(sec / secInDay);
            sec = sec - days * secInDay;
    
            var hours = Math.floor(sec / secInHour);
            sec = sec - hours * secInHour;
            
            var minutes = Math.floor(sec / secInMin);
            sec = sec - minutes * secInMin;
            
            var seconds = sec;
            
            var result = [];
            if (years){
                result.push(years + PluralSrv([' год',' года',' лет'], years));
            }
            if (months){
                result.push(months + PluralSrv([' месяц',' месяца',' месяцев'], months));
            }
            if (days){
                result.push(days + PluralSrv([' день',' дня',' дней'], days));
            }
            result.push(hours + PluralSrv([' час',' часа',' часов'], hours));
            result.push(minutes + PluralSrv([' мин',' мин',' мин'], minutes));
            result.push(seconds + PluralSrv([' сек',' сек',' сек'], seconds));
            
            return result.join(' ');
        }
        
        
        /**
         * Возвращает оставшееся время сессии в часах:минутах или в другом формате
         */
        function prepareSessionTimeout(sec){
            if (sec < 60 * 60 * 24){
                var min = Math.floor(sec / secInMin);
                var hours = Math.floor(sec / secInHour);
                var result = (hours > 9 ? hours : "0" + hours) + ":" + 
                    (min > 9 ? min : "0" + min);
                
                return result;
            } else {
                var days = Math.floor(sec / secInDay);
                var result = days + PluralSrv([' день',' дня',' дней'], days)
                
                return result;
            }
        }
        
        var me = {
            secondsToDateTime: secondsToDateTime,
            prepareSessionTimeout: prepareSessionTimeout
        };


        return me;
    }
}());