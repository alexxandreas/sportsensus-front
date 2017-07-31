(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('loginDir', loginDir);

    loginDir.$inject = [
        '$rootScope'
    ];

    function loginDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/login/login.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ApiSrv',
                'UserSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    ApiSrv,
                    UserSrv
                ){
                    $scope.vm={
                        login: null,
                        password: null,
                        error: null
                    };

                    $scope.login = function() {
                        $scope.vm.dataLoading = true;
                        $scope.vm.error = null;
                        UserSrv.auth($scope.vm).then(function(user){
                            $scope.vm.dataLoading = false;
                            if (!user.userRights.admin)
                                $location.path('/infobox/');
                            else 
                                $location.path('/admin/');
                            
                        }, function(){
                            $scope.vm.dataLoading = false;
                            $scope.vm.error = 'Неправильный логин или пароль';
                        });
                    };
                }]
        };
    }
}());