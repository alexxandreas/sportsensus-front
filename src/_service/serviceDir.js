(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('serviceDir', serviceDir);

    serviceDir.$inject = [
        '$rootScope'
    ];

    function serviceDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/service/service.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'DataSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    DataSrv
                ){
                    $scope.hotelId = parseInt($routeParams.hotelId);
                    $scope.hotel = null;
                    $scope.serviceId = parseInt($routeParams.serviceId);
                    $scope.service = null;

                    DataSrv.getHotel($scope.hotelId).then(function(hotel){
                        $scope.hotel = hotel;
                        // $scope.service = service;
                        $scope.service = hotel.services ? hotel.services.find(function(service){
                            return service.id == $scope.serviceId;
                        }) : null;
                    });

                    $scope.goBack = function(){
                        //$location.path('/');
                        $window.history.back();
                    };

                    $scope.showHotel = function(){
                        $location.path('/hotel/'+$scope.hotelId);
                    }
                    
                }]
        };
    }
}());
