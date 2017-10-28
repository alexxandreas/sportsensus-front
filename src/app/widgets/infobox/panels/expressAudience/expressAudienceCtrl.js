// (function () {
//     "use strict";
//     /**
//      * @desc
//      */
//     angular.module('SportsensusApp')
//         .controller('expressAudienceCtrl', expressAudienceCtrl);

//     expressAudienceCtrl.$inject = [
//         '$scope',
//         '$controller',
//         'ParamsSrv',
//         'ApiSrv',
//         'PluralSrv'
//     ];

//     function expressAudienceCtrl(
//         $scope,
//         $controller,
//         ParamsSrv,
//         ApiSrv,
//         PluralSrv // 1, 2, 5
//     ) {

//         $controller('baseGraphCtrl', {$scope: $scope});










		
// 		$scope.setParams = function(params){
//             requestData();
//             updateCaption();
// 		}

//         $scope.sportDatas = {};

        
//         $scope.setGraphsMode = function(graphMode){
//             prepareGraphs();
//         }

//         function updateCaption(){
//             $scope.caption = ParamsSrv.getSelectedDemographyCaption();
//         }

//         $scope.serverData = null;
        
//         function requestData(sport) { 
//             var audience = ParamsSrv.getSelectedAudience();
            
//             ApiSrv.getExpressAudience(audience).then(function (data) {
//                 $scope.serverData = data;
//                 prepareGraphs()
                
//             }).finally(function(){
//                 $scope.showPreloader = false;
//             });
//         }
        
//         function prepareGraphs(){
//             if (!$scope.serverData) return;
            
//             $scope.graphs = {};
                
//             // prepareRegionsData();                        // топ-10 регионов. график - карта с легендой
//             prepareFanTypeData($scope.getGraphData($scope.serverData, 'fan_type'));              // распределение по типу боления. график - бублик
//             prepareInterestData($scope.getGraphData($scope.serverData, 'interest'));             // топ-5 по интересу. график - бар
//             prepareInvolveData($scope.getGraphData($scope.serverData, 'involvment'));            // топ-5 по вовлеченности. график - бар.
//             prepareKnownHelpTournamentData($scope.getGraphData($scope.serverData, 'clubs_known_help'));       // топ-5 подсказанного знания турниров (лиг). график - бар
//             prepareKnownTournamentData($scope.getGraphData($scope.serverData, 'clubs_known'));   // топ-5 спонтанного знания турниров (лиг). график - бар
//             prepareKnownHelpClubData($scope.getGraphData($scope.serverData, 'clubs_known_help'));// топ-5 подсказанного знания клубов. график - бар
//             prepareKnownClubData($scope.getGraphData($scope.serverData, 'clubs_known'));         // топ-5 спонтанного знания клубов. график - бар
//             prepareKnownHelpPlayerData($scope.getGraphData($scope.serverData, 'clubs_known_help'));        // топ-5 подсказанного знания спортсменов. график - бар
//             prepareKnownPlayerData($scope.getGraphData($scope.serverData, 'clubs_known'));       // топ-5 спонтанного знания спортсменов. график - бар
//             prepareWatchData($scope.getGraphData($scope.serverData, 'watch'));                   // топ-5 клубов по телесмотрению. график - бар
//             prepareWatchWEBData($scope.getGraphData($scope.serverData, 'watch'));                // топ-5 по смотрению в WEB. график - бар
//             prepareWalkData($scope.getGraphData($scope.serverData, 'walk'));                     // топ-5 клубов по посещаемости. график - бар
//             prepareKnownSponsors($scope.getGraphData($scope.serverData, 'sponsors_known'));      // топ-5 самых упоминаемых спонсоров. график - бар
//         }
        
        
        
//         function getGraphData(key){
//             var graphKey = $scope.selectedGraphMode.graphKey;
            
//             // TODO: заглушка на время отсутствия бекенда
//             var data = $scope.serverData[key];
//             if (!data) return data;
            
//             if (graphKey == '_col'){
//                 var newData = angular.copy(data, {});
//                 var counts = newData.data.map(function(a){return a.count});
//                 var max = Math.max.apply(Math, counts);
//                 angular.forEach(newData.data, function(item){
//                     item.count = item.count / max * 100;
//                 })
//                 return newData;
//             } else if(graphKey == '_row'){
//                 var newData = angular.copy(data, {});
//                 var counts = newData.data.map(function(a){return a.count});
//                 var sum = counts.reduce(function(acc, curr) {return acc + curr;}, 0);
//                 angular.forEach(newData.data, function(item){
//                     item.count = item.count / sum * 100;
//                 })
//                 return newData;
//             }
//             else return data;
           
            
//             return $scope.serverData[key+graphKey];
//         }

//         var colorGenerator = d3.scale.category10();


//         // распределение по типу боления. график - бублик
//         // TODO убрать захардкоженную data
//         function prepareFanTypeData(data) {
//             data = {
//                 "data": [
//                     {
//                         "count": 10,
//                         "legend": [1]
//                     },
//                     {
//                         "count": 20,
//                         "legend": [2]
//                     },
//                     {
//                         "count": 30,
//                         "legend": [3]
//                     },
//                     {
//                         "count": 40,
//                         "legend": [4]
//                     },
//                     {
//                         "count": 50,
//                         "legend": [5]
//                     }
//                 ],
//                 "legends": [
//                     {
//                         "name": "fan_type",
//                         "is_audience": false
//                     }
//                 ]
//             }
            
            
//             data = $scope.prepareChartData(data, {
//                 'fan_type': $scope.parameters.fan_type
//             });

//             var chartData = [];

//             data.legends.fan_type.forEach(function (fanType, fanTypeIndex) {
//                 var count = data.getCount({'fan_type': fanType.id});
//                 chartData.push({
//                     label: fanType.name + ': ' + count.toLocaleString('en-US'),
//                     color: fanType.color,
//                     value: count
//                 });
//             });

//             $scope.graphs.fanType = {
//                 legends:data.legends,
//                 label: "Распределение по типу боления",
//                 chart:{
//                     chartData: chartData,
//                     // text:'222',// текст внутри бублика
//                     options: {
//                         percentageInnerCutout: 70
//                     }
//                 }
//             };
            
//         }


//         // топ-5 по интересу. график - бар
//         function prepareInterestData(data){

//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'interest': $scope.parameters.interest
//             });

            
//             var datasets = data.legends.interest.map(function(){
//                 return { label:[], fillColor:[], data:[] }
//             });
//             var chartData = {labels:[],datasets:datasets};
//             data.legends.sport.forEach(function(sport) {
//                 data.legends.interest.forEach(function (interest, interestIndex) {
//                     var count = data.getCount({'sport': sport.id, 'interest': interest.id});
//                     var ds = datasets[interestIndex];
//                     //ds.label.push('');
//                     ds.label.push(interest.name + ': ' + count.toLocaleString('en-US'));
//                     ds.fillColor.push(interest.color);
//                     ds.data.push(count);
//                 });
//                 chartData.labels.push(sport.name);
//             });

            
//             $scope.graphs.interest = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.sport.length + PluralSrv([' вид',' вида',' видов'], data.legends.sport.length) + " спорта по интересу",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         stacked: true,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }
        
        
        
        

//         // топ-5 по вовлеченности. график - бар.
//         function prepareInvolveData(data){
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'involve': $scope.parameters.involve
//             });

//             // закомментированы бублики
//             // var charts = [];
//             // data.legends.sport.forEach(function(sport) {
//             //     var chart = {
//             //         //sport: sport,
//             //         text:sport.name,
//             //         chartData: [],
//             //         options: {
//             //             percentageInnerCutout: 70
//             //         }
//             //     };
//             //     charts.push(chart);

//             //     data.legends.involve.forEach(function (involve, involveIndex) {
//             //         var count = data.getCount({'sport': sport.id, 'involve': involve.id});
//             //         chart.chartData.push({
//             //             //label: involve.name,
//             //             label: involve.name + ': ' + count.toLocaleString('en-US'),
//             //             color: involve.color,
//             //             //highlight: "#78acd9",
//             //             value: count
//             //         });
//             //     });
//             // });
            
//             var datasets = data.legends.involve.map(function(){
//                 return { label:[], fillColor:[], data:[] }
//             });
//             var chartData = {labels:[],datasets:datasets};
//             data.legends.sport.forEach(function(sport) {
//                 data.legends.involve.forEach(function (involve, involveIndex) {
//                     var count = data.getCount({'sport': sport.id, 'interest': involve.id});
//                     var ds = datasets[involveIndex];
//                     //ds.label.push('');
//                     ds.label.push(involve.name + ': ' + count.toLocaleString('en-US'));
//                     ds.fillColor.push(involve.color);
//                     ds.data.push(count);
//                 });
//                 chartData.labels.push(sport.name);
//             });
            
        
//             $scope.graphs.involve = {
//                 legends: data.legends,
//                 label: "Топ-" + data.legends.sport.length + PluralSrv([' вид',' вида',' видов'], data.legends.sport.length) + " спорта по вовлеченности",
//                 //charts: charts
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         stacked: true,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }
        
        
//         // топ-5 подсказанного знания турниров (лиг). график - бар
//         // TODO сейчас используются данные по знанию клубов
//         function prepareKnownHelpTournamentData(data) {
            
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport
//             });

//             var dataset = { label:[], fillColor:[], data:[] };
//             var chartData = {labels:[],datasets:[dataset]};
//             data.legends.club.forEach(function(club, index) {
//                 var count = data.getCount({'sport': club.sport.id, 'club': club.id});
//                 dataset.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
//                 dataset.fillColor.push(colorGenerator(index));
//                 dataset.data.push(count);

//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });

//             $scope.graphs.knownHelpTournament = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length  + " подсказанное знание турниров (лиг)",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }
        
//         // топ-5 спонтанного знания турниров (лиг). график - бар
//         // TODO сейчас используются данные по знанию клубов
//         function prepareKnownTournamentData(data) {
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport
//             });

//             var dataset = { label:[], fillColor:[], data:[] };
//             var chartData = {labels:[],datasets:[dataset]};

//             data.legends.club.forEach(function(club, index) {
//                 var count = data.getCount({'sport': club.sport.id, 'club': club.id});
//                 dataset.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
//                 dataset.fillColor.push(colorGenerator(index)); //club.color);
//                 dataset.data.push(count);

//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });

//             $scope.graphs.knownTournament = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length  + " спонтанное знание турниров (лиг)",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }
        
//         // топ-5 подсказанного знания клубов. график - бар
//         function prepareKnownHelpClubData(data){
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport
//             });

//             var dataset = { label:[], fillColor:[], data:[] };
//             var chartData = {labels:[],datasets:[dataset]};
//             data.legends.club.forEach(function(club, index) {
//                 var count = data.getCount({'sport': club.sport.id, 'club': club.id});
//                 dataset.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
//                 dataset.fillColor.push(colorGenerator(index));
//                 dataset.data.push(count);

//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });

//             $scope.graphs.knownHelp = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length  + " подсказанное знание клубов",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }
        
//         // топ-5 спонтанного знания клубов. график - бар
//         function prepareKnownClubData(data){
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport
//             });

//             var dataset = { label:[], fillColor:[], data:[] };
//             var chartData = {labels:[],datasets:[dataset]};

//             data.legends.club.forEach(function(club, index) {
//                 var count = data.getCount({'sport': club.sport.id, 'club': club.id});
//                 dataset.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
//                 dataset.fillColor.push(colorGenerator(index)); //club.color);
//                 dataset.data.push(count);

//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });

//             $scope.graphs.known = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length  + " спонтанное знание клубов",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }

//         // топ-5 подсказанного знания спортсменов. график - бар
//         // TODO сейчас используются данные по знанию клубов
//         function prepareKnownHelpPlayerData(data) {
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport
//             });

//             var dataset = { label:[], fillColor:[], data:[] };
//             var chartData = {labels:[],datasets:[dataset]};
//             data.legends.club.forEach(function(club, index) {
//                 var count = data.getCount({'sport': club.sport.id, 'club': club.id});
//                 dataset.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
//                 dataset.fillColor.push(colorGenerator(index));
//                 dataset.data.push(count);

//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });

//             $scope.graphs.knownHelpPlayer = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length  + " подсказанное знание спортсменов",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }
        
//         // топ-5 спонтанное знания спортсменов. график - бар
//         // TODO сейчас используются данные по знанию клубов
//         function prepareKnownPlayerData(data) {
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport
//             });

//             var dataset = { label:[], fillColor:[], data:[] };
//             var chartData = {labels:[],datasets:[dataset]};

//             data.legends.club.forEach(function(club, index) {
//                 var count = data.getCount({'sport': club.sport.id, 'club': club.id});
//                 dataset.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
//                 dataset.fillColor.push(colorGenerator(index)); //club.color);
//                 dataset.data.push(count);

//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });

//             $scope.graphs.knownPlayer = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length  + " спонтанное знание спортсменов",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }


//         // топ-5 клубов по телесмотрению. график - бар
//         function prepareWatchData(data){
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport,
//                 'watch': $scope.parameters.watch
//             });

//             var datasets = data.legends.watch.map(function(){
//                 return { label:[], fillColor:[], data:[] }
//             });
//             var chartData = {labels:[],datasets:datasets};

//             data.legends.club.forEach(function(club) {
//                 data.legends.watch.forEach(function (watch, watchIndex) {
//                     var count = data.getCount({'sport': club.sport.id, 'club': club.id, 'watch': watch.id}) || 0;
//                     var ds = datasets[watchIndex];
//                     ds.label.push(watch.name + ': ' + count.toLocaleString('en-US'));
//                     ds.fillColor.push(watch.color);
//                     ds.data.push(count);
//                 });
//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });
            
//             $scope.graphs.watch = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length + PluralSrv([' клуб',' клуба',' клубов'], data.legends.club.length) + " по телесмотрению",
               
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }

//         // топ-5 по смотрению в WEB. график - бар
//         // TODO сейчас используются данные из prepareWatchData
//         function prepareWatchWEBData(data) {
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport,
//                 'watch': $scope.parameters.watch
//             });

//             var datasets = data.legends.watch.map(function(){
//                 return { label:[], fillColor:[], data:[] }
//             });
//             var chartData = {labels:[],datasets:datasets};

//             data.legends.club.forEach(function(club) {
//                 data.legends.watch.forEach(function (watch, watchIndex) {
//                     var count = data.getCount({'sport': club.sport.id, 'club': club.id, 'watch': watch.id}) || 0;
//                     var ds = datasets[watchIndex];
//                     ds.label.push(watch.name + ': ' + count.toLocaleString('en-US'));
//                     ds.fillColor.push(watch.color);
//                     ds.data.push(count);
//                 });
//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });
            
//             $scope.graphs.watchWEB = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length + PluralSrv([' клуб',' клуба',' клубов'], data.legends.club.length) + " по смотрению в WEB",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }

//         // топ-5 клубов по посещаемости. график - бар
//         function prepareWalkData(data){
//             data = $scope.prepareChartData(data, {
//                 'sport': $scope.parameters.sport,
//                 'club': $scope.parameters.sport,
//                 'walk': $scope.parameters.walk
//             });
            
//             var datasets = data.legends.walk.map(function(){
//                 return { label:[], fillColor:[], data:[] }
//             });
//             var chartData = {labels:[],datasets:datasets};

//             data.legends.club.forEach(function(club) {
//                 data.legends.walk.forEach(function (walk, walkIndex) {
//                     var count = data.getCount({'sport': club.sport.id, 'club': club.id, 'walk': walk.id}) || 0;
//                     var ds = datasets[walkIndex];
//                     ds.label.push(walk.name + ': ' + count.toLocaleString('en-US'));
//                     ds.fillColor.push(walk.color);
//                     ds.data.push(count);
//                 });
//                 chartData.labels.push(club.name + ' (' + club.sport.name + ')');
//             });
            
//             $scope.graphs.walk = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.club.length + PluralSrv([' клуб',' клуба',' клубов'], data.legends.club.length) + " по посещаемости",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }

//         // топ-5 самых упоминаемых спонсоров. график - бар
//         function prepareKnownSponsors(data) {
//             data = {
//                 "data": [
//                     {
//                         "count": 10,
//                         "legend": [1]
//                     },
//                     {
//                         "count": 20,
//                         "legend": [2]
//                     },
//                     {
//                         "count": 30,
//                         "legend": [3]
//                     },
//                     {
//                         "count": 40,
//                         "legend": [4]
//                     },
//                     {
//                         "count": 50,
//                         "legend": [5]
//                     }
//                 ],
//                 "legends": [
//                     {
//                         "name": "sponsor",
//                         "is_audience": false
//                     }
//                 ]
//             }
            
            
//             data = $scope.prepareChartData(data, {
//                 'sponsor': $scope.parameters.sponsor
//             });

//             var dataset = { label:[], fillColor:[], data:[] };
//             var chartData = {labels:[],datasets:[dataset]};

//             data.legends.sponsor.forEach(function(sponsor, index) {
//                 var count = data.getCount({'sponsor': sponsor.id});
//                 dataset.label.push(sponsor.name+ ': ' + count.toLocaleString('en-US'));
//                 dataset.fillColor.push(colorGenerator(index)); 
//                 dataset.data.push(count);

//                 chartData.labels.push(sponsor.name);
//             });

//             $scope.graphs.knownSponsor = {
//                 legends:data.legends,
//                 label: "Топ-" + data.legends.sponsor.length  + " самых упоминаемых спонсоров",
//                 chart:{
//                     data:chartData,
//                     options:{
//                         showLabels: false, // : $scope.formatValue,
//                         scaleLabel: function(obj){return $scope.formatValue(obj.value)}
//                     }
//                 }
//             };
//         }              

//     }

// }());
