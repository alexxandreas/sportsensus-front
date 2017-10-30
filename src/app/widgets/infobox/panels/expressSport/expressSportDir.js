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
        '$mdMedia',
        'PluralSrv'
    ];

    function expressSportDir(
        $rootScope,
        $mdMedia,
        PluralSrv
    )    {
        return {
            restrict: 'E',
            scope: {
                sport: '='
                // columnsLayout: '=?',
            },
            templateUrl: '/views/widgets/infobox/panels/expressSport/expressSportNew2.html',
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
                    
                    
                    
                    
                    
                    
                    var mainThemeColors = ['#287177', '#287177', '#399997', '#399997', '#4ac0b6', '#4ac0b6', '#85ddd0', '#85ddd0', '#a0efe2', '#a0efe2'];
                    

		            // данные перезапрашиваются каждый раз при изменении радара
            		$scope.setParams = function(params){
                        requestData();
                        //updateCaption();
            		}
            		
            		$scope.setGraphsMode = function(graphMode){
                        prepareSportData();
                    }
                    
                    // function updateCaption(){
                    //     $scope.caption = ParamsSrv.getSelectedSportCaption(true);
                    //     $scope.clubNames = $scope.sport.clubs
                    //         ? $scope.sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.name; }).join(', ')
                    //         : null
                    // }
        
                    
                    
                    function requestData() { // $scope.sport from legend
                        if (!$scope.sport) return;
                        
                        var audience = ParamsSrv.getSelectedAudience();
                        var clubs = $scope.sport.clubs ? $scope.sport.clubs.filter(function(club){return club.selected;}).map(function(club){return club.id; }) : [];
                        
                        ApiSrv.getExpressSport(audience, $scope.sport.id, clubs).then(function (data) {
                            $scope.serverData = data;
                            prepareSportData();
                        }).finally(function(){
                            $scope.showPreloader = false;
                        });
                    }
                    
                    
                    function prepareSportData(){
                        if (!$scope.serverData) return;
                        
                        
                        $scope.graphs = {};
                        
                        prepareSummary($scope.serverData);
                        prepareCareer($scope.getGraphData($scope.serverData, 'career'));      
                        prepareRegions($scope.getGraphData($scope.serverData, 'region'));      
                        prepareFanType($scope.getGraphData($scope.serverData, 'fan_type'));
                        prepareTvHome($scope.getGraphData($scope.serverData, 'tvhome'));           
                        prepareElectronics($scope.getGraphData($scope.serverData, 'electronics'));  
                        prepareCar($scope.serverData.car);              
                        prepareVisit($scope.getGraphData($scope.serverData, 'time_week'));
                        prepareGaming($scope.serverData.game);
                        prepareMobile($scope.serverData.mobile_hours);
                        prepareGasStation($scope.getGraphData($scope.serverData, 'gasoften'));
                        prepareServicesNow($scope.getGraphData($scope.serverData, 'services_now'));

                    }
                    
                    
                    
                    function prepareSummary(data) {
                        
                        $scope.summaryIncome = data.avg_income;
                        $scope.summaryAge = Math.round(data.avg_age);
                        $scope.summaryAgeText = PluralSrv(['год','года','лет'], $scope.summaryAge); 
                        $scope.summaryChildren = Math.round(data.avg_children*10)/10;
                        
                        // TODO не приходят данные с бекенда!
                        $scope.summaryFamilysize = Math.round(data.familysize*10)/10;
                        
                    }
                    
                    
                    // Род дейтельности
                    function prepareCareer(data) {
                        var colors = ['#399997', '#a0efe2', '#4ac0b6', '#324766', '#ffc85a', '#fd9276', '#bc1d0d', '#d3d7dd'];
                        data = $scope.prepareChartData(data, {
                            'career': $scope.parameters.career
                        });
                        
                        var items = [];
                        
                        data.legends.career.forEach(function (career, careerIndex) {
                            var count = data.getCount({'career': career.id});
                            items.push({
                                // label: career.name + ': ' + count.toLocaleString('en-US'),
                                // color: career.color,
                                value: count,
                                // valueText: count.toLocaleString('en-US'),
                                valueText: $scope.formatCount(count),
                                text: career.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        items.forEach(function(item, index){
                            item.color = colors[index % colors.length];
                        });
                        
                        $scope.careerItems = items;
                        $scope.careerDonutChart = {
                            items: items
                        }
                    }
                    
                    // Регионы проживания
                    function prepareRegions(data) {
                        //var colors = ['#287177', '#287177', '#399997', '#399997', '#4ac0b6'];
                        var data = $scope.prepareChartData(data, {
                            'region': $scope.parameters.region
                            //'sport': $scope.parameters.sport
                        });
            
                        //data.legends.region.forEach()
                        var allCount = data.getCount();
                        
                        var items = [];
                        
                        data.legends.region.forEach(function(region){
                            region.selected = true;
                            var count = data.getCount({'region': region.id});
                            items.push({
                                id: region.id,
                                selected: true, // для карты
                                leftText: region.name,
                                rightText: $scope.formatCount(count),
                                value: count,
                                //color: '#fc4a1a',
                                // text: region.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        items.forEach(function(item, index){
                            item.color = mainThemeColors[index % mainThemeColors.length];
                        });
                        
                        $scope.regionsCount = items.length;
                        $scope.regionsItems = items;
                        $scope.regionsMapChart = {
                            items: items
                        }
                        $scope.regionsBarsChart = {
                            items: items
                        }
                    }
                    
                    function prepareFanType(data){
                        data.legends[0].name = 'fan_type';
                        
                        data = $scope.prepareChartData(data, {
                            'fan_type': $scope.parameters.fan_type
                        });
                        
                        var items = [];
                        
                        data.legends.fan_type.forEach(function (fanType, fanTypeIndex) {
                            var count = data.getCount({'fan_type': fanType.id});
                            items.push({
                                // label: career.name + ': ' + count.toLocaleString('en-US'),
                                color: fanType.color,
                                value: count,
                                // valueText: count.toLocaleString('en-US'),
                                valueText: $scope.formatCount(count),
                                text: fanType.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        // items.forEach(function(item, index){
                        //     item.color = colors[index % colors.length];
                        // });
                        
                        $scope.fanTypeItems = items;
                        $scope.fanTypeDonutChart = {
                            items: items
                        }
                    }
                    
                    
                    
                    // Владение разного рода платным ТВ
                    function prepareTvHome(data) {
                        
                        data = $scope.prepareChartData(data, {
                            'tvhome': $scope.parameters.tvhome
                        });
                        
                        var items = [];
                        
                        data.legends.tvhome.forEach(function (tvHome, tvhomeIndex) {
                            var count = data.getCount({'tvhome': tvHome.id});
                            items.push({
                                // label: career.name + ': ' + count.toLocaleString('en-US'),
                                color: tvHome.color,
                                value: count,
                                // valueText: count.toLocaleString('en-US'),
                                valueText: $scope.formatCount(count),
                                text: tvHome.name
                            });
                        });
                        
                        $scope.tvHomeItems = items;
                        $scope.tvHomeDonutChart = {
                            items: items
                        }
                    }
                    
                   
                    
                    // Владение устройствами
                    function prepareElectronics(data){

                        data = $scope.prepareChartData(data, {
                            'electronics': $scope.parameters.electronics_exist
                        });
            
                        var items = [];
                        
                        data.legends.electronics.forEach(function (electronics, electronicsIndex) {
                            var count = data.getCount({'electronics': electronics.id});
                            items.push({
                                // label: career.name + ': ' + count.toLocaleString('en-US'),
                                color: electronics.color,
                                value: count,
                                // valueText: count.toLocaleString('en-US'),
                                valueText: $scope.formatCount(count),
                                text: electronics.name
                            });
                        });
                        
                        $scope.electronicsItems = items;
                        $scope.electronicsDonutChart = {
                            items: items
                        }
            
                    }
                    
                    
                     // Владение автомобилем
                    function prepareCar(data) {
                        
                        var carPercent = Math.round(data);
                        
                        $scope.autoClass = 'auto-icon-' + (Math.round(carPercent/10) * 10);
                        $scope.autoYesText = carPercent + '%';
                        $scope.autoNoText = (100 - carPercent) + '%';
                    }
                    
                    
                    //  посещение ТРЦ/кинотеатров/фитнеса. график - бар
                    function prepareVisit(data){
                        // data = {
                        //     "data": [
                        //         {
                        //             "count": 10,
                        //             "legend": [1]
                        //         },
                        //         {
                        //             "count": 20,
                        //             "legend": [2]
                        //         },
                        //         {
                        //             "count": 30,
                        //             "legend": [3]
                        //         },
                        //         {
                        //             "count": 40,
                        //             "legend": [4]
                        //         }
                        //     ],
                        //     "legends": [
                        //         {
                        //             "name": "time_week",
                        //             "is_audience": false
                        //         }
                        //     ]
                        // }
            
                        
                        data = $scope.prepareChartData(data, {
                            'time_week': $scope.parameters.time_week
                        });
             
                        var items = [];
                        
                        data.legends.time_week.forEach(function (timeWeek, timeWeekIndex) {
                            var count = data.getCount({'time_week': timeWeek.id});
                            items.push({
                                // label: career.name + ': ' + count.toLocaleString('en-US'),
                                // color: timeWeek.color,
                                value: count,
                                // valueText: count.toLocaleString('en-US'),
                                // valueText: $scope.formatCount(count),
                                leftText: timeWeek.name,
                                rightText: $scope.formatCount(count),
                                // text: timeWeek.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        items.forEach(function(item, index){
                            item.color = mainThemeColors[index % mainThemeColors.length];
                        });
                        
                        
                        $scope.timeWeekItems = items;
                        $scope.timeWeekBarsChart = {
                            items: items
                        }
                    }
                    
                    
                    function prepareGaming(data){
                        $scope.gamingText = Math.round(data) + '%';
                    }
                    
                    function prepareMobile(data){
                        // $scope.mobileText = '87%';
                        $scope.mobileText = Math.round(data*10)/10 + 'ч';
                    }
                    
                    
                    function prepareGasStation(data) { // gasoften
                        // data = {
                        //     "data": [
                        //         {
                        //             "count": 10,
                        //             "legend": [1]
                        //         },
                        //         {
                        //             "count": 20,
                        //             "legend": [2]
                        //         },
                        //         {
                        //             "count": 30,
                        //             "legend": [3]
                        //         },
                        //         {
                        //             "count": 40,
                        //             "legend": [4]
                        //         }
                        //     ],
                        //     "legends": [
                        //         {
                        //             "name": "gasoften",
                        //             "is_audience": false
                        //         }
                        //     ]
                        // }
                        data.legends[0].name = 'gasoften';
                        
                        data = $scope.prepareChartData(data, {
                            'gasoften': $scope.parameters.gasoften
                        });
             
                        var items = [];
                        
                        data.legends.gasoften.forEach(function (gasoften, gasoftenIndex) {
                            var count = data.getCount({'gasoften': gasoften.id});
                            items.push({
                                // label: career.name + ': ' + count.toLocaleString('en-US'),
                                // color: timeWeek.color,
                                value: count,
                                // valueText: count.toLocaleString('en-US'),
                                // valueText: $scope.formatCount(count),
                                leftText: gasoften.name,
                                rightText: $scope.formatCount(count),
                                // text: timeWeek.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        items.forEach(function(item, index){
                            item.color = mainThemeColors[index % mainThemeColors.length];
                        });
                        
                        $scope.gasoftenCount = items.length;
                        $scope.gasoftenItems = items;
                        $scope.gasoftenBarsChart = {
                            items: items
                        }
                    }
                    
                    // топ-5 финансовых продуктов. график -  бар
                    function prepareServicesNow(data) {
                        
                        // data = {
                        //     "data": [
                        //         {
                        //             "count": 10,
                        //             "legend": [1]
                        //         },
                        //         {
                        //             "count": 20,
                        //             "legend": [2]
                        //         },
                        //         {
                        //             "count": 30,
                        //             "legend": [3]
                        //         },
                        //         {
                        //             "count": 40,
                        //             "legend": [4]
                        //         },
                        //         {
                        //             "count": 50,
                        //             "legend": [5]
                        //         }
                        //     ],
                        //     "legends": [
                        //         {
                        //             "name": "services_now",
                        //             "is_audience": false
                        //         }
                        //     ]
                        //}

                        
                        data = $scope.prepareChartData(data, {
                            'services_now': $scope.parameters.services_now
                        });
                        
                         var items = [];
                        
                        data.legends.services_now.forEach(function (service, serviceIndex) {
                            var count = data.getCount({'services_now': service.id});
                            items.push({
                                // label: career.name + ': ' + count.toLocaleString('en-US'),
                                // color: timeWeek.color,
                                value: count,
                                // valueText: count.toLocaleString('en-US'),
                                // valueText: $scope.formatCount(count),
                                leftText: service.name,
                                rightText: $scope.formatCount(count),
                                // text: timeWeek.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        items.forEach(function(item, index){
                            item.color = mainThemeColors[index % mainThemeColors.length];
                        });
                        
                        $scope.serviceCount = items.length;
                        $scope.serviceItems = items;
                        $scope.serviceBarsChart = {
                            items: items
                        }
                        
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