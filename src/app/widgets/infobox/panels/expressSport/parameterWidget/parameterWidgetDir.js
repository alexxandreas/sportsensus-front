(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('parameterWidgetDir', parameterWidgetDir);

    parameterWidgetDir.$inject = [
        '$rootScope'
    ];

    function parameterWidgetDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                header: '@',
                text: '@',
                footer: '@'
                // header: '&',
                // text: '&',
                // footer: '&'
            },
            templateUrl: '/views/widgets/infobox/panels/expressSport/parameterWidget/parameterWidget.html',
            link: function ($scope, $el, attrs) {
                $scope.el = $el;
                //$scope.draw();
                $scope.$watch('chart', $scope.redrawChart);
            },
            replace: true,
            controller: [
                '$scope',
                function(
                    $scope
                ){

                }]
        };
    }
}());