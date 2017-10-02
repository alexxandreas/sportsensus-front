(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('infoboxTabsDir', infoboxTabsDir);

    infoboxTabsDir.$inject = [
        '$rootScope'
    ];

    function infoboxTabsDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            templateUrl: '/views/widgets/infobox/panels/tabs/infoboxTabs.html',
            
            controller: [
                '$scope',
                '$controller',
                'RouteSrv',
                function(
                    $scope,
                    $controller,
                    RouteSrv
                ) {
                    // $controller('baseInfoboxCtrl', {$scope: $scope});
                    
                    
                    
                    
                    $scope.itemClick = function(key){
                        RouteSrv.navigate(key);
                    };
                    
                    $scope.isItemSelected = function(key){
                        return $scope.currentRoute.key == key;
                    }
                    
                    
                    var audienceMenu = [{
                        name: 'Демография',
                        key: 'infobox:demography'
                    },{
                        name: 'Поведение',
                        key: 'infobox:consume'
                    },{
                        name: 'География',
                        key: 'infobox:regions'
                    }];
                    
                    var sportMenu = [{
                        name: 'Спорт',
                        key: 'infobox:sport'
                    },{
                        name: 'Интерес',
                        key: 'infobox:interest'
                    },{
                        name: 'Боление',
                        key: 'infobox:rooting'
                    },{
                        name: 'Причастность',
                        key: 'infobox:involve'
                    },{
                        name: 'Восприятие',
                        key: 'infobox:image'
                    }];
                    
                    var resultMenu = [{
                        name: 'Общий результат',
                        key: 'infobox:result'
                    },{
                        name: 'По болельщику',
                        key: 'infobox:expressAudience'
                    },{
                        name: 'По спорту',
                        key: 'infobox:expressSport'
                    }]
                    
                    $scope.updateItems = function(){
                        $scope.currentRoute = RouteSrv.getCurrentRoute();
                        
                        audienceMenu.forEach(update);
                        sportMenu.forEach(update);
                        resultMenu.forEach(update);
                        
                        if (audienceMenu.some(test)) {
                            $scope.menu = audienceMenu;
                        } else if (sportMenu.some(test)) {
                            $scope.menu = sportMenu;
                        } else if (resultMenu.some(test)) {
                            $scope.menu = resultMenu;
                        } else {
                            $scope.menu = null;
                        }
                        
                        function update(item){
                            item.selected = $scope.isItemSelected(item.key);
                        }
                        
                        function test(item){
                            return item.selected;
                        }
                    }
                    
                    $scope.updateItems();
                    $scope.$on('RouteSrv.locationChangeSuccess', function(event, currentRoute){
                    //   $scope.currentRoute = currentRoute;
                      $scope.updateItems();
                    });
                    
                }
            ]
        };
    }
}());
