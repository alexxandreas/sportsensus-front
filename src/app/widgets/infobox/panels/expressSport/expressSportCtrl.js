(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .controller('expressSportCtrl', expressSportCtrl);

    expressSportCtrl.$inject = [
        '$scope',
        '$controller',
        'ParamsSrv',
        'ApiSrv',
        'graphHelpersSrv'
    ];

    function expressSportCtrl(
        $scope,
        $controller,
        ParamsSrv,
        ApiSrv,
        graphHelpersSrv
    ) {

        $controller('baseGraphCtrl', {$scope: $scope});

		
		$scope.setParams = function(params){
            $scope.prepareLegends();
            updateCaption();
		}
		

        function updateCaption(){
            $scope.caption = ParamsSrv.getSelectedSportCaption(true);
        }
        
        $scope.sportDatas = {};
        
        function requestData(sport) { // sport from legend
            var audience = ParamsSrv.getSelectedAudience();
            var clubs = sport.clubs ? sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
            
            ApiSrv.getExpressSport(audience, sport.id, clubs).then(function (data) {
                $scope.prepareSportData(sport, data);
            }).finally(function(){
                $scope.showPreloader = false;
            });
        }

        $scope.prepareLegends = function () {
            $scope.sportLegend = graphHelpersSrv.getSportLegend({sport:$scope.parameters.sport, color:'#555555', clubs:true, selectAll:false});
            //    .filter(function(sport){return !!sport.clubs;});

            $scope.sportLegend.forEach(function(sport){
                $scope.$watch(function(){return sport;}, function(sport, oldValue){
                    if (sport.selected){
                        $scope.sportDatas[sport.id] = {
                            sport: sport,
                            //clubs: sport.clubs.filter(function(club){return club.selected;}),
                            clubNames: sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.name; }).join(', ')
                        };
                        requestData(sport);
                    } else {
                        $scope.sportDatas[sport.id] = null;
                    }
                }, true);
            });

            //$scope.$watch('sportLegend', $scope.updateGraph, true);
        };

        $scope.checkSport = function(item){
            item.selected = !item.selected;
        };

        $scope.prepareSportData = function(sport, data){
            if (!$scope.sportDatas[sport.id]) return;

            $scope.sportDatas[sport.id].data = data;

            data.avg_age_text = Math.round(data.avg_age*100)/100  + ' лет';
            data.avg_children_text = Math.round(data.avg_children*100)/100 + ' ребёнка';
            data.avg_income_text = Math.round(data.avg_income) + ' ₽';

            data.trc_text = Math.round(data.trc*100)/100  + '%';
            data.mobile_hours_text = Math.round(data.mobile_hours*10)/10;
            data.game_text = Math.round(data.game*100)/100 + '%';

            data.bank_text = Math.round(data.bank*100)/100  + '%';
            data.gas_persent_text = Math.round(data.gas_persent*100)/100 + '%';
            data.gas_persent_header = 'Заправляются на БИПИ';

            //data.car_text = Math.round(data.car*100)/100 + '%';
            var gasStation = findById($scope.parameters.gasoften, data.gas_station);
            data.gas_persent_header = 'Заправляются на ' + (gasStation ? gasStation.name : '');


            ////////////////////////////////////////////////////
            //         Занятость
            ////////////////////////////////////////////////////

            var careerData = data.career ? $scope.prepareChartData(data.career, {
                'career': $scope.parameters.career
            }) : null;

            var dataDs = { label:[], fillColor:[], data:[] };
            //var emptyDs = { label:[], fillColor:[], data:[] };
            var chartData = {labels:[],datasets:[dataDs]}; //, emptyDs]};

            careerData.legends.career.forEach(function(career){
                career.data = {
                    count: careerData.getCount({'career': career.id})
                }
            });
            careerData.legends.career.sort(function(a,b){
                return a.data.count - b.data.count;
            });

            careerData.legends.career.forEach(function(career){
                //dataDs.label.push($scope.formatValue(career.data.count));//career.name);//region.name);
                dataDs.label.push(career.name + ': ' + career.data.count.toLocaleString('en-US'));//region.name);
                dataDs.fillColor.push("#4ac0b6");//career.color);
                //var count = regionsData.getCount({'region': region.id});
                dataDs.data.push(career.data.count);

                // emptyDs.label.push(region.name);
                // emptyDs.fillColor.push(region.color);
                // emptyDs.data.push(0);

                chartData.labels.push(career.name);
            });

            data.careerLegend = careerData.legends.career;

            data.careerChart = {
                data:chartData,
                options:{
                    showLabels: false, // : $scope.formatValue,
                    //stacked: false,
                    barHeight: 600,
                    scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                }
            };

            ////////////////////////////////////////////////////
            //         Регионы проживания
            ////////////////////////////////////////////////////

            var regionsData = data.region ? $scope.prepareChartData(data.region, {
                'region': $scope.parameters.region
                //'sport': $scope.parameters.sport
            }) : null;

            //regionsData.legends.region.forEach()
            var allCount = regionsData.getCount();

            regionsData.legends.region.forEach(function(region){
                region.selected = true;
                var count = regionsData.getCount({'region': region.id});
                region.data = {
                    count: count,
                    percent: count/allCount*100
                };
            });
            regionsData.legends.region.sort(function(a,b){return a.data.count - b.data.count; });


            var dataDs = { label:[], fillColor:[], data:[] };
            //var emptyDs = { label:[], fillColor:[], data:[] };
            var chartData = {labels:[],datasets:[dataDs]};//, emptyDs]};

            regionsData.legends.region.forEach(function(region){
                //dataDs.label.push($scope.formatValue(region.data.count));//region.name);
                dataDs.label.push(region.name + ': ' + region.data.count.toLocaleString('en-US'));
                dataDs.fillColor.push('#4ac0b6');
                //var count = regionsData.getCount({'region': region.id});
                dataDs.data.push(region.data.count);

                // emptyDs.label.push(region.name);
                // emptyDs.fillColor.push(region.color);
                // emptyDs.data.push(0);

                chartData.labels.push(region.name);
            });

            data.regionsLegend = regionsData.legends.region;

            data.regionsChart = {
                data:chartData,
                options:{
                    showLabels: false, // : $scope.formatValue,
                    //stacked: false,
                    barHeight: 600,
                    scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                }
            };


            ////////////////////////////////////////////////////
            //         Потребительское поведение
            ////////////////////////////////////////////////////



            function findById(params, id){
                var result = null;
                params.lists.some(function(obj){
                    if (obj.id == id){
                        result = obj;
                        return true;
                    }
                });
                return result;
            }

            
            data.tvHomeChart = {
                text:"Телевидение",
                chartData: [],
                options: {
                    percentageInnerCutout: 70
                }
            };
            data.tvHomeLegend = [];
            data.tvhome.data.forEach(function(item){
                var itemIndex = item.legend[0];
                var itemObj = findById($scope.parameters.tvhome, itemIndex);
                data.tvHomeChart.chartData.push({
                    //label: itemObj && itemObj.name,
                    label: (itemObj && itemObj.name) + ': ' + item.count.toLocaleString('en-US'),
                    color: itemObj && itemObj.chartColor,
                    value: item.count || 0
                });
                data.tvHomeLegend.push({
                    //id: list.id,
                    name: itemObj.name,
                    color: itemObj.chartColor
                });
            });
           

            data.electronicsChart = {
                text:"Владение устройствами",
                chartData: [],
                options: {
                    percentageInnerCutout: 70
                }
            };
            data.electronicsLegend = [];
            data.electronics.data.forEach(function(item){
                var itemIndex = item.legend[0];
                var itemObj = findById($scope.parameters.electronics_exist, itemIndex);
                data.electronicsChart.chartData.push({
                    //label: itemObj && itemObj.name,
                    label: (itemObj && itemObj.name) + ': ' + item.count.toLocaleString('en-US') ,
                    color: itemObj && itemObj.chartColor,
                    //highlight: "#78acd9",
                    value: item.count || 0
                });
                data.electronicsLegend.push({
                    name: itemObj.name,
                    color: itemObj.chartColor
                });
            });

            var carPercent = Math.round(data.car);
            data.carChart = {
                text:"Владение автомобилем",
                chartData: [{
                    //label: 'Владеют',
                    label: 'Владеют: ' + carPercent + '%',
                    legend: 'Владеют',
                    color: "#2CA02C",
                    value: carPercent
                },{
                    //label: 'Не владеют',
                    label: 'Не владеют: ' + (100-carPercent) + '%',
                    legend: 'Не владеют',
                    color: "#D62728",
                    value: 100 - carPercent
                }],
                options: {
                    percentageInnerCutout: 70
                }
            };
            data.carLegend = data.carChart.chartData.map(function(item){
                return {
                    name: item.legend,
                    color: item.color
                }
            });

            ////////////////////////////////////////////////////
            //         Сила боления для каждого клуба
            ////////////////////////////////////////////////////


            var walkData = data.walk ? $scope.prepareChartData(data.walk, {
                'walk': $scope.parameters.walk,
                'club': $scope.parameters.sport,
                sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            var watchData = data.watch ? $scope.prepareChartData(data.watch, {
                'watch':$scope.parameters.watch,
                'club':$scope.parameters.sport,
                sportId: sport.id
                //'sport': $scope.parameters.sport
            }) : null;

            if (walkData && watchData){

                var clubs = walkData.legends.club.filter(function(club){
                    return watchData.legends.club.some(function(club2){
                        return club2.id == club.id;
                    })
                });

                data.clubs = [];
                clubs.forEach(function(club){
                    var ds1 = { label:[], fillColor:[], data:[] };
                    var ds2 = { label:[], fillColor:[], data:[] };
                    var chartData = {labels:[],datasets:[ds1, ds2]};
                    //cl.walkWatchChart.data = chartData;

                    data.clubs.push({
                        club:club,
                        walkLegend: walkData.legends.walk,
                        watchLegend: watchData.legends.watch,
                        walkWatchChart: {
                            data:chartData,
                            options:{
                                showLabels: false, // : $scope.formatValue,
                                //scaleLabel: function(obj){return $scope.formatValue(obj.value)},
                                stacked:false,

                                responsive: false,
                                barShowStroke: true,
                                scaleBeginAtZero: false,
                                //scaleShowGridLines : false,
                                //scaleShowHorizontalLines: false,
                                //barWidth: 30,
                                //barHeight: 500,
                                //barValueSpacing: 20,
                                barHeight: 600,
                                showHorisontalSerifs: false,
                                barsInOneLine: true,

                                //padding: 40,
                                //Boolean - Whether to show vertical lines (except Y axis)
                                scaleShowVerticalLines: false,
                                scaleLabel: function(obj){
                                    var value = Math.abs(obj.value);
                                    //return value > 1000*1000 ? value/1000/1000+'M' : value > 1000 ? value/1000+'K' : value;
                                    return value + '%';
                                },
                                scaleStartValue: -100,
                                scaleOverride: true,
                                scaleSteps: 10,
                                scaleStepWidth: 20
                                //scaleStopValue: 100

                    //barValueSpacing : -10,
                                
                            }
                        }
                    });

                    var indexes = walkData.legends.walk.map(function(item){return item.id;})
                        .concat(watchData.legends.watch.map(function(item){return item.id;}))
                        .filter(function(id, pos, arr){return arr.indexOf(id) == pos})
                        .sort();


                    //walkData.legends.walk.
                    var walkCount = walkData.getCount({'club':club.id});
                    var watchCount = watchData.getCount({'club':club.id});

                    function getPercent(value, sum){
                        var result = Math.round(value / sum * 100 * 10) / 10;
                        return result;
                    }

                    indexes.forEach(function(index){
                        var walk = walkData.legends.walk.filter(function(item){return item.id == index;})[0];
                        var watch = watchData.legends.watch.filter(function(item){return item.id == index;})[0];

                        var count = walkData.getCount({'club':club.id, 'walk':index});
                        var percent = getPercent(count,walkCount);
                        //ds1.label.push(count);
                        ds1.label.push('Ходил, '+ walk.name + ': ' + percent + '% (' + count.toLocaleString('en-US') + ')');
                        ds1.fillColor.push(walk ? walk.color || walk.chartColor : '#777777'); //club.color);
                        //ds1.data.push(-1*walkData.getCount({'club':club.id, 'walk':index}));
                        ds1.data.push(-1*percent);

                        count = watchData.getCount({'club':club.id, 'watch':index});
                        percent = getPercent(count, watchCount);
                        //ds2.label.push(count);
                        ds2.label.push('Смотрел, '+ watch.name + ': ' + percent + '% (' + count.toLocaleString('en-US') + ')');
                        ds2.fillColor.push(watch ?  watch.color || watch.chartColor : '#777777'); //club.color);
                        //ds2.data.push(watchData.getCount({'club':club.id, 'watch':index}));
                        ds2.data.push(percent);

                        chartData.labels.push('');
                    });

                }); // clubs
            }



        };

/*

        $scope.prepareData = function (data) {

            var images = {};
            $scope.parameters.image.lists.forEach(function (list) {
                images[list.id] = {
                    id: list.id,
                    name: list.name,
                    count: 0
                }
            });

            var sports = {};
            $scope.parameters.sport.lists.forEach(function (list) {
                sports[list.key] = angular.merge({
                    data: angular.merge({}, images)
                }, list);
            });

            var legendIndexes = {};
            data.legends.forEach(function(item, index){
                legendIndexes[item.name] = index;
            });
            var maxValue = 0;
            data.data.forEach(function (item) {
                var sportId = item.legend[legendIndexes['sport']];
                var imageId = item.legend[legendIndexes['image']];
                sports[sportId].data[imageId].count += item.count;
                maxValue = Math.max(maxValue, sports[sportId].data[imageId].count);
            }, this);
            var multiplier = maxValue > 1000*1000 ? 1000*1000 : maxValue > 1000 ? 1000 : 1;

            // $scope.sportDatas = {};
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

            var images = $scope.imageLegend;
            // var image = $scope.imageLegend.filter(function(item) {
            //     return item.selected;
            // });




            /!*Object.keys(sports).forEach(function (sportId) { // цикл по спортам
             var sport = sports[sportId];
             var maxValue = 0;
             var axisData = [];
             Object.keys(sport.data).forEach(function (imageId) { // цикл по восприятиям
             var value = sport.data[imageId].count / 1000 / 1000;
             value = Math.round(value * 10) / 10;
             axisData.push({axis: images[imageId].name, value: value});
             maxValue = Math.max(maxValue, value);
             }, this);
             //graph.push(axisData);
             //localColors.push(sport.chartColor);

             var sportData = {
             axisData: axisData,
             maxValue: maxValue
             };
             $scope.sportDatas[sport.id] = sportData;
             }, this);
             *!/

            var chartData = [];
            var localColors = [];
            var maxValue = 0;
            //$scope.sportLegend.forEach(function (item) {
            //if (!item.selected) return;
            sports.forEach(function(sport){
                //var maxValue = 0;
                var axisData = [];
                var data = $scope.chartsData.sports[sport.key].data;
                images.forEach(function(image){
                    //Object.keys(images).forEach(function (imageId) { // цикл по восприятиям
                    // var value = sport.data[imageId].count / 1000 / 1000;
                    var value = $scope.chartsData.sports[sport.key].data[image.id].count;
                    //var value = sport.data[imageId].count;
                    //value = Math.round(value * 10) / 10;
                    //axisData.push({axis: images[imageId].name, value: value});
                    axisData.push({axis: image.name, value: value});
                    maxValue = Math.max(maxValue, value);
                }, this);
                //graph.push(axisData);
                //localColors.push(sport.chartColor);

                // var sportData = {
                //     axisData: axisData,
                //     maxValue: maxValue
                // };
                // $scope.sportDatas[sport.id] = sportData;

                //chartData.push($scope.sportDatas[item.id].axisData);
                chartData.push(axisData);
                localColors.push(sport.color);
                //maxValue = Math.max(maxValue, $scope.sportDatas[item.id].maxValue);
            });

            // округляем до 5 в большую сторону
            //maxValue = Math.ceil(maxValue / 5) * 5;
            var multiplier = 1;
            while (maxValue > 100){
                multiplier *= 10;
                maxValue /= 10;
            }
            maxValue = Math.ceil(maxValue / 5) * 5 * multiplier;

            var radarChartOptions = {
                //w: width,
                //h: height,
                //margin: margin,
                maxValue: maxValue,
                levels: 5,
                wrapWidth: 100,
                labelFactor: 1.32,
                roundStrokes: true,
                //color: color
                format: $scope.formatValue,
                color: function (i) {
                    return localColors[i];
                }
            };

            if (chartData && chartData.length)
                $scope.chart = {data: chartData, options: radarChartOptions};
            else $scope.chart = null;
        };
*/

    }

}());
