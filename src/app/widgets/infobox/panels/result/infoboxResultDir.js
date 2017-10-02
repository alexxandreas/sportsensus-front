(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxResultDir', infoboxResultDir);

    infoboxResultDir.$inject = [
        '$rootScope'
    ];

    function infoboxResultDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            templateUrl: '/views/widgets/infobox/panels/result/infoboxResult.html',
            
            controller: [
                '$scope',
                '$controller',
                function(
                    $scope,
                    $controller
                ) {
                    //$controller('baseInfoboxCtrl', {$scope: $scope});
                }
            ]
        };
    }
}());
