(function () {

    "use strict";
    var cases = [2, 0, 1, 1, 1, 2];  
    
    /** 
     * Использование:
     * PluralSrv(['1 штука','2 штуки','5 штук'], число); 
     * 
     * PluralSrv(['Яблоко','Яблока','Яблок'], 0); // Яблок
     * PluralSrv(['Яблоко','Яблока','Яблок'], 1); // Яблоко
     * PluralSrv(['Яблоко','Яблока','Яблок'], 2); // Яблока
     */
    angular.module('SportsensusApp').factory('PluralSrv', function(){
        return function (titles, number) {  
            return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ];  
        }
    });
}());