(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxInvolveDir', infoboxInvolveDir);

    infoboxInvolveDir.$inject = [
        '$rootScope'
    ];

    function infoboxInvolveDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            templateUrl: '/views/widgets/infobox/panels/involve/infoboxInvolve.html',
            
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
