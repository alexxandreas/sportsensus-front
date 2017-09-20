(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('expressSportsCtrl', expressSportsCtrl);

    expressSportsCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function expressSportsCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

		
		$scope.setParams = function(params){
            $scope.prepareSports();
            //updateCaption();
		}
		
// 		$scope.setParams = function(params){
//             requestData();
//             updateCaption();
// 		}
		
		$scope.sports = {};
		
		
		// формируем список выбранных спортов
		$scope.prepareSports = function () {
            var sportLegend = graphHelpersSrv.getSportLegend({sport:$scope.parameters.sport, color:'#555555', clubs:true, selectAll:false});
            //    .filter(function(sport){return !!sport.clubs;});

            sportLegend.forEach(function(sport){
                $scope.$watch(function(){return sport;}, function(sport, oldValue){
                    if (sport.selected){
                        // $scope.sports[sport.id] = {
                        //     sport: sport,
                        //     //clubs: sport.clubs.filter(function(club){return club.selected;}),
                        //     clubNames: sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.name; }).join(', ')
                        // };
                        $scope.sports[sport.id] = sport;
                        //requestData(sport);
                    } else {
                        delete $scope.sports[sport.id];
                    }
                }, true);
            });
		}


    } // end of controller function 

}());
