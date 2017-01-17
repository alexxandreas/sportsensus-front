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
                'ApiSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    ApiSrv
                ) {
                    $scope.loggedIn = false;
                    $scope.isAdmin = false;
                    
                    $scope.menu = [{
                            'name': 'О проекте',
                            visible: function(){return !$scope.loggedIn;}
                        }, {
                            'name': 'Зарегистрироваться',
                            visible: function(){return !$scope.loggedIn;}
                        },{
                            'name': 'Войти',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/login/');}
                        },{
                            'name': 'Техническая поддержка',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },
                        {
                            'name': 'Получить информацию',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },{
                            'name': 'Проанализировать',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            onClick: function(){$scope.setPath('/analytics/');}
                        },{
                            'name': 'Спланировать',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                        },{
                            'name': 'Оценить',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                        },{
                            'name': 'Личный кабинет',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;}
                        },{
                            'name': 'Панель администрирования',
                            visible: function(){return $scope.isAdmin;},
                            onClick: function(){$scope.setPath('/admin/');}
                        }
                    ];

                    
                    $scope.$watch( function () { return ApiSrv.getUser().sid; }, function (sid) {
                        $scope.loggedIn = !!sid;
                        $scope.isAdmin = ApiSrv.getUser().userRights && !!ApiSrv.getUser().userRights.admin;

                    }, true);
                    
                    $scope.setPath = function(path){
                        $location.path(path);
                    };
                
                    $scope.logout = function(){
                        ApiSrv.logout();
                        $scope.setPath('/');
                    };
                }]
        };
    }
}());
