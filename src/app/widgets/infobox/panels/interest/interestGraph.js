(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('interestGraphCrtl', interestGraphCrtl);

    interestGraphCrtl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function interestGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            requestGraph();
        });

        $scope.showCharts = false;

        function requestGraph() {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = {interested: true}
            });
            var interests = $scope.parameters.interest.lists.map(function (list) {
                return list.id;
            });
            var sportinterest = { // все спорты и все интересы
                sport: sports, // ParamsSrv.getParams().sport //ParamsSrv.getSelectedParams('sport'),
                interest: interests // [1, 2, 3, 4, 5, 6, 7] // ParamsSrv.getSelectedParams('image')
            };
            ApiSrv.getInterestGraph(audience, sportinterest).then(function (graphData) {
                $scope.prepareData(graphData);
                $scope.updateGraph();
            }, function () {
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = $scope.getSportLegend({color:'#555555'});
            $scope.interestLegend = $scope.getInterestLegend();
            
            $scope.$watch('sportLegend', $scope.updateGraph, true);
            $scope.$watch('interestLegend', $scope.updateGraph, true);
        };
        

        $scope.prepareData = function (data) {

            var interests = {};
            $scope.parameters.interest.lists.forEach(function (list) {
                interests[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });
            
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, interests)
                }, list);
            });

            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });

            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var interestId = item.legend[legendIndexes['sportinterest']];
                sports[sportId].data[interestId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[interestId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;

            $scope.chartsData = {
                multiplier: multiplier,
                maxValue: maxValue,
                sports: sports
            };

        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;

            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var interests = $scope.interestLegend.filter(function(item) {
                return item.selected;
            });
            // используем stack только если не выбран пункт "ни то ни сё"
            var useStack = interests.every(function(item){return item.id != 3;});

            var charts = [];
            sports.forEach(function(sport){
                var chartData = {labels:[],datasets:[]};

                if (useStack){
                    var interestA = [];
                    var notInterestA = [];
                    interests.forEach(function(interest){
                        if ($scope.chartsData.sports[sport.key].data[interest.id].count == 0) return;
                        if (interest.id < 3) interestA.push(interest);
                        if (interest.id > 3) notInterestA.push(interest);
                    });
                    var twoCols = interestA.length && notInterestA.length;

                    var firstDs = { label:[], fillColor:[], data:[] };
                    var secondDs = { label:[], fillColor:[], data:[] };

                    [[notInterestA[0],firstDs],[interestA[0],firstDs],
                    [notInterestA[1],secondDs],[interestA[1],secondDs]].forEach(function(item){
                        if(item[0]){
                            item[1].label.push(item[0].name);
                            item[1].fillColor.push(item[0].color);
                            item[1].data.push($scope.chartsData.sports[sport.key].data[item[0].id].count);
                        } else if (twoCols){
                            item[1].label.push('');
                            item[1].fillColor.push('');
                            item[1].data.push(0);
                        }
                    });

                    chartData.labels.push('');
                    if (twoCols) chartData.labels.push('');

                    if (firstDs.label.length) {
                        chartData.datasets.push(firstDs)
                    }
                    if (secondDs.label.length) {
                        chartData.datasets.push(secondDs)
                    }
                } else { // not use bars
                    var dataDs = { label:[], fillColor:[], data:[] };
                    var emptyDs = { label:[], fillColor:[], data:[] };

                    interests.forEach(function(interest){
                        var value = $scope.chartsData.sports[sport.key].data[interest.id].count;
                        if (value == 0) return;
                        
                        dataDs.label.push(interest.name);
                        dataDs.fillColor.push(interest.color);
                        dataDs.data.push($scope.chartsData.sports[sport.key].data[interest.id].count);

                        emptyDs.label.push(interest.name);
                        emptyDs.fillColor.push(interest.color);
                        emptyDs.data.push(0);

                        chartData.labels.push('');
                    });

                    chartData.datasets.push(dataDs);
                    chartData.datasets.push(emptyDs);
                }

                charts.push({
                    sport:sport,
                    chartData:{data:chartData, options:{
                        showLabels: useStack && chartData.datasets.length > 1 ? false : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value);}

                    }}
                })
            });

            $scope.showCharts = !!charts.length && !!interests.length;
            $scope.charts = charts;


            // Combine all sports in one graph
            var combineChart = {data:{labels:[], datasets:[]}, options:{
                scaleLabel: function(obj){return $scope.formatValue(obj.value);},
                barWidth: 40,
                barHeight: 300,
                barValueSpacing: 30
            }};
            combineChart.data.labels = sports.map(function(item){return item.name.replace(' ','\n');});
            interests.forEach(function(interest){
                var ds = { label:[], fillColor:[], data:[] };
                sports.forEach(function(sport) {
                    ds.label.push(interest.name);//item[0].name);
                    ds.fillColor.push(interest.color);
                    ds.data.push($scope.chartsData.sports[sport.key].data[interest.id].count);
                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);


        };

    }

}());
