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
        
        function secondsToDateTime(sec){
            //var sec = parseInt(this, 10); // don't forget the second param
            var secInMin = 60;
            var secInHour = secInMin * 60;
            var secInDay = secInHour * 24;
            var secInMonth = secInDay * 31;
            var secInYear = secInDay * 365;
            
            var years = Math.floor(sec / secInYear);
            sec = sec - years * secInYear;
        
            var months = Math.floor(sec / secInMonth);
            sec = sec - months * secInMonth;
            
            
            var days = Math.floor(sec / secInDay);
            sec = sec - days * secInDay;
    
            var hours   = Math.floor(sec / secInHour);
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
        
        var me = {
            secondsToDateTime: secondsToDateTime
        };


        return me;
    }
}());