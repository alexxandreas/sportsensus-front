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
            replace: true,
            scope: {
                theme: '@'
            },
            templateUrl: '/views/widgets/headerNew/headerNew.html',
            link: function ($scope, $el, attrs) {
                
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
                    
                    
                    $scope.logoItem = {
                        visible: function(){
                            return !$scope.currentRoute.key.startsWith('root');
                        }
                    };
                    
                    
                    $scope.menu = [/*{
                            'name': 'О проекте',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.scrollTo('about');}
                        },*/ {
                            'name': 'Зарегистрироваться',
                            visible: function(){
                                return isNotLoggedIn() && !$scope.currentRoute.key.startsWith('root');
                            },
                            onClick: function(){$scope.scrollTo('registration');}
                        },  {
                            'name': 'Войти',
                            visible: function(){
                                return isNotLoggedIn() && !$scope.currentRoute.key.startsWith('root');
                            },
                            onClick: function(){RouteSrv.navigate('login');}
                        }, 
                        // {
                        //     'name': 'Войти',
                        //     visible: function(){
                        //         return !isNotLoggedIn() && $scope.currentRoute.key.startsWith('root');
                        //     },
                        //     onClick: function(){RouteSrv.navigate('infobox');}
                        // }, 
                        
                        {
                            'name': 'Получить информацию',
                            iconClass: 'header-infoblock-icon',
                            visible: function(){
                                return isLoggedIn() && !$scope.currentRoute.key.startsWith('root');
                            },
                            selected: function(){
                                return $scope.currentRoute.key.startsWith('infobox');
                            },
                            onClick: function(){RouteSrv.navigate('infobox');}
                        },
                        // {
                        //     'name': 'Проанализировать',
                        //     iconClass: 'header-analitycs-icon',
                        //     visible: isLoggedIn,
                        //     selected: function(){
                        //         return $scope.currentRoute.key.startsWith('analytics');
                        //     },
                        //     onClick: function(){RouteSrv.navigate('analytics');}
                        // },
                        // {
                        //     'name': 'Спланировать',
                        //     iconClass: 'header-scheduler-icon',
                        //     visible: isLoggedIn
                        // },
                        // {
                        //     'name': 'Оценить',
                        //     visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                        // },
                        // {
                        //     'name': 'Кейсы',
                        //     iconClass: 'header-cases-icon',
                        //     visible: isLoggedIn,
                        //     selected: function(){
                        //         return $scope.currentRoute.key.startsWith('cases');
                        //     },
                        //     onClick: function(){RouteSrv.navigate('cases');}
                        // },
                        {
                            'name': 'Панель администрирования',
                            visible: function(){return $scope.showAdmin;},
                            selected: function(){
                                return $scope.currentRoute.key.startsWith('admin');
                            },
                            onClick: function(){RouteSrv.navigate('admin');}
                        }
                    ];
                    
                    $scope.menuTimeoutItem = {
                        visible: function(){
                            return isLoggedIn() && !!$scope.timeoutStr;
                        }
                    };
                    
                    $scope.menuEnterItem = {
                        'name': 'Войти',
                        iconClass: 'header-enter-icon',
                        visible: function(){
                            return $scope.currentRoute.key.startsWith('root');
                        },
                        onClick: function(){
                            if (isLoggedIn()) {
                                RouteSrv.navigate('infobox');
                            } else {
                                RouteSrv.navigate('login');
                            }
                        }
                    }
                    
                    $scope.menuUserItem = {
                        'name': 'Личный кабинет',
                        visible: function(){
                            return isLoggedIn() && !$scope.currentRoute.key.startsWith('root');
                        },
                        iconClass: 'header-account-icon',
                        // onClick: function(){$scope.setPath('/account/');}
                        onClick: function(){RouteSrv.navigate('account');}
                    };
                    
                    $scope.menuExitButton = {
                        visible: isLoggedIn
                    }
                    
                    // $scope.menuExitItem = {
                    //     'name': 'Личный кабинет',
                    //         //visible: isLoggedIn,
                    //         iconClass: 'header-exit-icon',
                    //         // onClick: function(){$scope.setPath('/account/');}
                    //         //onClick: function(){RouteSrv.navigate('account');}
                    // };

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
                        var timeout = TimeSrv.prepareSessionTimeout(tariff.realRemainingTime);
                        if (timeout.hours){
                            $scope.timeoutStr = timeout.hours;
                        } else if (timeout.days){
                            $scope.timeoutStr = timeout.days;
                            $scope.timeoutStrSuffix = 'дн';
                        } else {
                            $scope.timeoutStr = null;
                        }
                        
                        
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
