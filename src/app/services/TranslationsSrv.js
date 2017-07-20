(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('TranslationsSrv', TranslationsSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['TranslationsSrv', function(TranslationsSrv) { }]);

    TranslationsSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv',
        'UserSrv'
    ];


    function TranslationsSrv(
        $rootScope,
        $q,
        ApiSrv,
        UserSrv
    ) {
        
        var getTranslations = UserSrv.loadWhenAuth(function(resolve, reject){
            ApiSrv.getTranslations().then(resolve, reject);
        });
        

        var me = {
            getTranslations: getTranslations
        };

        return me;
    }
}());