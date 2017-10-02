(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxInterestDir', infoboxInterestDir);

    infoboxInterestDir.$inject = [
        '$rootScope'
    ];

    function infoboxInterestDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            templateUrl: '/views/widgets/infobox/panels/interest/infoboxInterest.html',
            
            controller: [
                '$scope',
                '$controller',
                function(
                    $scope,
                    $controller
                ) {
                    $controller('baseInfoboxCtrl', {$scope: $scope});
                }
            ]
        };
    }
}());
