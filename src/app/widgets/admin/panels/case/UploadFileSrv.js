

(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('UploadFileSrv', UploadFileSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['UploadFileSrv', function(UploadFileSrv) { }]);

    UploadFileSrv.$inject = [
        '$rootScope',
        '$http',
        '$q',
        'ApiSrv',
        'UserSrv'
    ];


    function UploadFileSrv(
        $rootScope,
        $http,
        $q,
        ApiSrv,
        UserSrv
    ) {
        
        
        function uploadFile(file, uploadUrl, paramName, filename) {
            var fd = new FormData();
            fd.append(paramName || 'file', file, filename);
            return $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            
            // .success(function(){
            // })
            // .error(function(){
            // });
        }
        
        
        var me = {
            uploadFile: uploadFile
        };

        return me;
    }
}());