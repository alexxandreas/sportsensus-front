(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('hotelsListDir', hotelsListDir);

    hotelsListDir.$inject = [
        '$rootScope'
    ];

    function hotelsListDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/hotelsList/hotelsList.html',
            link: function ($scope, $el, attrs) {},
           
            controller: [
                '$scope',
                '$location',
                'DataSrv',
                function(
                    $scope,
                    $location,
                    DataSrv
                ){
                    $scope.hotels = null;
                    DataSrv.getHotels().then(function(hotels){
                        $scope.hotels = hotels;
                    });


                    $scope.showHotel = function(hotel){
                        $location.path('/hotel/'+hotel.id);
                    };

                    $scope.editHotel = function(hotel){

                    };

                   
            }]
        };
    }
}());
