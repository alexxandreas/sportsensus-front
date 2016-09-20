(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('eventDir', eventDir);

    eventDir.$inject = [
        '$rootScope'
    ];

    function eventDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/event/event.html',
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
                    $scope.eventId = parseInt($routeParams.eventId);
                    $scope.event = null;

                    DataSrv.getHotel($scope.eventId).then(function(event){
                        $scope.event = event;
                    });

                    $scope.goBack = function(){
                        // $location.path('/');
                        $window.history.back();
                    };
                   
                    
                }]
        };
    }
}());
