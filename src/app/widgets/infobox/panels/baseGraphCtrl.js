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
        
        
      $scope.graphsModes = [{
            id: 1,
            graphKey: "",
            selected: true,
            name: "‘000"
        },{
            id: 2,
            graphKey: "_col",
            name: "% Col"
        },{
            id: 3,
            graphKey: "_row",
            name: "% Row"
        }];
        
        $scope.selectedGraphMode = null;
        
        $scope.$watch('graphsModes', function(newValue, oldValue) {
            //if (newValue === oldValue) return;
            $scope.selectedGraphMode = $scope.graphsModes.find(function(mode){
                return mode.selected;
            }) || $scope.graphsModes[0];
            
            $scope.setGraphsMode && $scope.setGraphsMode($scope.selectedGraphMode);
        }, true);
        
        
        $scope.getGraphData = function(serverData, key){
            var graphKey = $scope.selectedGraphMode.graphKey;
            
            // TODO: заглушка на время отсутствия бекенда
            var data = serverData[key];
            if (!data) return data;
            
            if (graphKey == '_col'){
                var newData = angular.copy(data, {});
                var counts = newData.data.map(function(a){return a.count});
                var max = Math.max.apply(Math, counts);
                angular.forEach(newData.data, function(item){
                    item.count = item.count / max * 100;
                })
                return newData;
            } else if(graphKey == '_row'){
                var newData = angular.copy(data, {});
                var counts = newData.data.map(function(a){return a.count});
                var sum = counts.reduce(function(acc, curr) {return acc + curr;}, 0);
                angular.forEach(newData.data, function(item){
                    item.count = item.count / sum * 100;
                })
                return newData;
            }
            else return data;
           
            
            return serverData[key+graphKey];
        }
        
        $scope.formatCount = function(count){
            if (count > 1000*1000)
                return format(count/1000/1000, ' M');
            else if (count > 1000)
                return format(count/1000, ' k');
            else 
                return format(count);
                
            function format(count, suffix){
                suffix = suffix || '';
                if (count > 100)
                    return Math.round(count) + suffix;
                else if (count > 10)
                    return Math.round(count*10)/10 + suffix;
                else 
                    return Math.round(count*100)/100 + suffix;
            }
        }
        
        
    }
}());
