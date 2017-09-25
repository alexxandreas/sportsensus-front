(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('HeaderNewSrv', HeaderNewSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['HeaderNewSrv', function(HeaderNewSrv) {

    }]);

    // angula
    // r.module('SportsensusApp').run(HeaderNewSrv.init);

    HeaderNewSrv.$inject = [
        '$rootScope'
    ];

   
    function HeaderNewSrv(
        $rootScope
    ) {
        
        var options = {
            headersVisible: true,
            // минимальная ширина окна, при которой можно снова показать заголовки
            minWindowWidthForHeaders: 0 //1000*1000;
        }

        var me = {
            options: options
        };

        return me;
    }
}());