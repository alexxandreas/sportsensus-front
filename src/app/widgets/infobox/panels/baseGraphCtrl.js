(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('baseGraphCtrl', baseGraphCtrl);

    baseGraphCtrl.$inject = [
        '$scope',
        '$rootScope',
        'graphHelpersSrv'
    ];

    function baseGraphCtrl($scope,
                          $rootScope,
                           graphHelpersSrv)
    {

        // $scope.getLegend;
		//
        // $scope.getSportLegend;
        //
        // $scope.getInterestLegend;
        //
        // $scope.getImageLegend;
		//
        // $scope.getInvolveLegend;

        $scope.formatValue = graphHelpersSrv.formatValue;

        $scope.prepareChartData = graphHelpersSrv.prepareChartData;
        
    }
}());
