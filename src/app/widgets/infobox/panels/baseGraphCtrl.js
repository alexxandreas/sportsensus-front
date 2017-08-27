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
        'graphHelpersSrv',
        'ParamsSrv'
    ];

    function baseGraphCtrl($scope,
                          $rootScope,
                           graphHelpersSrv,
                           ParamsSrv)
    {

        $scope.$on('ParamsSrv.radarChanged', function(){
			updateParams();
		})
		updateParams();
		
		function updateParams() {
			$scope.showPreloader = true;
			ParamsSrv
				.getParams()
				.then(setParams)
				.catch(function(){
				    $scope.showPreloader = false;
				});
		}

        function setParams(params){
            $scope.parameters = params;
            if ($scope.setParams){
              $scope.setParams(params);  
            } else {
                $scope.showPreloader = false;
            }
        }

        $scope.formatValue = graphHelpersSrv.formatValue;

        $scope.prepareChartData = graphHelpersSrv.prepareChartData;
        
    }
}());
