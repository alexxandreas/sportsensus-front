(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('expressAudienceCtrl', expressAudienceCtrl);

    expressAudienceCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv'
    ];

    function expressAudienceCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

		
		$scope.setParams = function(params){
            requestData();
            updateCaption();
		}

        $scope.sportDatas = {};

        function updateCaption(){
            $scope.caption = ParamsSrv.getSelectedDemographyCaption();
        }

        function requestData(sport) { 
            var audience = ParamsSrv.getSelectedAudience();
            
            ApiSrv.getExpressAudience(audience).then(function (data) {
                $scope.graphs = {};
                prepareInterestData(data.interest);
                prepareInvolveData(data.involvment);
                prepareKnownData(data.clubs_known);
                prepareKnownHelpData(data.clubs_known_help);
                prepareWatchData(data.watch);
                prepareWalkData(data.walk);
                
            }).finally(function(){
                $scope.showPreloader = false;
            });
        }

        var colorGenerator = d3.scale.category10();


        function prepareInterestData(data){

            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'interest': $scope.parameters.interest
            });

            
            var datasets2 = data.legends.interest.map(function(){
                return { label:[], fillColor:[], data:[] }
            });
            var chartData2 = {labels:[],datasets:datasets2};
            data.legends.sport.forEach(function(sport) {
                data.legends.interest.forEach(function (interest, interestIndex) {
                    var count = data.getCount({'sport': sport.id, 'interest': interest.id});
                    var ds = datasets2[interestIndex];
                    //ds.label.push('');
                    ds.label.push(interest.name + ': ' + count.toLocaleString('en-US'));
                    ds.fillColor.push(interest.color);
                    ds.data.push(count);
                });
                chartData2.labels.push(sport.name);
            });

            
            $scope.graphs.interest = {
                legends:data.legends,

                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        stacked: true,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
            

            // $scope.showCharts = !!charts.length && !!interests.length;
            // $scope.charts = charts;
        }

        function prepareInvolveData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'involve': $scope.parameters.involve
            });

            var charts = [];
            // var datasets = data.legends.involve.map(function(){
            //     return { label:[], fillColor:[], data:[] }
            // });
            // var chartData = {labels:[],datasets:datasets};

            data.legends.sport.forEach(function(sport) {
                var chart = {
                    //sport: sport,
                    text:sport.name,
                    chartData: [],
                    options: {
                        percentageInnerCutout: 70
                    }
                };
                charts.push(chart);

                data.legends.involve.forEach(function (involve, involveIndex) {
                    var count = data.getCount({'sport': sport.id, 'involve': involve.id});
                    chart.chartData.push({
                        //label: involve.name,
                        label: involve.name + ': ' + count.toLocaleString('en-US'),
                        color: involve.color,
                        //highlight: "#78acd9",
                        value: count
                    });

                });

            });

            $scope.graphs.involve = {
                legends:data.legends,
                charts: charts
            };


            
        }

        function prepareKnownData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'club': $scope.parameters.sport
            });

            
            
            var dataDs2 = { label:[], fillColor:[], data:[] };
            var chartData2 = {labels:[],datasets:[dataDs2]};

            data.legends.club.forEach(function(club, index) {
                var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                dataDs2.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
                dataDs2.fillColor.push(colorGenerator(index)); //club.color);
                dataDs2.data.push(count);

                chartData2.labels.push(club.name + ' (' + club.sport.name + ')');
            });


            $scope.graphs.known = {
                legends:data.legends,
                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
        }

        function prepareKnownHelpData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'club': $scope.parameters.sport
            });

           
            var dataDs2 = { label:[], fillColor:[], data:[] };
            var chartData2 = {labels:[],datasets:[dataDs2]};
            data.legends.club.forEach(function(club, index) {
                var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                dataDs2.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
                dataDs2.fillColor.push(colorGenerator(index));
                dataDs2.data.push(count);

                chartData2.labels.push(club.name + ' (' + club.sport.name + ')');
            });


            $scope.graphs.knownHelp = {
                legends:data.legends,
                
                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
        }

        function prepareWatchData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'club': $scope.parameters.sport,
                'watch': $scope.parameters.watch
            });

           


            var datasets2 = data.legends.watch.map(function(){
                return { label:[], fillColor:[], data:[] }
            });
            var chartData2 = {labels:[],datasets:datasets2};

            data.legends.club.forEach(function(club) {
                data.legends.watch.forEach(function (watch, watchIndex) {
                    var count = data.getCount({'sport': club.sport.id, 'club': club.id, 'watch': watch.id}) || 0;
                    var ds = datasets2[watchIndex];
                    ds.label.push(watch.name + ': ' + count.toLocaleString('en-US'));
                    ds.fillColor.push(watch.color);
                    ds.data.push(count);
                });
                chartData2.labels.push(club.name + ' (' + club.sport.name + ')');
            });
            
            $scope.graphs.watch = {
                legends:data.legends,
               
                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
        }

        function prepareWalkData(data){
            data = $scope.prepareChartData(data, {
                'sport': $scope.parameters.sport,
                'club': $scope.parameters.sport,
                'walk': $scope.parameters.walk
            });
            

            var datasets2 = data.legends.walk.map(function(){
                return { label:[], fillColor:[], data:[] }
            });
            var chartData2 = {labels:[],datasets:datasets2};

            data.legends.club.forEach(function(club) {
                data.legends.walk.forEach(function (walk, walkIndex) {
                    var count = data.getCount({'sport': club.sport.id, 'club': club.id, 'walk': walk.id}) || 0;
                    var ds = datasets2[walkIndex];
                    ds.label.push(walk.name + ': ' + count.toLocaleString('en-US'));
                    ds.fillColor.push(walk.color);
                    ds.data.push(count);
                });
                chartData2.labels.push(club.name + ' (' + club.sport.name + ')');
            });
            
            $scope.graphs.walk = {
                legends:data.legends,
                
                chartData2:{
                    data:chartData2,
                    options:{
                        showLabels: false, // : $scope.formatValue,
                        scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    }
                }
            };
        }



    }

}());
