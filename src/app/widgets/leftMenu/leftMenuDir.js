(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('leftMenuDir', leftMenuDir);

    leftMenuDir.$inject = [
        '$rootScope',
        'ApiSrv'
    ];

    function leftMenuDir(
        $rootScope,
        ApiSrv
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/leftMenu/leftMenu.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                'ParamsSrv',
                'AudienceCountSrv',
                'RouteSrv',
                function(
                    $scope,
                    ParamsSrv,
                    AudienceCountSrv,
                    RouteSrv
                ) {
                    
                    ParamsSrv.getRadars().then(function(radars){
                        $scope.radars = radars;
                    });
                    
                    $scope.$on('ParamsSrv.radarChanged', onRadarChanged)
            		onRadarChanged();
		
		            $scope.audienceWatcher;
		            function onRadarChanged(){
		                $scope.audienceWatcher && $scope.audienceWatcher();
		                
		                ParamsSrv.getParams().then(function(params){
                			$scope.parameters = params;
                			$scope.audienceWatcher = $scope.$watch('parameters.audience', updateTags, true);
                		});
		            
		            }
		            
		            function updateTags(){
		              //  var demography = ParamsSrv.getSelectedParams('demography');
		              //  var consume = ParamsSrv.getSelectedParams('consume');
		              //  var regions = ParamsSrv.getSelectedParams('regions');
		                
		                
		              //  var demography = $scope.parameters.demography;
		                var audience = $scope.parameters.audience;
                        var results = [];
                        // return;
                        // demography.lists.forEach(function(list){
                        //     var selected = list.lists.filter(function(sublist){
                        //       return sublist.selected;
                        //     })
                            
                        //     if (selected.length) {
                        //         results.push({
                        //             name: list.name,
                        //             items: selected
                        //         });
                        //     }
                        // });
                        getSelectedRec(audience);
                        
                        function getSelectedRec(list){
                            if (!list.lists) return;
                            var selected = list.lists.filter(function(sublist){
                               return sublist.selected && !sublist.lists;
                            });
                            
                            if (selected.length) {
                                results.push({
                                    name: list.name,
                                    items: selected
                                });
                            } 
                            
                            list.lists.forEach(getSelectedRec);
                        }
                        
            
                        $scope.audienceBlocks = results;
		            }
		           
                    $scope.deselectItem = function(item){
                       item.selected = false;
                    }
                   
                    $scope.clearAudience = function(){
                        ParamsSrv.clearSelection('demography');
                        ParamsSrv.clearSelection('consume');
                        ParamsSrv.clearSelection('regions');
                    }
                                
                    $scope.selectRadar = function(radarId){
                        ParamsSrv.selectRadar(radarId);
                    }
                    
                     
		
                    
                    // $scope.audienceMessage = "Кол-во болельщиков";
                    // $scope.audienceCount = 984797927;
                    // $scope.audienceError = false;
                    
                    
                    $scope.$on('AudienceCountSrv.countError', function(){
            			setAudienceCount(0);
            		});
            		$scope.$on('AudienceCountSrv.countLoaded', readCount);
            
            		function readCount(){
            			var result = AudienceCountSrv.getLastCountResult();
            			if (!result) {
            			    setAudienceCount(null);
        			    } else if (!result.is_valid_count) {
        			        setAudienceCount(0);
        			    } else {
            				setAudienceCount(result.audience_count);
        			    }
            		}
            		
            		$scope.audienceError = true;
            		readCount();
            
                    
            		function setAudienceCount(audienceCount) {
            			$scope.audienceCount = audienceCount;
            			if (audienceCount == null) {
            				$scope.audienceError = false;
            				$scope.audienceMessage = null;
            			} else if (audienceCount != 0) {
            			    $scope.audienceError = false;
            				$scope.audienceMessage = 'Кол-во болельщиков';
            			} else {
            			    $scope.audienceError = true;
            			    $scope.audienceMessage = 'Недостаточно<br>данных';
            			}
            		}
            		
            		$scope.showResult = function(){
            		    if ($scope.audienceError)
            		        return;
            		        
            		    var currentRouteKey = RouteSrv.getCurrentRoute().key;
            		    if ([
            		        'infobox:demography',
            		        'infobox:consume',
            		        'infobox:regions'
            		        ].indexOf(currentRouteKey) >= 0 &&
            		        ParamsSrv.isAudienceSelected()) {
            		        RouteSrv.navigate('infobox:expressAudience');
            		    } else if ([
            		        'infobox:sport',
            		        'infobox:interest',
            		        'infobox:rooting',
            		        'infobox:involve',
            		        'infobox:image',
            		        ].indexOf(currentRouteKey) >= 0 &&
            		        ParamsSrv.isSportSelected()) {
            		        RouteSrv.navigate('infobox:expressSport');
        		        } else {
        		            RouteSrv.navigate('infobox:result');
        		        }
            		    
            		}
                    
                    
                    $scope.buttons = [{
                        'name': 'Болельщик',
                        iconClass: 'button-fan-icon',
                        selectedFn: function(){
                            return $scope.currentRoute.key == 'infobox:demography'
                                || $scope.currentRoute.key == 'infobox:consume'
                                || $scope.currentRoute.key == 'infobox:regions';
                        },
                        defaultRoute: 'infobox:demography'
                        // onClick: function(){ RouteSrv.navigate('infobox:demography'); }
                    },{
                        'name': 'Спорт',
                        iconClass: 'button-sport-icon',
                        selectedFn: function(){
                            return $scope.currentRoute.key == 'infobox:sport'
                                || $scope.currentRoute.key == 'infobox:interest'
                                || $scope.currentRoute.key == 'infobox:rooting'
                                || $scope.currentRoute.key == 'infobox:involve'
                                || $scope.currentRoute.key == 'infobox:image';
                        },
                        defaultRoute: 'infobox:sport'
                        // onClick: function(){ RouteSrv.navigate('infobox:sport'); }
                    }];
                    
                    $scope.onButtonClick = function(button){
                        if (button.selected){
                            return;
                        }
                        RouteSrv.navigate(button.defaultRoute);
                    }
                    
                    $scope.updateButtons = function(){
                        $scope.currentRoute = RouteSrv.getCurrentRoute();
                        $scope.buttons.forEach(function(button){
                            button.selected = button.selectedFn();
                        })
                    }
                    
                    $scope.updateButtons();
                    $scope.$on('RouteSrv.locationChangeSuccess', function(event, currentRoute){
                        $scope.updateButtons();
                    });
                    
                }]
        };
    }
}());
