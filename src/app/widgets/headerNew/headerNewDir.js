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
        'ApiSrv'
    ];

    function headerNewDir(
        $rootScope,
        ApiSrv
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/headerNew/headerNew.html',
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
                            onClick: function(){$scope.scrollTo('registration');}
                        },  {
                            'name': 'Войти',
                            visible: isNotLoggedIn,
                            onClick: function(){$scope.setPath('/login/');}
                        },  /*{
                            'name': 'Техническая поддержка',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },*/
                        {
                            'name': 'Получить информацию',
                            iconClass: 'header-infoblock-icon',
                            visible: isLoggedIn,
                            onClick: function(){$scope.setPath('/infobox/');}
                        },{
                            'name': 'Проанализировать',
                            // visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            iconClass: 'header-analitycs-icon',
                            visible: isLoggedIn,
                            onClick: function(){$scope.setPath('/analytics/');}
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
                            onClick: function(){$scope.setPath('/articles/');}
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
                            onClick: function(){$scope.setPath('/admin/');}
                        }
                    ];
                    
                    $scope.menuUserItem = {
                        'name': 'Личный кабинет',
                            visible: isLoggedIn,
                            iconClass: 'header-account-icon',
                            onClick: function(){$scope.setPath('/account/');}
                    };

                    $scope.$on('UserSrv.login', updateUser);
                    $scope.$on('UserSrv.logout', updateUser);
                    updateUser();
                    
                    function updateUser(){

                        var user = UserSrv.getUser();
                        $scope.loggedIn = !!(user && user.sid);
                        $scope.showAdmin = UserSrv.hasAccess('admin') || UserSrv.hasAccess('data_update') || UserSrv.hasAccess('homepage_update')

                    }
                    
                    

                    var updateTimeoutInterval = $interval(updateTimeout, 1000);
                    updateTimeout();
                    
                    function updateTimeout(){
                        var tariff = UserSrv.getTariff();
                        if (!tariff.realRemainingTime || tariff.realRemainingTime <= 0){
                        // if (!$scope.updateRemainingTime){
                            $scope.timeoutStr = null;
                            return;
                        }
                        // var remainingTime = $scope.updateRemainingTime - Math.round((Date.now() - $scope.updateTime)/1000);
                        // if (remainingTime <= 0){
                        //     $scope.timeoutStr = null;
                        //     return;
                        // }
                        $scope.timeoutStr = TimeSrv.secondsToDateTime(tariff.realRemainingTime);
                    }

                    
                    
                    $scope.setPath = function(path){
                        $location.path(path);
                    };
                
                    $scope.logout = function(){
                        UserSrv.logout().finally(function(){
                            $scope.setPath('/');
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
                        $scope.setPath('/');
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
