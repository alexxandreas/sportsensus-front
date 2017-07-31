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
        
        var tariffs = null;
        
        var getTariffs = UserSrv.loadWhenAuth(function(resolve, reject){
            //ApiSrv.getTariffs().then(resolve, reject);
            ApiSrv.getTariffs().then(function(_tariffs){
                tariffs = _tariffs;
                resolve(_tariffs);
            }, function(data){
                tariffs = null;
                reject(data);
            });
        });
        
        
        
        function getTariff(id){
            getTariffs(); // на всякий случай загружаем тарифы, если они еще не загружены
            if (!tariffs) return null;
            return tariffs.find(function(tariff){
                return tariff.id == id;
            });
        }
        

        var me = {
            getTariffs: getTariffs,
            // Функция должна вызываться при уже загруженных тарифах. в противном случае будет возвращать null
            getTariff: getTariff
        };

        return me;
    }
}());