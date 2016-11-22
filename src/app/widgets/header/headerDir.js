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
                            visible: function(){return $scope.loggedIn;}
                        },{
                            'name': 'Проанализировать',
                            visible: function(){return $scope.loggedIn;}
                        },{
                            'name': 'Спланировать',
                            visible: function(){return $scope.loggedIn;}
                        },{
                            'name': 'Оценить',
                            visible: function(){return $scope.loggedIn;}
                        },{
                            'name': 'Личный кабинет',
                            visible: function(){return $scope.loggedIn;}
                        }
                    ];

                    
                    $scope.$watch( function () { return ApiSrv.getUser().sid; }, function (sid) {
                        $scope.loggedIn = !!sid;
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
