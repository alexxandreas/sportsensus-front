(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('TariffsSrv', TariffsSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['TariffsSrv', function(TariffsSrv) { }]);

    TariffsSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv',
        'UserSrv'
    ];


    function TariffsSrv(
        $rootScope,
        $q,
        ApiSrv,
        UserSrv
    ) {
        
        var getTariffs = UserSrv.loadWhenAuth(function(resolve, reject){
            ApiSrv.getTariffs().then(resolve, reject);
        });
        

        var me = {
            getTariffs: getTariffs
        };

        return me;
    }
}());