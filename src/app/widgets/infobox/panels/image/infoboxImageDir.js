(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxImageDir', infoboxImageDir);

    infoboxImageDir.$inject = [
        '$rootScope'
    ];

    function infoboxImageDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            templateUrl: '/views/widgets/infobox/panels/image/infoboxImage.html',
            
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
