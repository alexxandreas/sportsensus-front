(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxExpressAudienceDir', infoboxExpressAudienceDir);

    infoboxExpressAudienceDir.$inject = [
        '$rootScope'
    ];

    function infoboxExpressAudienceDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            templateUrl: '/views/widgets/infobox/panels/expressAudience/infoboxExpressAudience.html',
            
            controller: [
                '$scope',
                '$controller',
                'ParamsSrv',
                'ApiSrv',
                'PluralSrv',
                function(
                    $scope,
                    $controller,
                    ParamsSrv,
                    ApiSrv,
                    PluralSrv // 1, 2, 5
                ) {
                    $controller('baseGraphCtrl', {$scope: $scope});

            		$scope.setParams = function(params){
                        requestData();
                        updateCaption();
            		}
            
                    $scope.sportDatas = {};
            
                    
                    $scope.setGraphsMode = function(graphMode){
                        prepareGraphs();
                    }
            
                    function updateCaption(){
                        $scope.caption = ParamsSrv.getSelectedDemographyCaption();
                    }
            
                    $scope.serverData = null;
                    
                    function requestData(sport) { 
                        var audience = ParamsSrv.getSelectedAudience();
                        
                        ApiSrv.getExpressAudience(audience).then(function (data) {
                            $scope.serverData = data;
                            prepareGraphs()
                            
                        }).finally(function(){
                            $scope.showPreloader = false;
                        });
                    }
                    
                    function prepareGraphs(){
                        if (!$scope.serverData) return;
                        
                        $scope.graphs = {};

                            
                        
                        prepareRegions($scope.getGraphData($scope.serverData, 'regions'));              // топ-10 регионов. график - карта с легендой
                        prepareFanTypeData($scope.getGraphData($scope.serverData, 'fan_type'));              // распределение по типу боления. график - бублик
                        prepareInterestData($scope.getGraphData($scope.serverData, 'interest'));             // топ-5 по интересу. график - бар
                        prepareInvolveData($scope.getGraphData($scope.serverData, 'involvment'));            // топ-5 по вовлеченности. график - бар.
                        prepareKnownHelpTournamentData($scope.getGraphData($scope.serverData, 'tournaments_known_help'));       // топ-5 подсказанного знания турниров (лиг). график - бар
                        prepareKnownTournamentData($scope.getGraphData($scope.serverData, 'tournaments_known'));   // топ-5 спонтанного знания турниров (лиг). график - бар
                        prepareKnownHelpClubData($scope.getGraphData($scope.serverData, 'clubs_known_help'));// топ-5 подсказанного знания клубов. график - бар
                        prepareKnownClubData($scope.getGraphData($scope.serverData, 'clubs_known'));         // топ-5 спонтанного знания клубов. график - бар
                        prepareWatchData($scope.getGraphData($scope.serverData, 'watch'));                   // топ-5 клубов по телесмотрению. график - бар
                        prepareWalkData($scope.getGraphData($scope.serverData, 'walk'));                     // топ-5 клубов по посещаемости. график - бар
                        prepareKnownPlayerData($scope.getGraphData($scope.serverData, 'players_known'));       // топ-5 спонтанного знания спортсменов. график - бар
                        prepareKnownSponsors($scope.getGraphData($scope.serverData, 'sponsors_known'));      // топ-5 самых упоминаемых спонсоров. график - бар
                        
                        return;
                        
                        
                        
                        prepareWatchWEBData($scope.getGraphData($scope.serverData, 'watch'));                // топ-5 по смотрению в WEB. график - бар
                        prepareKnownHelpPlayerData($scope.getGraphData($scope.serverData, 'clubs_known_help'));        // топ-5 подсказанного знания спортсменов. график - бар
                        
                        
                        

                    }
                    
            
                    var colorGenerator = d3.scale.category10();
                    
                    var mainThemeColors = ['#287177', '#287177', '#399997', '#399997', '#4ac0b6', '#4ac0b6', '#85ddd0', '#85ddd0', '#a0efe2', '#a0efe2'];
            
            
                    // Регионы проживания
                    function prepareRegions(data) {
                        if (!data){
                            $scope.regionsItems = null;
                            $scope.regionsMapChart = null;
                            return;
                        }
                        
                        var data = $scope.prepareChartData(data, {
                            'region': $scope.parameters.region
                        });
                        
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
            
            
            
                    // распределение по типу боления. график - бублик
                    function prepareFanTypeData(data) {
                        if (!data){
                            $scope.fanTypeItems = null;
                            $scope.fanTypeDonutChart = null;
                            return;
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'fan_type': $scope.parameters.fan_type
                        });
            
                        var items = [];
                        
                        data.legends.fan_type.forEach(function (fanType, fanTypeIndex) {
                            var count = data.getCount({'fan_type': fanType.id});
                            items.push({
                                color: fanType.color,
                                value: count,
                                // valueText: count.toLocaleString('en-US'),
                                valueText: $scope.formatCount(count),
                                text: fanType.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        $scope.fanTypeItems = items;
                        $scope.fanTypeDonutChart = {
                            items: items
                        }
                    }
            
            
                    // топ-5 по интересу. график - бар
                    function prepareInterestData(data){
                        if (!data){
                            $scope.interestItems = null;
                            $scope.interestBarsChart = null;
                            return;
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'interest': $scope.parameters.interest
                        });
                        
                        var items = [];
                        
                        data.legends.sport.forEach(function(sport) {
                            //var count = data.getCount({'sport': sport.id, 'interest': interest.id});
                            // var count = data.getCount({'sport': sport.id});
                            // TODO костыль, убрать срочно!
                            var count4 = data.getCount({'sport': sport.id, 'interest': 4}) || 0;
                            var count5 = data.getCount({'sport': sport.id, 'interest': 5}) || 0;
                            var count = count4 + count5;
                            
                            items.push({
                                bottomText: sport.name,
                                topText: $scope.formatCount(count),
                                value: count,
                                color: sport.color
                                // text: region.name
                            });
                            
                        });
            
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        $scope.intetestCount = items.length;
                        $scope.interestItems = items;
                        $scope.interestBarsChart = {
                            items: items
                        }
                    }
                    
                    
                    
                    // топ-5 по вовлеченности. график - бар.
                    function prepareInvolveData(data){
                        if (!data){
                            $scope.involveSports = null;
                            return;
                        }
                        
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'involve': $scope.parameters.involve
                        });
            
                        var sports = [];
                        
                        //var items = [];
                        
                        data.legends.sport.forEach(function(sport) {
                            //var count = data.getCount({'sport': sport.id, 'interest': interest.id});
                            var count = data.getCount({'sport': sport.id});
                            
                            var sportsItem = {
                                value: count,
                                name: sport.name,
                                items: []
                            }
                            sports.push(sportsItem);
                            
                            data.legends.involve.forEach(function(involve) {
                                var count =  data.getCount({'sport': sport.id, 'involve': involve.id});
                                if (count){
                                    sportsItem.items.push({
                                        //bottomText: sport.name,
                                        topText: $scope.formatCount(count),
                                        value: count,
                                        color: involve.color
                                    })
                                }
                            });
                            
                        });
                        
                        var involveSportsLegend = data.legends.involve.map(function(involve) {
                            return {
                                text: involve.name,
                                color: involve.color
                            }
                        });
                
            
                        //items.sort(function(a, b){ return b.value - a.value; });
                        
                        $scope.involveSportsCount = sports.length;
                        $scope.involveSports = sports;
                        
                        $scope.involveSportsLegend = involveSportsLegend;
                        
                        
                        // $scope.intetestCount = items.length;
                        // $scope.interestItems = items;
                        // $scope.interestBarsChart = {
                        //     items: items
                        // }
                        
                        
                        // var datasets = data.legends.involve.map(function(){
                        //     return { label:[], fillColor:[], data:[] }
                        // });
                        // var chartData = {labels:[],datasets:datasets};
                        // data.legends.sport.forEach(function(sport) {
                        //     data.legends.involve.forEach(function (involve, involveIndex) {
                        //         var count = data.getCount({'sport': sport.id, 'interest': involve.id});
                        //         var ds = datasets[involveIndex];
                        //         //ds.label.push('');
                        //         ds.label.push(involve.name + ': ' + count.toLocaleString('en-US'));
                        //         ds.fillColor.push(involve.color);
                        //         ds.data.push(count);
                        //     });
                        //     chartData.labels.push(sport.name);
                        // });
                        
                    
                        // $scope.graphs.involve = {
                        //     legends: data.legends,
                        //     label: "Топ-" + data.legends.sport.length + PluralSrv([' вид',' вида',' видов'], data.legends.sport.length) + " спорта по вовлеченности",
                        //     //charts: charts
                        //     chart:{
                        //         data:chartData,
                        //         options:{
                        //             showLabels: false, // : $scope.formatValue,
                        //             stacked: true,
                        //             scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                        //         }
                        //     }
                        // };
                    }
            
                    
                    
                    
                    // топ-5 подсказанного знания турниров (лиг). график - бар
                    // TODO сейчас используются данные по знанию клубов
                    function prepareKnownHelpTournamentData(data) {
                        if (!data){
                            $scope.tournamentHelpCount = 0;
                            $scope.tournamentHelpItems = null;
                            $scope.tournamentHelpBarsChart = null;
                            return;
                        }
                        
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'tournament': $scope.parameters.sport
                        });
                        
                        var items = [];
                        
                        data.legends.tournament.forEach(function (tournament, tournamentIndex) {
                            var count = data.getCount({'sport': tournament.sport.id, 'tournament': tournament.id});
                            items.push({
                                color: "#fc4a1a",
                                value: count,
                                leftText: $scope.formatCount(count),
                                rightText: tournament.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        $scope.tournamentHelpCount = items.length;
                        $scope.tournamentKnownHelpCount = Math.max($scope.tournamentHelpCount, $scope.tournamentKnownCount) || 0;
                        $scope.tournamentHelpItems = items;
                        $scope.tournamentHelpBarsChart = {
                            items: items
                        }

                    }
                    
                    // топ-5 спонтанного знания турниров (лиг). график - бар
                    // TODO сейчас используются данные по знанию клубов
                    function prepareKnownTournamentData(data) {
                        if (!data){
                            $scope.tournamentKnownCount = 0;
                            $scope.tournamentKnownItems = null;
                            $scope.tournamentKnownBarsChart = null;
                            return;
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'tournament': $scope.parameters.sport
                        });
            
                        var items = [];
                        
                        data.legends.tournament.forEach(function (tournament, tournamentIndex) {
                            var count = data.getCount({'sport': tournament.sport.id, 'tournament': tournament.id});
                            items.push({
                                color: "#4ac0b6",
                                value: count,
                                leftText: tournament.name,
                                rightText: $scope.formatCount(count)
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        $scope.tournamentKnownCount = items.length;
                        $scope.tournamentKnownHelpCount = Math.max($scope.tournamentHelpCount, $scope.tournamentKnownCount) || 0;
                        $scope.tournamentKnownItems = items;
                        $scope.tournamentKnownBarsChart = {
                            items: items
                        }

                    }
                    
                    
                    // топ-5 подсказанного знания клубов. график - бар
                    function prepareKnownHelpClubData(data){
                        if (!data){
                            $scope.clubHelpCount = 0;
                            $scope.clubHelpItems = null;
                            $scope.clubHelpBarsChart = null;
                            return;
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'club': $scope.parameters.sport
                        });
            
            
                        var items = [];
                        
                        data.legends.club.forEach(function (club, clubIndex) {
                            var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                            items.push({
                                color: "#fc4a1a",
                                value: count,
                                leftText: $scope.formatCount(count),
                                // rightText: club.shortName,
                                rightText: club.name
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        $scope.clubHelpCount = items.length;
                        $scope.clubKnownHelpCount = Math.max($scope.clubHelpCount, $scope.clubKnownCount) || 0;
                        $scope.clubHelpItems = items;
                        $scope.clubHelpBarsChart = {
                            items: items
                        }
                    }
                    
                    // топ-5 спонтанного знания клубов. график - бар
                    function prepareKnownClubData(data){
                        if (!data){
                            $scope.clubKnownCount = 0;
                            $scope.clubKnownItems = null;
                            $scope.clubKnownBarsChart = null;
                            return;
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'club': $scope.parameters.sport
                        });
            
                        var items = [];
                        
                        data.legends.club.forEach(function (club, clubIndex) {
                            var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                            items.push({
                                color: "#4ac0b6",
                                value: count,
                                // leftText: club.shortName,
                                leftText: club.name,
                                rightText: $scope.formatCount(count)
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        
                        $scope.clubKnownCount = items.length;
                        $scope.clubKnownHelpCount = Math.max($scope.clubHelpCount, $scope.clubKnownCount) || 0;
                        $scope.clubKnownItems = items;
                        $scope.clubKnownBarsChart = {
                            items: items
                        }

                    }
            
            
                    // топ-5 клубов по телесмотрению. график - бар
                    function prepareWatchData(data){
                        if (!data){
                            $scope.clubWatchCount = 0;
                            $scope.clubWatchItems = null;
                            $scope.clubWatchBarsChart = null;
                            return;   
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'club': $scope.parameters.sport,
                            //'watch': $scope.parameters.watch
                        });
            
                        var items = [];
                        
                        data.legends.club.forEach(function (club, clubIndex) {
                            var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                            items.push({
                                color: "#ffc85a",
                                value: count,
                                // leftText: club.shortName,
                                leftText: club.name,
                                rightText: $scope.formatCount(count)
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        
                        $scope.clubWatchCount = items.length;
                        $scope.clubWatchItems = items;
                        $scope.clubWatchBarsChart = {
                            items: items
                        }
                        
                    }
            
                    // топ-5 по смотрению в WEB. график - бар
                    // TODO сейчас используются данные из prepareWatchData
                    function prepareWatchWEBData(data) {
                        return; // сейчас нет данных для этого графика
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'club': $scope.parameters.sport,
                            'watch': $scope.parameters.watch
                        });
            
                        var datasets = data.legends.watch.map(function(){
                            return { label:[], fillColor:[], data:[] }
                        });
                        var chartData = {labels:[],datasets:datasets};
            
                        data.legends.club.forEach(function(club) {
                            data.legends.watch.forEach(function (watch, watchIndex) {
                                var count = data.getCount({'sport': club.sport.id, 'club': club.id, 'watch': watch.id}) || 0;
                                var ds = datasets[watchIndex];
                                ds.label.push(watch.name + ': ' + count.toLocaleString('en-US'));
                                ds.fillColor.push(watch.color);
                                ds.data.push(count);
                            });
                            chartData.labels.push(club.name + ' (' + club.sport.name + ')');
                        });

                        
                    //     $scope.graphs.watchWEB = {
                    //         legends:data.legends,
                    //         label: "Топ-" + data.legends.club.length + PluralSrv([' клуб',' клуба',' клубов'], data.legends.club.length) + " по смотрению в WEB",
                    //         chart:{
                    //             data:chartData,
                    //             options:{
                    //                 showLabels: false, // : $scope.formatValue,
                    //                 scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                    //             }
                    //         }
                    //     };
                    // }
                    }
            
                    // топ-5 клубов по посещаемости. график - бар
                    function prepareWalkData(data){
                        if (!data){
                            $scope.clubWalkCount = 0;
                            $scope.clubWalkItems = null;
                            $scope.clubWalkBarsChart = null;
                            return;   
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'club': $scope.parameters.sport,
                            'walk': $scope.parameters.walk
                        });
                        
                        var items = [];
                        
                        data.legends.club.forEach(function (club, clubIndex) {
                            var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                            items.push({
                                color: "#ffc85a",
                                value: count,
                                // leftText: club.shortName,
                                leftText: club.name,
                                rightText: $scope.formatCount(count)
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        
                        $scope.clubWalkCount = items.length;
                        $scope.clubWalkItems = items;
                        $scope.clubWalkBarsChart = {
                            items: items
                        }
                    }
            
            
                    // топ-5 спонтанное знания спортсменов. график - бар
                    // TODO сейчас используются данные по знанию клубов
                    function prepareKnownPlayerData(data) {
                        if (!data){
                            $scope.playerKnownCount = 0;
                            $scope.playerKnownItems = null;
                            $scope.playerKnownBarsChart = null;
                            return;   
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'player': $scope.parameters.sport
                        });
            
            
                        var items = [];
                        
                        data.legends.player.forEach(function (player, index) {
                            var count = data.getCount({'sport': player.sport.id, 'club': player.id});
                            items.push({
                                color: "#ffc85a",
                                value: count,
                                leftText: player.name,
                                rightText: $scope.formatCount(count)
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        
                        $scope.playerKnownCount = items.length;
                        $scope.playerKnownItems = items;
                        $scope.playerKnownBarsChart = {
                            items: items
                        }
                    
                    }
            
                    // топ-5 самых упоминаемых спонсоров. график - бар
                    function prepareKnownSponsors(data) {
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
                                    "name": "sponsor",
                                    "is_audience": false
                                }
                            ]
                        }
                        
                        if (!data || !$scope.parameters.sponsor){
                            $scope.sponsorKnownCount = 0;
                            $scope.sponsorKnownItems = null;
                            $scope.sponsorKnownBarsChart = null;
                            return;   
                        }
                        
                        data = $scope.prepareChartData(data, {
                            'sponsor': $scope.parameters.sponsor
                        });
                        
                        var items = [];
                        
                        data.legends.sponsor.forEach(function(sponsor, index) {
                            var count = data.getCount({'sponsor': sponsor.id});
                            items.push({
                                color: "#ffc85a",
                                value: count,
                                leftText: sponsor.name,
                                rightText: $scope.formatCount(count)
                            });
                        });
                        items.sort(function(a, b){ return b.value - a.value; });
                        
                        
                        $scope.sponsorKnownCount = items.length;
                        $scope.sponsorKnownItems = items;
                        $scope.sponsorKnownBarsChart = {
                            items: items
                        }
                        
                    }        
            
            
            
                    // топ-5 подсказанного знания спортсменов. график - бар
                    // TODO сейчас используются данные по знанию клубов
                    function prepareKnownHelpPlayerData(data) {
                        return; // нет в текущей выдаче
                        data = $scope.prepareChartData(data, {
                            'sport': $scope.parameters.sport,
                            'club': $scope.parameters.sport
                        });
            
                        var dataset = { label:[], fillColor:[], data:[] };
                        var chartData = {labels:[],datasets:[dataset]};
                        data.legends.club.forEach(function(club, index) {
                            var count = data.getCount({'sport': club.sport.id, 'club': club.id});
                            dataset.label.push(club.name + ' (' + club.sport.name + '): ' + count.toLocaleString('en-US'));
                            dataset.fillColor.push(colorGenerator(index));
                            dataset.data.push(count);
            
                            chartData.labels.push(club.name + ' (' + club.sport.name + ')');
                        });
            
                        $scope.graphs.knownHelpPlayer = {
                            legends:data.legends,
                            label: "Топ-" + data.legends.club.length  + " подсказанное знание спортсменов",
                            chart:{
                                data:chartData,
                                options:{
                                    showLabels: false, // : $scope.formatValue,
                                    scaleLabel: function(obj){return $scope.formatValue(obj.value)}
                                }
                            }
                        };
                    }
                }
            ]
        };
    }
}());
