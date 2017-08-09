(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('headerDir', headerDir);

    headerDir.$inject = [
        '$rootScope',
        'ApiSrv'
    ];

    function headerDir(
        $rootScope,
        ApiSrv
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/header/header.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                '$interval',
                '$anchorScroll',
                'ApiSrv',
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
                    
                    
                    $scope.menu = [/*{
                            'name': 'О проекте',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.scrollTo('about');}
                        },*/ {
                            'name': 'Зарегистрироваться',
                            visible: isNotLoggedIn,
                            onClick: function(){$scope.scrollTo('registration');}
                        },{
                            'name': 'Войти',
                            visible: isNotLoggedIn,
                            onClick: function(){$scope.setPath('/login/');}
                        },/*{
                            'name': 'Техническая поддержка',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },*/
                        {
                            'name': 'Получить информацию',
                            visible: isLoggedIn,
                            onClick: function(){$scope.setPath('/infobox/');}
                        },{
                            'name': 'Проанализировать',
                            // visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            visible: isLoggedIn,
                            onClick: function(){$scope.setPath('/analytics/');}
                        },{
                            'name': 'Спланировать',
                            // visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                            visible: isLoggedIn
                            // visible: checkHasAccess('scheduler'),
                        },/*{
                            'name': 'Оценить',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                        },*/{
                            'name': 'Кейсы',
                            // visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            visible: isLoggedIn,
                            onClick: function(){$scope.setPath('/articles/');}
                        },{
                            'name': 'Личный кабинет',
                            visible: isLoggedIn,
                            onClick: function(){$scope.setPath('/account/');}
                        },
                        
                        
                        {
                            'name': 'Панель администрирования',
                            visible: function(){return $scope.showAdmin;},
                            onClick: function(){$scope.setPath('/admin/');}
                        }
                    ];

                    $scope.$on('UserSrv.login', updateUser);
                    $scope.$on('UserSrv.logout', updateUser);
                    updateUser();
                    
                    function updateUser(){

                        var user = UserSrv.getUser();
                        $scope.loggedIn = !!(user && user.sid);
                        $scope.showAdmin = UserSrv.hasAccess('admin') || UserSrv.hasAccess('data_update') || UserSrv.hasAccess('homepage_update')

                        //$scope.isAdmin = !!(user && user.userRights && user.userRights.admin);

                        
                        // оствшееся время на момент обновления (в секундах)
                        // $scope.updateRemainingTime = null;
                        
                        
                        //var tariff = user && user.userRights && user.userRights.tariff;
                        // var tariff = UserSrv.getTariff();
                        
                        // if (!tariff){
                        //     return;
                        // }
                        
                        // var remainingTime = Number.parseInt(tariff.remaining_time);
                        // if (!isNaN(remainingTime) && remainingTime){
                        //     $scope.updateRemainingTime = remainingTime; //Math.round(remainingTime);
                        // }
                        
                        // // момент обновления
                        // $scope.updateTime = tariff.updateTime;
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
