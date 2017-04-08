(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('homeDir', homeDir);

    homeDir.$inject = [
        '$rootScope'
    ];

    function homeDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/home/home.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$anchorScroll',
                '$window',
                'ApiSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $anchorScroll,
                    $window,
                    ApiSrv
                ){
                    
                    $scope.regData = {
                        first_name:  '',
                        last_name: '',
                        company_name: '',
                        phone: '',
                        login: '',
                        company_type: null, // 0 - спонсор, 1 - правообладатель, 2 - агенство
                        legal_status: 0, // 0 - физ, 1 - юр
                        lang: "ru"
                    };

                    $scope.companyTypes = [
                        //{value: null, name: 'Тип компании', selected:true},
                        {value: 0, name: 'Спонсор'},
                        {value: 1, name: 'Правообладатель'},
                        {value: 2, name: 'Агенство'}
                    ];
                    
                    $scope.companyTypeFiz = function(fiz) {
                        if (arguments.length)
                            return $scope.regData.legal_status  = fiz ? 0 : 1;
                        else
                            return $scope.regData.legal_status  == 0 ? true : false;
                    };

                    $scope.companyTypeYur = function(yur) {
                        if (arguments.length)
                            return $scope.regData.legal_status  = yur ? 1 : 0;
                        else
                            return $scope.regData.legal_status  == 0 ? false : true;
                    };

                    
                    $scope.register = function(){
                        ApiSrv.register($scope.regData);
                    }
                    
                    $scope.scrollToRegistration = function(){
                        $scope.scrollTo('registration'); 
                    }
                    
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
