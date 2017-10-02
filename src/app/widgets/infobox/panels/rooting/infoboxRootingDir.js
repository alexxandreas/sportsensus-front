(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxRootingDir', infoboxRootingDir);

    infoboxRootingDir.$inject = [
        '$rootScope'
    ];

    function infoboxRootingDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            templateUrl: '/views/widgets/infobox/panels/rooting/infoboxRooting.html',
            
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
