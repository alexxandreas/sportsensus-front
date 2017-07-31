(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('StaticSrv', StaticSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['StaticSrv', function(StaticSrv) { }]);

    StaticSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv',
        'UserSrv'
    ];


    function StaticSrv(
        $rootScope,
        $q,
        ApiSrv,
        UserSrv
    ) {
        
        
        // var staticDefers = {};
        // var staticLoaded = {};// загружались ли когда-нибудь перечисления
        
        var staticLoaders = {};
        
        function getStatic(type){

            if (!staticLoaders[type])
                staticLoaders[type] = UserSrv.loadWhenAuth(function(resolve, reject){
                    ApiSrv.getStatic(type).then(resolve, reject);
                    //getCachedCount().then(function(result){
                    //resolve(result.audience_count)
                });
            return staticLoaders[type]();
            
            // if (!staticDefers[type]){
            //     staticDefers[type] = $q.defer();
            // }
            // if (!staticLoaded[type] && sid)
            //     loadStatic(type);

            // return staticDefers[type].promise;

            // function loadStatic(){
            //     request('get_static', {type:type}, 'data.result.data').then(function(data){
            //         staticDefers[type].resolve(data);
            //     }, function(){
            //         staticDefers[type].reject();
            //     });
            // }
        }
        
        
        
        var me = {
            getStatic: getStatic
        };

        return me;
    }
}());