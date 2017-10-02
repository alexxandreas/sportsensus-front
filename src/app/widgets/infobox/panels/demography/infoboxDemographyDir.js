(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxDemographyDir', infoboxDemographyDir);

    infoboxDemographyDir.$inject = [
        '$rootScope'
    ];

    function infoboxDemographyDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            templateUrl: '/views/widgets/infobox/panels/demography/infoboxDemography.html',
            
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
