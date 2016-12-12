(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxDir', infoboxDir);

    infoboxDir.$inject = [
        '$rootScope'
    ];

    function infoboxDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                type: '@'
            },
            templateUrl: '/views/widgets/infobox/infobox.html',
            link: function ($scope, $el, attrs) {
                $scope.init();
            },

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ParamsSrv',
                'ApiSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    ParamsSrv,
                    ApiSrv
                ) {
                    $scope.audienceCountText = null;

                    $scope.audienceMenu = [{
                        id:'demography',
                        text:'Социальная демография'
                    },{
                        id:'consume/consume',
                        text:'Потребительское поведение'
                    },{
                        id:'regions',
                        text:'География'
                    }];
                    
                    function isSportSelected(){return $scope.sportSelected}
                    $scope.sportinfoMenu = [{
                        id:'sport',
                        text:'Спорт'
                    },{
                        id:'interest/interest',
                        // id:'interest/interestGraph',
                        enabled: isSportSelected,
                        text:'Степень интереса'
                    },{
                        id:'rooting/rooting',
                        // id:'rooting/rootingGraph',
                        enabled: isSportSelected,
                        text:'Сила боления'
                    },{
                        id:'involve/involve',
                        enabled: isSportSelected,
                        text:'Причастность к видам спорта'
                    },{
                        id:'image/image',
                        // id:'image/imageGraph',
                        enabled: isSportSelected,
                        text:'Восприятие видов спорта'
                    }];

                    $scope.analyticsMenu = [
                        {
                            id:'sportAnalytics/sportAnalytics',
                            text:'Спорт'
                        }
                    ];
                    
                    $scope.pages = {};
                    [
                        'image/imageGraph',
                        'allGraphs',
                        'expressSport/expressSport',
                        'expressAudience/expressAudience',
                        'analytics/analytics'
                    ].forEach(function(page){
                        $scope.pages[page] = {id:page};
                    });
                    


                    ParamsSrv.getParams().then(function(params){
                        $scope.parameters = params;
                        
                        //$scope.regionsLegend = {};
                    });


                    $scope.activePage = null;
                    $scope.activeMenuItem = null;
                    $scope.setActiveMenuItem = function(item){
                        $scope.activeMenuItem = item;
                        $scope.activePage = item;
                    };

                    $scope.sportSelected = false; // показывает, выбран ли какой-либо вид спорта

                    $scope.setActiveMenuItem($scope.audienceMenu[0]);
                    

                    
                    $scope.$on('ApiSrv.countError', function(){
                        $scope.audienceCount = 0;
                        //$scope.audienceCountText = 'Болельщики: ошибка загрузки';
                    });
                    $scope.$on('ApiSrv.countLoaded', readCount);

                    function readCount(){
                        var result = ApiSrv.getLastCountResult();
                        if (result && result.is_valid_count)
                            $scope.audienceCount = result.audience_count;
                        else
                            $scope.audienceCount = 0;
                    }
                    readCount();


                    $scope.checkButtonText = '';
                    $scope.checkButtonPage = null;
                    $scope.checkButtonClick = function(){
                        $scope.activePage = $scope.pages[$scope.checkButtonPage];
                    };

                    $scope.$on('ParamsSrv.paramsChanged', paramsChanged);
                    paramsChanged();

                    function paramsChanged(){
                        var selected = ParamsSrv.getSelectedParams();
                        var audienceSelected = !!(selected.demography || selected.regions || selected.consume);
                        $scope.sportSelected = !!selected.sport;
                        var filtersSelected = !!(selected.interest || selected.rooting || selected.involve || selected.image);

                        if ($scope.type == 'infobox') {
                            if (audienceSelected && !$scope.sportSelected) { //} && !filtersSelected){
                                $scope.checkButtonText = 'Экспресс-результат';
                                $scope.checkButtonPage = 'expressAudience/expressAudience';
                            } else if ($scope.sportSelected && !audienceSelected && !filtersSelected) {
                                $scope.checkButtonText = 'Экспресс-результат';
                                $scope.checkButtonPage = 'expressSport/expressSport';
                            } else {
                                $scope.checkButtonText = 'Показать результат';
                                $scope.checkButtonPage = 'allGraphs';
                            }
                        } else if ($scope.type == 'analytics'){
                            $scope.checkButtonText = 'Анализ пакета';
                            $scope.checkButtonPage = 'analytics/analytics';
                        }
                    }
                    
                    // снимает выделение с соседний radio
                    $scope.selectCheckbox = function(collection, item){
                        ParamsSrv.getParams().then(function(params){
                            var a = params;
                        });

                        if (collection.type != 'radio') return;
                        angular.forEach(collection.items, function(_item) {
                            if (item != _item) {
                                _item.selected = false;
                            }
                        });
                    };

                    
                    $scope.init = function(){
                        if ($scope.type == 'infobox'){
                            $scope.bottomMenu = $scope.sportinfoMenu;
                        } else if ($scope.type == 'analytics'){
                            $scope.bottomMenu = $scope.analyticsMenu;
                        }
                    }
                    
                }]
        };
    }
}());
