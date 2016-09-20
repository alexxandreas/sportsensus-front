(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('hotelDir', hotelDir);

    hotelDir.$inject = [
        '$rootScope'
    ];

    function hotelDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/hotel/hotel.html',
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

                    
                    DataSrv.getHotel($scope.hotelId).then(function(hotel){
                        $scope.hotel = hotel;
                    });

                    $scope.goBack = function(){
                        // $location.path('/');
                        $window.history.back();
                    };
                    
                    // $scope.showService = function(service){
                    //     $location.path('/hotel/'+$scope.hotelId+'/service/'+service.id);
                    // };
                    //
                    // $scope.editService = function(service){
                    //
                    // };
                    //
                    // $scope.showEvent = function(event){
                    //     $location.path('/hotel/'+$scope.hotelId+'/event/'+event.id);
                    // };
                    //
                    // $scope.editEvent = function(event){
                    //
                    // };
                    
                }]
        };
    }
}());
