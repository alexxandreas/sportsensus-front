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
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    ApiSrv
                ){
                    $scope.vm={
                        login: null,
                        password: null,
                        error: null
                    };

                    $scope.login = function() {
                        $scope.vm.dataLoading = true;
                        $scope.vm.error = null;
                        ApiSrv.auth($scope.vm).then(function(){
                            $location.path('/infobox/');
                            $scope.vm.dataLoading = false;
                        }, function(){
                            $scope.vm.dataLoading = false;
                            $scope.vm.error = 'Неправильный логин или пароль';
                        });
                    };
                }]
        };
    }
}());