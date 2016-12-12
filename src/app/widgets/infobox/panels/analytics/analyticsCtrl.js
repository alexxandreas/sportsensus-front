(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('analyticsCtrl', analyticsCtrl);

    analyticsCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv',
        'analyticsSrv'
    ];

    function analyticsCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        analyticsSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            //$scope.prepareLegends();
            //requestData();
            //requestData($scope.sportLegend[0]);
            updateCaption();
            updatePanel();
        });

        function updateCaption(){
            $scope.caption = ParamsSrv.getSelectedDemographyCaption();
        }

        function updatePanel(){
            var selected = analyticsSrv.getSelected();

            //$scope.advertising = [];
            if (!selected.sport){ // нет спорта - нет жизни!
                return;
            }

            if (selected.club){
                var playgrounds = selected.club.playgrounds;
                if (playgrounds.length == 1){
                    $scope.playground = playgrounds[0];
                } // else if (!playgrounds.length){}
            }
        }

        // определить выбранный спорт/лигу/клуб, загрузить из них playgrounds


        
        /*$scope.advertising = [{
            "type": "hockeyBox32",
            "stadium": "Стадион",
            "city": "Город",
            "capacity": 100500,
            "matchCount": 100500,
            "occupancy": 0.1
        }];*/
        
        
    /* TODO
    что делать, если у клуба несколько площадок?
    что делать, если выбрана лига (в ней несколько клубов и несколько площадок)?
     */

    }

}());
