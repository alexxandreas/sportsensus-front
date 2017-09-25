(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('headerNewDir', headerNewDir);

    headerNewDir.$inject = [
        '$rootScope',
        '$window',
        '$interval',
        'ApiSrv',
        'RouteSrv'
    ];

    function headerNewDir(
        $rootScope,
        $window,
        $interval,
        ApiSrv,
        RouteSrv
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/headerNew/headerNew.html',
            link: function ($scope, $el, attrs) {
                // $scope.delimeter = $el[0].querySelector('.header-delimeter');
    
                // function onResize() {
                //     $scope.$apply($scope.updateHeadersVisibility);
                // }
                
                // $el.ready($scope.updateHeadersVisibility);
                // $interval($scope.updateHeadersVisibility, 1000);
                
                // function cleanUp() {
                //     angular.element($window).off('resize', onResize);
                // }
    
                // angular.element($window).on('resize', onResize);
                // $scope.$on('$destroy', cleanUp);
            },

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
                'HeaderNewSrv',
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
                    HeaderNewSrv,
                    TimeSrv
                ) {
                    $scope.loggedIn = false;
                    //$scope.isAdmin = false;
                    $scope.showAdmin = false;
                    
                    function checkHasAccess(type) {
                        return function(){
                            return UserSrv.hasAccess(type);
					    }
                    }
                    
                    function isLoggedIn(){return $scope.loggedIn};
                    function isNotLoggedIn(){return !$scope.loggedIn};
                    
                    
                    ParamsSrv.getRadars().then(function(radars){
                        $scope.radars = radars;
                    })
                    
                    $scope.selectRadar = function(radarId){
                        ParamsSrv.selectRadar(radarId);
                    }
                    
                    
                    
                    $scope.menu = [/*{
                            'name': 'О проекте',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.scrollTo('about');}
                        },*/ {
                            'name': 'Зарегистрироваться',
                            visible: isNotLoggedIn,
                            // selected: function(){},
                            onClick: function(){$scope.scrollTo('registration');}
                        },  {
                            'name': 'Войти',
                            visible: isNotLoggedIn,
                            // onClick: function(){$scope.setPath('/login/');}
                            onClick: function(){RouteSrv.navigate('login');}
                        },  /*{
                            'name': 'Техническая поддержка',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },*/
                        {
                            'name': 'Получить информацию',
                            iconClass: 'header-infoblock-icon',
                            visible: isLoggedIn,
                            selected: function(){
                                return $scope.currentRoute.key.startsWith('infobox');
                            },
                            // onClick: function(){$scope.setPath('/infobox/');}
                            onClick: function(){RouteSrv.navigate('infobox');}
                        },{
                            'name': 'Проанализировать',
                            // visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            iconClass: 'header-analitycs-icon',
                            visible: isLoggedIn,
                            selected: function(){
                                return $scope.currentRoute.key.startsWith('analytics');
                            },
                            // onClick: function(){$scope.setPath('/analytics/');}
                            onClick: function(){RouteSrv.navigate('analytics');}
                        },{
                            'name': 'Спланировать',
                            // visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                            iconClass: 'header-scheduler-icon',
                            visible: isLoggedIn
                            // visible: checkHasAccess('scheduler'),
                        },/*{
                            'name': 'Оценить',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                        },*/{
                            'name': 'Кейсы',
                            // visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            iconClass: 'header-cases-icon',
                            visible: isLoggedIn,
                            selected: function(){
                                return $scope.currentRoute.key.startsWith('cases');
                            },
                            // onClick: function(){$scope.setPath('/articles/');}
                            onClick: function(){RouteSrv.navigate('cases');}
                        },
                        
                        // {
                        //     'name': 'Личный кабинет',
                        //     visible: isLoggedIn,
                        //     iconClass: 'header-account-icon',
                        //     onClick: function(){$scope.setPath('/account/');}
                        // },
            
                        
                        {
                            'name': 'Панель администрирования',
                            visible: function(){return $scope.showAdmin;},
                            selected: function(){
                                return $scope.currentRoute.key.startsWith('admin');
                            },
                            // onClick: function(){$scope.setPath('/admin/');}
                            onClick: function(){RouteSrv.navigate('admin');}
                        }
                    ];
                    
                    $scope.menuUserItem = {
                        'name': 'Личный кабинет',
                            visible: isLoggedIn,
                            iconClass: 'header-account-icon',
                            // onClick: function(){$scope.setPath('/account/');}
                            onClick: function(){RouteSrv.navigate('account');}
                    };

                    $scope.$on('UserSrv.login', updateUser);
                    $scope.$on('UserSrv.logout', updateUser);
                    updateUser();
                    
                    function updateUser(){

                        var user = UserSrv.getUser();
                        $scope.loggedIn = !!(user && user.sid);
                        $scope.showAdmin = UserSrv.hasAccess('admin') || UserSrv.hasAccess('data_update') || UserSrv.hasAccess('homepage_update')

                    }
                    
                    $scope.currentRoute = RouteSrv.getCurrentRoute();
                    $scope.$on('RouteSrv.locationChangeSuccess', function(event, currentRoute){
                      $scope.currentRoute = currentRoute; 
                    });
                    

                    var updateTimeoutInterval = $interval(updateTimeout, 5000);
                    updateTimeout();
                    
                    function updateTimeout(){
                        var tariff = UserSrv.getTariff();
                        if (!tariff.realRemainingTime || tariff.realRemainingTime <= 0){
                            $scope.timeoutStr = null;
                            return;
                        }
                        $scope.timeoutStr = TimeSrv.prepareSessionTimeout(tariff.realRemainingTime);
                    }

                    
                    // $scope.headerOptions = HeaderNewSrv.options;
                    // $scope.updateHeadersVisibility = function() {
                    //     var delimeterWidth = $scope.delimeter.clientWidth;
                    //     if (delimeterWidth < 10) {
                    //         $scope.headerOptions.headersVisible = false;
                    //     } else {
                    //         $scope.headerOptions.headersVisible = true;
                    //     }
                    // }
                    
                    
                
                    $scope.logout = function(){
                        UserSrv.logout().finally(function(){
                            // $scope.setPath('/');
                            RouteSrv.navigate('root');
                        });
                        
                    };

                    $scope.scrollTo = function(id) {
                        var old = $location.hash();
                        $location.hash(id);
                        $anchorScroll();
                        //reset to old to keep any additional routing logic from kicking in
                        $location.hash(old);
                    }
                    
                    $scope.goHome = function(){
                        //$location.hash(id);
                        // $scope.setPath('/');
                        RouteSrv.navigate('root');
                    }
                    
                    $scope.$on("$destroy", function() {
                        if (updateTimeoutInterval) {
                            $interval.cancel(updateTimeoutInterval);
                        }
                    });
                }]
        };
    }
}());
