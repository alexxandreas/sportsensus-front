(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('leftMenuDir', leftMenuDir);

    leftMenuDir.$inject = [
        '$rootScope',
        'ApiSrv'
    ];

    function leftMenuDir(
        $rootScope,
        ApiSrv
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/leftMenu/leftMenu.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                '$interval',
                '$anchorScroll',
                'ApiSrv',
                'ParamsSrv',
                'UserSrv',
                'TimeSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    $interval,
                    $anchorScroll,
                    ApiSrv,
                    ParamsSrv,
                    UserSrv,
                    TimeSrv
                ) {
                    
                    ParamsSrv.getRadars().then(function(radars){
                        $scope.radars = radars;
                    });
                    
                    
                    
                    //             $scope.loggedIn = false;
                    //             //$scope.isAdmin = false;
                    //             $scope.showAdmin = false;
                                
                    //             function checkHasAccess(type) {
                    //                 return function(){
                    //                     return UserSrv.hasAccess(type);
            					   // }
                    //             }
                                
                    //             function isLoggedIn(){return $scope.loggedIn};
                    //             function isNotLoggedIn(){return !$scope.loggedIn};
                                
                                
                    //             ParamsSrv.getRadars().then(function(radars){
                    //                 $scope.radars = radars;
                    //             })
                                
                    //             $scope.selectRadar = function(radarId){
                    //                 ParamsSrv.selectRadar(radarId);
                    //             }
                    
                    
                }]
        };
    }
}());
