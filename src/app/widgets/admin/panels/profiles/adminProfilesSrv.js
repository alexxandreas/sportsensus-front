(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('AdminProfilesSrv', AdminProfilesSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['AdminProfilesSrv', function(AdminProfilesSrv) {
    // }]);

    // angula
    // r.module('SportsensusApp').run(AdminProfilesSrv.init);

    AdminProfilesSrv.$inject = [
        '$rootScope',
        '$q',
        'ApiSrv'
    ];


    function AdminProfilesSrv(
        $rootScope,
        $q,
        ApiSrv
    ) {
        
        var profile = [];
        //var allTags = [];
        
        var tags = {
            // ungrouped: []
        };
        
        var profilesLoaded = false;
        var profilesDefer = $q.defer();

        
        function getProfiles(){
            if (!profilesLoaded){
                profilesLoaded = true;
                //var allTags = [];
                
                ApiSrv.getUserAuthPromise().then(function(){
                    ApiSrv.getProfilesList().then(function(profiles){
                        //angular.forEach(articles, loadArticleTags);
                        
                        profilesDefer.resolve(profiles);
                    }, function(){
                        profilesDefer.reject();
                    }); 
                });
                
            }
            
            return profilesDefer.promise;
        }
       
        var me = {
            getProfiles: getProfiles
        };




        return me;
    }
}());