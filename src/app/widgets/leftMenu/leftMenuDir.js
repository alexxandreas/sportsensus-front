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
                    
                    $scope.audienceBlocks = [{
                        name: 'block1',
                        items: [{
                            name: 'item1'
                        },{
                            name: 'item2'
                        },{
                            name: 'item3'
                        }]
                    },{
                        name: 'block2',
                        items: [{
                            name: 'item4'
                        },{
                            name: 'item5'
                        },{
                            name: 'long long long long long long long long long long long long item6'
                        },{
                            name: 'item'
                        }]
                    },{
                        name: 'block3',
                        items: [{
                            name: 'itemitemitem'
                        },{
                            name: 'item'
                        },{
                            name: 'longlonglonglonglonglonglonglongitem6'
                        },{
                            name: 'item'
                        }]
                    }];
                    
                    $scope.audienceMessage = "Кол-во болельщиков";
                    $scope.audienceCount = 984797927;
                    $scope.audienceError = false;
                    
                    
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
