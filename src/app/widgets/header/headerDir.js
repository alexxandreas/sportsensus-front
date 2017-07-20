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
                '$anchorScroll',
                'ApiSrv',
                'UserSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    $anchorScroll,
                    ApiSrv,
                    UserSrv
                ) {
                    $scope.loggedIn = false;
                    $scope.isAdmin = false;
                    
                    $scope.menu = [/*{
                            'name': 'О проекте',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.scrollTo('about');}
                        },*/ {
                            'name': 'Зарегистрироваться',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.scrollTo('registration');}
                        },{
                            'name': 'Войти',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/login/');}
                        },/*{
                            'name': 'Техническая поддержка',
                            visible: function(){return !$scope.loggedIn;},
                            onClick: function(){$scope.setPath('/infobox/');}
                        },*/
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
                            'name': 'Кейсы',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            onClick: function(){$scope.setPath('/articles/');}
                        },{
                            'name': 'Личный кабинет',
                            visible: function(){return $scope.loggedIn && !$scope.isAdmin;},
                            onClick: function(){$scope.setPath('/account/');}
                        },
                        
                        
                        {
                            'name': 'Панель администрирования',
                            visible: function(){return $scope.isAdmin;},
                            onClick: function(){$scope.setPath('/admin/');}
                        }
                    ];

                    $scope.$on('UserSrv.login', updateUser);
                    $scope.$on('UserSrv.logout', updateUser);
                    updateUser();
                    
                    function updateUser(){
                        var user = UserSrv.getUser();
                        $scope.loggedIn = !!(user && user.sid);
                        $scope.isAdmin = !!(user && user.userRights && user.userRights.admin);
                    }
                    
                    // $scope.$watch( function () { return ApiSrv.getUser().sid; }, function (sid) {
                    //     $scope.loggedIn = !!sid;
                    //     $scope.isAdmin = ApiSrv.getUser().userRights && !!ApiSrv.getUser().userRights.admin;
                    // }, true);
                    
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
                }]
        };
    }
}());
