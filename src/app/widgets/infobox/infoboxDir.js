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
               
            },

            controller: [
                '$scope',
                '$controller',
                '$routeParams',
                '$location',
                '$window',
                'ParamsSrv',
                'ApiSrv',
                function(
                    $scope,
                    $controller,
                    $routeParams,
                    $location,
                    $window,
                    ParamsSrv,
                    ApiSrv
                ) {

                    $controller('baseInfoboxCtrl', {$scope: $scope});

                 

                    $scope.audienceMenu = [{
                        id:'demography',
                        tpl:'demography/demography',
                        text:'Социальная демография',
                        isSelected: $scope.checkSelected.bind(null, 'demography'),
                        footer: 'infobox'
                    },{
                        id:'consume/consume',
                        tpl:'consume/consume',
                        text:'Потребительское поведение',
                        isSelected: $scope.checkSelected.bind(null, 'consume'),
                        footer: 'infobox'
                    },{
                        id:'regions',
                        tpl:'regions/regions',
                        text:'География',
                        isSelected: $scope.checkSelected.bind(null, 'regions'),
                        footer: 'infobox'
                    }];

                    $scope.topMenu = $scope.audienceMenu;
                    
                    
                    function isSportSelected(){return $scope.sportSelected}
                    $scope.sportinfoMenu = [{
                        id:'sport',
                        tpl:'sport/sport',
                        text:'Спорт',
                        isSelected: $scope.checkSelected.bind(null, 'sport'),
                        footer: 'infobox'
                    },{
                        id:'interest/interest',
                        tpl:'interest/interest',
                        // id:'interest/interestGraph',
                        enabled: isSportSelected,
                        text:'Степень интереса',
                        isSelected: $scope.checkSelected.bind(null, 'interest'),
                        footer: 'infobox'
                    },{
                        id:'rooting/rooting',
                        tpl:'rooting/rooting',
                        // id:'rooting/rootingGraph',
                        enabled: isSportSelected,
                        text:'Сила боления',
                        isSelected: $scope.checkSelected.bind(null, 'rooting'),
                        footer: 'infobox'
                    },{
                        id:'involve/involve',
                        tpl:'involve/involve',
                        enabled: isSportSelected,
                        text:'Причастность к видам спорта',
                        isSelected: $scope.checkSelected.bind(null, 'involve'),
                        footer: 'infobox'
                    },{
                        id:'image/image',
                        tpl:'image/image',
                        // id:'image/imageGraph',
                        enabled: isSportSelected,
                        text:'Восприятие видов спорта',
                        isSelected: $scope.checkSelected.bind(null, 'image'),
                        footer: 'infobox'
                    }];
                    $scope.bottomMenu = $scope.sportinfoMenu;

                    

                    $scope.extPages = [{
                        id:'image/imageGraph',
                        tpl:'image/imageGraph',
                        footer: 'infoboxResult'
                    },{
                        id:'allGraphs',
                        tpl:'allGraphs',
                        footer: 'infoboxResult'
                    },{
                        id:'expressSport/expressSports',
                        tpl:'expressSport/expressSports',
                        footer: 'infoboxResult'
                    },{
                        id:'expressAudience/expressAudience',
                        tpl:'expressAudience/expressAudience',
                        footer: 'infoboxResult'
                    }];

                    $scope.pages = {};

                    [$scope.audienceMenu, $scope.sportinfoMenu,  $scope.extPages, /*$scope.analyticsMenu*/].forEach(function(collection) {
                        collection.forEach(function (item) {
                            $scope.pages[item.id] = item;
                        });
                    });

                    $scope.setActiveMenuItem($scope.audienceMenu[0]);
                    

                    $scope.sportSelected = false; // показывает, выбран ли какой-либо вид спорта
                    
                    $scope.$on('ParamsSrv.paramsChanged', paramsChanged);
                    paramsChanged();

                    function paramsChanged() {
                        $scope.sportSelected = !!ParamsSrv.getSelectedParams('sport');
                    }
                    
                    
                }]
        };
    }
}());
