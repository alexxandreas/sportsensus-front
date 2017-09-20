(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('expressSportDir', expressSportDir);

    expressSportDir.$inject = [
        '$rootScope',
        '$mdMedia'
    ];

    function expressSportDir(
        $rootScope,
        $mdMedia
    )    {
        return {
            restrict: 'E',
            scope: {
                sport: '='
                // columnsLayout: '=?',
            },
            templateUrl: '/views/widgets/infobox/panels/expressSport/expressSportNew.html',
            link: function ($scope, $el, attrs) {
                //if (angular.isUndefined($scope.selectable))
                //   $scope.selectable = true;
            },

            controller: [
                '$scope',
                '$controller',
                'ApiSrv',
                'ParamsSrv',
                'PluralSrv',
    
                function(
                    $scope,
                    $controller,
                    ApiSrv,
                    ParamsSrv,
                    PluralSrv
                ){
                    
                    $controller('baseGraphCtrl', {$scope: $scope});

		            // данные перезапрашиваются каждый раз при изменении радара
            		$scope.setParams = function(params){
                        requestData();
                        updateCaption();
            		}
            		
            		$scope.setGraphsMode = function(graphMode){
                        prepareSportData();
                    }
                    
                    function updateCaption(){
                        $scope.caption = ParamsSrv.getSelectedSportCaption(true);
                        $scope.clubNames = $scope.sport.clubs
                            ? $scope.sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.name; }).join(', ')
                            : null
                    }
        
                    // $scope.$watch('sport', function(){
                    //     requestData();
                    // });
                    
                    
                    function requestData() { // $scope.sport from legend
                        if (!$scope.sport) return;
                        
                        var audience = ParamsSrv.getSelectedAudience();
                        var clubs = $scope.sport.clubs ? $scope.sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
                        
                        ApiSrv.getExpressSport(audience, $scope.sport.id, clubs).then(function (data) {
                            $scope.serverData = data;
                            prepareSportData();
                            //$scope.serverData = data;
                            //prepareGraphs()
                        }).finally(function(){
                            $scope.showPreloader = false;
                        });
                    }
                    
                    
                    function prepareSportData(){
                        if (!$scope.serverData) return;
                        
                        $scope.graphs = {};
                        
                        //prepareFanTypeData($scope.getGraphData($scope.serverData, 'fan_type'));      
                        prepareCareer($scope.getGraphData($scope.serverData, 'career'));           
                        prepareTvHome($scope.getGraphData($scope.serverData, 'tvhome'));           
                        // prepareCar($scope.getGraphData($scope.serverData, 'car'));              
                        prepareCar($scope.serverData.car);              
                        prepareElectronics($scope.getGraphData($scope.serverData, 'electronics'));  
                      
                        prepareVisit();
                        prepareServicesNow();
                    }
                    
                    // Род дейтельности
                    function prepareCareer(data) {
                        
                        data = $scope.prepareChartData(data, {
                            'career': $scope.parameters.career
                        });
                        
            
                        var chartData = [];
            
                        data.legends.career.forEach(function (career, careerIndex) {
                            var count = data.getCount({'career': career.id});
                            chartData.push({
                                label: career.name + ': ' + count.toLocaleString('en-US'),
                                color: career.color,
                                value: count
                            });
                        });
            
                        $scope.graphs.career = {
                            legends:data.legends,
                            label: "Род дейтельности",
                            chart:{
                                chartData: chartData,
                                // text:'222',// текст внутри бублика
                                options: {
                                    percentageInnerCutout: 70
                                }
                            }
                        };
                    }
                    
                    
                    // Владение разного рода платным ТВ
                    function prepareTvHome(data) {
                        
                        data = $scope.prepareChartData(data, {
                            'tvhome': $scope.parameters.tvhome
                        });
                        
            
                        var chartData = [];
            
                        data.legends.tvhome.forEach(function (tvhome, tvhomeIndex) {
                            var count = data.getCount({'career': tvhome.id});
                            chartData.push({
                                label: tvhome.name + ': ' + count.toLocaleString('en-US'),
                                color: tvhome.color,
                                value: count
                            });
                        });
            
                        $scope.graphs.tvhome = {
                            legends:data.legends,
                            label: "Владение разного рода платным ТВ",
                            chart:{
                                chartData: chartData,
                                // text:'222',// текст внутри бублика
                                options: {
                                    percentageInnerCutout: 70
                                }
                            }
                        };
                    }
                    
                    // Владение автомобилем
                    function prepareCar(data) {
                        
                        var carPercent = Math.round(data);
   
                        var chartData = [{
                            label: 'Владеют: ' + carPercent + '%',
                            legend: 'Владеют',
                            color: "#2CA02C",
                            value: carPercent
                        },{
                            label: 'Не владеют: ' + (100-carPercent) + '%',
                            legend: 'Не владеют',
                            color: "#D62728",
                            value: 100 - carPercent
                        }]
                        
                        var legend = chartData.map(function(item){
                            return {
                                name: item.legend,
                                color: item.color
                            }
                        });
                        
                        
                        $scope.graphs.car = {
                            legends: {car: legend},
                            label: "Владение автомобилем",
                            chart:{
                                chartData: chartData,
                                text:"Владение автомобилем",
                                options: {
                                    percentageInnerCutout: 70
                                }
                            }
                        };
                    }
                    
                    // Владение устройствами
                    function prepareElectronics(data){

                        data = $scope.prepareChartData(data, {
                            'electronics': $scope.parameters.electronics_exist
                        });
            
                        var dataset = { label:[], fillColor:[], data:[] };
                        var chartData = {labels:[], datasets:[dataset]};
                        
                        
                        data.legends.electronics.forEach(function (electronics, electronicsIndex) {
                            var count = data.getCount({'electronics': electronics.id});
                            dataset.label.push(electronics.name + ': ' + count.toLocaleString('en-US'));
                            dataset.fillColor.push(electronics.color);
                            dataset.data.push(count);
                            
                            // chartData.labels.push(electronics.name);
                            chartData.labels.push('');
                        });
                        //chartData.labels.push(sport.name);
                        
                        $scope.graphs.electronics = {
                            legends:data.legends,
                            label: "Владение устройствами",
                            chart:{
                                data:chartData,
                                options:{
                                    showLabels: false, // : $scope.formatValue,
                                    stacked: true,
                                    scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                                }
                            }
                        };
                    }
                    
                    
                    //  посещение ТРЦ/кинотеатров/фитнеса. график - бар
                    function prepareVisit(data){
                        data = {
                            "data": [
                                {
                                    "count": 10,
                                    "legend": [1]
                                },
                                {
                                    "count": 20,
                                    "legend": [2]
                                },
                                {
                                    "count": 30,
                                    "legend": [3]
                                },
                                {
                                    "count": 40,
                                    "legend": [4]
                                }
                            ],
                            "legends": [
                                {
                                    "name": "time_week",
                                    "is_audience": false
                                }
                            ]
                        }
            
                        
                        data = $scope.prepareChartData(data, {
                            'time_week': $scope.parameters.time_week
                        });
             
                        var dataset = { label:[], fillColor:[], data:[] };
                        var chartData = {labels:[], datasets:[dataset]};
                        
                        
                        data.legends.time_week.forEach(function (time_week, time_weekIndex) {
                            var count = data.getCount({'time_week': time_week.id});
                            dataset.label.push(time_week.name + ': ' + count.toLocaleString('en-US'));
                            dataset.fillColor.push(time_week.color);
                            dataset.data.push(count);
                            
                            // chartData.labels.push(electronics.name);
                            chartData.labels.push('');
                        });
                        //chartData.labels.push(sport.name);
                        
                        $scope.graphs.time_week = {
                            legends:data.legends,
                            label: "Посещение заведений",
                            chart:{
                                data:chartData,
                                options:{
                                    showLabels: false, // : $scope.formatValue,
                                    stacked: true,
                                    scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                                }
                            }
                        };
                        
                    }
                    
                    // топ-5 финансовых продуктов. график -  бар
                    function prepareServicesNow(data) {
                        //financial
                        data = {
                            "data": [
                                {
                                    "count": 10,
                                    "legend": [1]
                                },
                                {
                                    "count": 20,
                                    "legend": [2]
                                },
                                {
                                    "count": 30,
                                    "legend": [3]
                                },
                                {
                                    "count": 40,
                                    "legend": [4]
                                },
                                {
                                    "count": 50,
                                    "legend": [5]
                                }
                            ],
                            "legends": [
                                {
                                    "name": "services_now",
                                    "is_audience": false
                                }
                            ]
                        }
            
                        
                        data = $scope.prepareChartData(data, {
                            'services_now': $scope.parameters.services_now
                        });
            
                        var dataset = { label:[], fillColor:[], data:[] };
                        var chartData = {labels:[], datasets:[dataset]};
                        
                        
                        data.legends.services_now.forEach(function (services_now, services_nowIndex) {
                            var count = data.getCount({'services_now': services_now.id});
                            dataset.label.push(services_now.name + ': ' + count.toLocaleString('en-US'));
                            dataset.fillColor.push(services_now.color);
                            dataset.data.push(count);
                            
                            // chartData.labels.push(electronics.name);
                            chartData.labels.push('');
                        });
                        //chartData.labels.push(sport.name);
                        
                        $scope.graphs.services_now = {
                            legends:data.legends,
                            label: "Топ-" + data.legends.services_now.length + PluralSrv([' финансовый продукт',' финансовых продукта',' финансовых продуктов'], data.legends.services_now.length),
                            chart:{
                                data:chartData,
                                options:{
                                    showLabels: false, // : $scope.formatValue,
                                    stacked: true,
                                    scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                                }
                            }
                        };
                    }
                    
                    
                    
                    
                    
                    $scope.prepareSportDataOld = function(sport, data){
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
            
                        /*careerData.legends.career.forEach(function(career){
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
                        };*/
            
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
            
                        
                        /*data.tvHomeChart = {
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
                        });*/
                       
            
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
            
                        /*var carPercent = Math.round(data.car);
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
                        });*/
            
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
                    }
                    
                } // end of controller function 
            ]
        };
    }
}());