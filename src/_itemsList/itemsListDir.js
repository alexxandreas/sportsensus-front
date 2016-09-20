(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('itemsListDir', itemsListDir);

    itemsListDir.$inject = [
        '$rootScope'
    ];

    function itemsListDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                hotel: '=',
                //items: '=',
                compact: '=',
                itemsType: '=' // 'service' / 'event' 
            },
            templateUrl: '/views/itemsList/itemsList.html',
            replace: true,
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
                    
                    $scope.items = $scope.hotel[$scope.itemsType]; 

                    $scope.showService = function(service){
                        $location.path('/hotel/'+$scope.hotel.id+'/service/'+service.id);
                    };

                    $scope.editService = function(service){

                    };

                    $scope.showEvent = function(event){
                        $location.path('/hotel/'+$scope.hotel.id+'/event/'+event.id);
                    };

                    $scope.editEvent = function(event){

                    };
                    
                   

                }]
        };
    }
}());
