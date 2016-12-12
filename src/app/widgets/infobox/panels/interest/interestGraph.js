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
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function interestGraphCrtl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
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
                sports[list.key] = {interested: true}
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
            $scope.sportLegend = graphHelpersSrv.getSportLegend({color:'#555555'});
            $scope.interestLegend = graphHelpersSrv.getInterestLegend();
            
            $scope.$watch('sportLegend', $scope.updateGraph, true);
            $scope.$watch('interestLegend', $scope.updateGraph, true);
        };
        

        $scope.prepareData = function (data) {

            /*var interests = {};
            $scope.parameters.interest.lists.forEach(function (list) {
                interests[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });
            
            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = angular.merge({
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
            */

            $scope.interestData = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'sportinterest':  $scope.parameters.interest,
                'region': $scope.parameters.region
            });


        };

        $scope.updateGraph = function () {
            if (!$scope.interestData) return;


            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var interests = $scope.interestLegend.filter(function(item) {
                return item.selected;
            });

            var useRegions = $scope.interestData.legends.region && $scope.interestData.legends.region.length;
            
            if (useRegions){
                $scope.interestData.legends.region.forEach(function(region){
                    region.selected = true;
                    var maxSport;
                    var maxCount = 0;

					sports.forEach(function(sport){
                        var count = ($scope.interestData.getCount({'sport':sport.id, 'region':region.id, 'sportinterest':4}) || 0) +
							($scope.interestData.getCount({'sport':sport.id, 'region':region.id, 'sportinterest':5}) || 0);
                        if (count >= maxCount){
							maxCount = count;
							maxSport = sport;
						}
                    });
                    region.data = {
                        count: maxCount,
                        //percent: 50// count/allCount*100
						header: maxSport.name
                    };
                });
				$scope.regionsChart = $scope.interestData.legends.region;
                $scope.showCharts = false;
                return;
            }
			
			$scope.regionsChart = null;
            

            //var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':interest.id});

            // используем stack только если не выбран пункт "ни то ни сё"
            var useStack = interests.every(function(item){return item.id != 3;});

            var charts = [];
            sports.forEach(function(sport){
                var chartData = {labels:[],datasets:[]};

                if (useStack){
                    var interestA = [];
                    var notInterestA = [];
                    interests.forEach(function(interest){
                        var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':interest.id});
                        if (count == 0) return;
                        //if ($scope.chartsData.sports[sport.id].data[interest.id].count == 0) return;
                        if (interest.id < 3) interestA.push(interest);
                        if (interest.id > 3) notInterestA.push(interest);
                    });
                    var twoCols = interestA.length && notInterestA.length;

                    var firstDs = { label:[], fillColor:[], data:[] };
                    var secondDs = { label:[], fillColor:[], data:[] };

                    [[notInterestA[0],firstDs],[interestA[0],firstDs],
                        [notInterestA[1],secondDs],[interestA[1],secondDs]].forEach(function(item){
                        if(item[0]){
                            //item[1].label.push(item[0].name);
                            var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':item[0].id});
                            //var value = $scope.chartsData.sports[sport.id].data[item[0].id].count;
                            item[1].label.push(item[0].name + ': ' + count.toLocaleString('en-US'));
                            item[1].fillColor.push(item[0].color);
                            item[1].data.push(count);
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
                        var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':interest.id});
                        //var value = $scope.chartsData.sports[sport.id].data[interest.id].count;
                        if (count == 0) return;

                        dataDs.label.push(interest.name + ': ' + count.toLocaleString('en-US'));
                        dataDs.fillColor.push(interest.color);
                        dataDs.data.push(count);

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
                    var count = $scope.interestData.getCount({'sport':sport.id, 'sportinterest':interest.id});
                    //var value = $scope.chartsData.sports[sport.id].data[interest.id].count;
                    ds.label.push(interest.name + ': ' + count.toLocaleString('en-US'));//item[0].name);
                    ds.fillColor.push(interest.color);
                    ds.data.push(count);
                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);



            /*
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
                        if ($scope.chartsData.sports[sport.id].data[interest.id].count == 0) return;
                        if (interest.id < 3) interestA.push(interest);
                        if (interest.id > 3) notInterestA.push(interest);
                    });
                    var twoCols = interestA.length && notInterestA.length;

                    var firstDs = { label:[], fillColor:[], data:[] };
                    var secondDs = { label:[], fillColor:[], data:[] };

                    [[notInterestA[0],firstDs],[interestA[0],firstDs],
                    [notInterestA[1],secondDs],[interestA[1],secondDs]].forEach(function(item){
                        if(item[0]){
                            //item[1].label.push(item[0].name);
                            var value = $scope.chartsData.sports[sport.id].data[item[0].id].count;
                            item[1].label.push(item[0].name + ': ' + value.toLocaleString('en-US'));
                            item[1].fillColor.push(item[0].color);
                            item[1].data.push(value);
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
                        var value = $scope.chartsData.sports[sport.id].data[interest.id].count;
                        if (value == 0) return;
                        
                        dataDs.label.push(interest.name + ': ' + value.toLocaleString('en-US'));
                        dataDs.fillColor.push(interest.color);
                        dataDs.data.push(value);

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
                    var value = $scope.chartsData.sports[sport.id].data[interest.id].count;
                    ds.label.push(interest.name + ': ' + value.toLocaleString('en-US'));//item[0].name);
                    ds.fillColor.push(interest.color);
                    ds.data.push(value);
                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);

            */
        };




    }

}());
