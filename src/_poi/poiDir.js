(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('poiDir', poiDir);

    poiDir.$inject = [
        '$rootScope'
    ];

    function poiDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/poi/poi.html',
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
                    $scope.poiId = parseInt($routeParams.poiId);
                    $scope.poi = null;

                    $scope.services = null;
                    $scope.events = null;

                    DataSrv.getHotel($scope.hotelId).then(function(hotel){
                        $scope.hotel = hotel;
                        // $scope.service = service;
                        $scope.poi = hotel.pois ? hotel.pois.find(function(poi){
                            return poi.id == $scope.poiId;
                        }) : null;

                        $scope.services = hotel.services ? hotel.services.filter(function(service){
                            return service.pois && service.pois.indexOf($scope.poiId) >= 0;
                        }) : null;

                        $scope.events = hotel.events ? hotel.events.filter(function(event){
                            return event.pois && event.pois.indexOf($scope.poiId) >= 0;
                        }) : null;

                    });

                    $scope.goBack = function(){
                        //$location.path('/');
                        $window.history.back();
                    };

                    $scope.showHotel = function(){
                        $location.path('/hotel/'+$scope.hotelId);
                    };

                   
                    
                }]
        };
    }
}());
