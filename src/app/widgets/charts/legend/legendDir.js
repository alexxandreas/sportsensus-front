(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('legendDir', legendDir);

    legendDir.$inject = [
        '$rootScope'
    ];

    function legendDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                legend: '='
            },
            templateUrl: '/views/widgets/charts/legend/legend.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ApiSrv',
                function(
                    $scope
                ){
                    // $scope.legend = [{
                    //     name: 'text1',
                    //     color: "#ffcc00"
                    // },{
                    //     name: 'text2',
                    //     color: "#66ff33"
                    // },{
                    //     name: 'text3',
                    //     color: "#cc33ff"
                    // }];
                    
                    $scope.itemClick = function(item){
                        item.selected = !item.selected;
                    }
                }]
        };
    }
}());