(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('rootingGraphCrtl', rootingGraphCrtl);

    rootingGraphCrtl.$inject = [
        '$scope',
        '$controller',
        '$q',
        'ParamsSrv',
        'ApiSrv'
    ];

    function rootingGraphCrtl(
        $scope,
        $controller,
        $q,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

        $scope.dataBySport = {};
        //$scope.chartDatas = {sportId: chartData}
        //$scope.chartDatas = {};

        ParamsSrv.getParams().then(function (params) {
            $scope.parameters = params;
            $scope.prepareLegends();
            //requestGraph();


            // $scope.$watch(function(){
            //     return [$scope.sportLegend, $scope.rootingLegend]
            // }, $scope.requestGraph, true);

            $scope.$watch('sportLegend', $scope.requestGraph, true);
            $scope.$watch('rootingLegend', $scope.updateGraph, true);
            //$scope.$watch('', $scope.requestGraph, true);

            //$scope.$watch('involveLegend', $scope.updateGraph, true);
        });

        $scope.prepareLegends = function () {
            //$scope.sportLegend = $scope.getSportLegend({color:'#555555', clubs:true, selectAll:false})
            //    .filter(function(sport){return !!sport.clubs;});

            $scope.sportLegend = $scope.getLegend($scope.parameters.sport.lists, {color:'#555555', selectAll:false, depth:1})
                .filter(function(sport){return sport.clubs && sport.clubs.length;});

            $scope.rootingLegend = $scope.getLegend($scope.parameters.rooting.lists, {depth:1});
            $scope.watchLegend = $scope.rootingLegend.filter(function(child){return child.key == 'watch';})[0].lists;
            $scope.walkLegend = $scope.rootingLegend.filter(function(child){return child.key == 'walk';})[0].lists;


            //getInvolveLegend();
            //$scope.watchLegend = $scope.getLegend($scope.parameters.watch);
            //$scope.walkLegend = $scope.getLegend($scope.parameters.walk);

            //$scope.$watch('sportLegend', $scope.updateGraph, true);
            //$scope.$watch('involveLegend', $scope.updateGraph, true);
        };

        //$scope.showCharts = false;

        // запрашиваем для выбранного в легенде спорта/клуба, но со всеми rooting, watch и walk
        $scope.requestGraph = function(sportId) {
            var audience = ParamsSrv.getSelectedAudience();
            var sports = {};

            $scope.sportLegend.forEach(function (list) {
                if (!list.selected) return;
                var sportObj = {interested: true};
                sportObj.clubs = list.clubs ? list.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
                if (!sportObj.clubs.length) return;
                sports[list.key] = sportObj;
            });

            var rooting = $scope.parameters.rooting.lists.map(function (list) {return list.id;});
            var rootingWatch = $scope.parameters.watch.lists.map(function (list) {return list.id;});// [1, 2, 3, 4];
            var rootingWalk = $scope.parameters.walk.lists.map(function (list) {return list.id;}); //[1, 2, 3, 4];

            // var sportrooting = {
            //     sport: sports,
            //     rooting: [1,2,3,4], //rooting, //[1,2],
            //     rooting_watch: [31, 32, 33, 34],
            //     rooting_walk: [41, 42, 43, 44]
            // };
            
            $q.all({
                rooting: ApiSrv.getRootingGraph(audience, sports, rooting),
                watch: ApiSrv.getRootingWatchGraph(audience, sports, rootingWatch),
                walk: ApiSrv.getRootingWalkGraph(audience, sports, rootingWalk)
            }).then(function(obj){
                $scope.prepareData(obj);
                $scope.updateGraph();
            });

            // ApiSrv.getRootingGraph(audience, sports, rooting).then(function (graphData) {
            //     $scope.prepareData(graphData);
            //     $scope.updateGraph();
            // }, function () {
            // });
        };

        


        $scope.checkSport = function(item){
            item.selected = !item.selected;
        };


        $scope.prepareData = function (data) {

            var rootingData = data.rooting ? $scope.prepareChartData(data.rooting, {
                'rooting':$scope.parameters.rooting,
                'sport':$scope.parameters.sport,
                'club':$scope.parameters.sport
                //sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            var watchData = data.watch ? $scope.prepareChartData(data.watch, {
                'rooting':$scope.parameters.watch,
                'sport':$scope.parameters.sport,
                'club':$scope.parameters.sport
                //sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            var walkData = data.walk ? $scope.prepareChartData(data.walk, {
                'rooting':$scope.parameters.walk,
                'sport':$scope.parameters.sport,
                'club':$scope.parameters.sport
                //sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            $scope.chartsData = {
                rooting: rootingData,
                watch: watchData,
                walk: walkData
            };

            $scope.updateGraph();


            /*

            var involves = {};
            $scope.parameters.involve.lists.forEach(function (list) {
                involves[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });

            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.id] = angular.merge({
                    data: angular.merge({}, involves)
                }, list);
            });


            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });

            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var involveId = item.legend[legendIndexes['involve']];
                sports[sportId].data[involveId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[involveId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;


            $scope.chartsData = {
                multiplier: multiplier,
                maxValue: maxValue,
                sports: sports
            };
        */

        };

        $scope.updateGraph = function () {
            if (!$scope.chartsData) return;

            var sports = $scope.sportLegend.filter(function(item) {
                return item.selected;
            });

            var rootings = $scope.rootingLegend.filter(function(item) {
                return item.selected;
            });

            // var watches = $scope.watchLegend.filter(function(item) {
            //     return item.selected;
            // });
			//
            // var walks = $scope.walkLegend.filter(function(item) {
            //     return item.selected;
            // });

            //$scope.watchCharts = [];
            //$scope.walkCharts = [];
            $scope.rootingCharts = [];
            rootings.map(function(rooting){
                var rootingData = {name: rooting.name, subItems: []};
                $scope.rootingCharts.push(rootingData);

                var walkWatchItems = null;
                if (rooting.key == 'walk' || rooting.key == 'watch'){
                    walkWatchItems = $scope[rooting.key+'Legend'].filter(function(item) {
                        return item.selected;
                    });
                    if (!walkWatchItems.length) {
                        walkWatchItems = null;
                    }
                }

                var dataDs = { label:[], fillColor:[], data:[] };
                var chartData = {labels:[],datasets:[dataDs]};

                rootingData.chart = {
                    data:chartData,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        barHeight: 600,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                };


                sports.forEach(function(sport) {
                    sport.clubs.forEach(function (club) {
                        if (!club.selected) return;

                        var count = $scope.chartsData.rooting.getCount({
                                'sport': sport.id,
                                'club': club.id,
                                'rooting': rooting.id
                            }) || 0;
                        dataDs.label.push(club.name + ' (' + sport.name + '): ' + count.toLocaleString('en-US'));
                        dataDs.fillColor.push(rooting.color);
                        dataDs.data.push(count);
                        chartData.labels.push(club.name + ' (' + sport.name + ')');

                        if (walkWatchItems){
                            var clubData = {name: club.name};
                            clubData.chart = {
                                text: club.name + ' (' + sport.name + ')',
                                chartData: [],
                                options: {
                                    percentageInnerCutout: 70
                                }
                            };
                            //$scope[rooting.key+'Charts'].push(clubData);
                            rootingData.subItems.push(clubData);

                            walkWatchItems.forEach(function(item){
                                //var options = {'sport': sport.id, 'club': club.id, 'rooting':item.id};
                                //options[rooting.key] = item.id;
                                var count = $scope.chartsData[rooting.key].getCount({'sport': sport.id, 'club': club.id, 'rooting':item.id}) || 0;
                                clubData.chart.chartData.push({
                                    label: (item.name) + ': ' + count.toLocaleString('en-US'),
                                    color: item.color,
                                    value: count || 0
                                });
                            });
                        }
                    })
                })


            });


            return;

            $scope.dataBySport = {};
            sports.forEach(function(sport){
                var sportData = {};
                $scope.dataBySport[sport.id] = sportData;

                sportData.rootingCharts = rootings.map(function(rooting){
                    var rootingData = {name: rooting.name};
                    var walkWatchItems = null;
                    if (rooting.key == 'walk' || rooting.key == 'watch'){
                        walkWatchItems = $scope[rooting.key+'Legend'].filter(function(item) {
                            return item.selected;
                        });
                        if (!walkWatchItems.length) {
                            walkWatchItems = null;
                        } else {
                            sportData[rooting.key+'Charts'] = [];
                        }
                    }

                    var dataDs = { label:[], fillColor:[], data:[] };
                    var chartData = {labels:[],datasets:[dataDs]}; //, emptyDs]};

                    rootingData.chart = {
                        data:chartData,
                        options:{
                            showLabels: false, // : $scope.formatValue,
                            //stacked: false,
                            barHeight: 600,
                            scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                        }
                    };

                    var clubs = sport.clubs.filter(function(item) {
                        return item.selected;
                    });

                    clubs.forEach(function(club){
                        var count = $scope.chartsData.rooting.getCount({'sport': sport.id, 'club': club.id, 'rooting': rooting.id}) || 0;
                        dataDs.label.push(club.name + ' (' + sport.name + '): ' + count.toLocaleString('en-US'));
                        dataDs.fillColor.push(rooting.color);
                        dataDs.data.push(count);
                        chartData.labels.push(club.name + ' (' + sport.name + ')');

                        if (walkWatchItems){
                            var clubData = {name: club.name};
                            clubData.chart = {
                                //text: item.name,
                                chartData: [],
                                options: {
                                    percentageInnerCutout: 70
                                }
                            };
                            walkWatchItems.forEach(function(item){
                                var options = {'sport': sport.id, 'club': club.id};
                                options[rooting.key] = item.id;
                                var count = $scope.chartsData[rooting.key].getCount(options) || 0;
                                clubData.chart.chartData.push({
                                    label: (item.name) + ': ' + count.toLocaleString('en-US'),
                                    color: item.chartColor,
                                    value: count || 0
                                });
                            });
                        }


                    });

                    //data.careerLegend = careerData.legends.career;




                    if (rooting.key == 'walk' || rooting.key == 'watch'){
                        var items = rooting.key == 'walk' ? walks : watches;
                        if (items.length){
                            sportData[rooting.key+'Chart'] = {
                                //text: item.name,
                                chartData: [],
                                options: {
                                    percentageInnerCutout: 70
                                }
                            };

                            items.forEach(function(item){
                                var options = {'sport': sport.id, 'club': club.id, 'rooting': rooting.id};
                                options[rooting.key] = item.id;
                                var count = $scope.chartsData[rooting.key].getCount(options) || 0;
                                sportData[rooting.key+'Chart'].chartData.push({
                                    label: (item.name) + ': ' + count.toLocaleString('en-US'),
                                    color: item.chartColor,
                                    value: count || 0
                                });
                            })
                        }

                    }

                    return rootingData;
                });

            });

            return;
            
            $scope.rootingCharts = rootings.map(function(rooting){

            });


            var involves = $scope.involveLegend.filter(function(item) {
                return item.selected;
            });

            var charts = [];
            sports.forEach(function(sport){
                // if (!sport.selected) return;
                //charts.push(sport);
                var chartData = {labels:[],datasets:[]};

                var dataDs = { label:[], fillColor:[], data:[] };
                var emptyDs = { label:[], fillColor:[], data:[] };

                involves.forEach(function(involve){
                    var value = $scope.chartsData.sports[sport.id].data[involve.id].count;
                    if (value == 0) return;

                    dataDs.label.push(involve.name);
                    dataDs.fillColor.push(involve.color);
                    dataDs.data.push($scope.chartsData.sports[sport.id].data[involve.id].count);

                    emptyDs.label.push(involve.name);
                    emptyDs.fillColor.push(involve.color);
                    emptyDs.data.push(0);

                    chartData.labels.push('');
                });

                chartData.datasets.push(dataDs);
                chartData.datasets.push(emptyDs);
                // }


                charts.push({
                    sport:sport,
                    chartData:{data:chartData, options:{
                        showLabels: $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value);}
                    }}
                })
            });

            $scope.showCharts = !!charts.length && !!involves.length;
            $scope.charts = charts;

            // Combine all sports in one graph
            var combineChart = {data:{labels:[], datasets:[]}, options:{
                scaleLabel: function(obj){return $scope.formatValue(obj.value);},
                barWidth: 40,
                barHeight: 300,
                barValueSpacing: 30
            }};
            combineChart.data.labels = sports.map(function(item){return item.name;});
            involves.forEach(function(involve){
                var ds = { label:[], fillColor:[], data:[] };
                sports.forEach(function(sport) {
                    ds.label.push(involve.name);//item[0].name);
                    ds.fillColor.push(involve.color);
                    ds.data.push($scope.chartsData.sports[sport.id].data[involve.id].count);

                });
                combineChart.data.datasets.push(ds);
            });
            $scope.combineChart = (combineChart.data.labels.length > 1 ? combineChart : null);
        };

    }

}());
