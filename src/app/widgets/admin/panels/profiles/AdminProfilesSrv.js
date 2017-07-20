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
        'ApiSrv',
        'UserSrv'
    ];


    function AdminProfilesSrv(
        $rootScope,
        $q,
        ApiSrv,
        UserSrv
    ) {
        
        // var profile = [];
        //var allTags = [];
        
       
        
        
        // var profilesLoaded = false;
        // var profilesDefer = $q.defer();
        // function getProfiles(){
        //     if (!profilesLoaded){
        //         profilesLoaded = true;
        //         //var allTags = [];
                
        //         UserSrv.getUserAuthPromise().then(function(user){
        //             ApiSrv.getProfilesList().then(function(profiles){
        //                 //angular.forEach(articles, loadArticleTags);
                        
        //                 profilesDefer.resolve(profiles);
        //             }, function(){
        //                 profilesDefer.reject();
        //             }); 
        //         });
                
        //     }
            
        //     return profilesDefer.promise;
        // }
        
        
     
        var getProfiles = UserSrv.loadWhenAuth(function(resolve, reject){
            ApiSrv.getProfilesList().then(resolve, reject);
        }, true);
        
        
        function getProfile(id) {
            return getProfiles().then(function(profiles){
                var profile = profiles.find(function(profile){
                    return profile.user_id == id;
                });
                if (profile)
                    return profile;
                return $q.reject();
            })
        }
       
        var me = {
            getProfiles: getProfiles,
            getProfile: getProfile
        };




        return me;
    }
}());