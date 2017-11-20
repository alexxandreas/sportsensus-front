(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('ParamsSrv', ParamsSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['ParamsSrv', function(ParamsSrv) { }]);

    // angula
    // r.module('SportsensusApp').run(ParamsSrv.init);

    ParamsSrv.$inject = [
        '$rootScope',
        '$http',
        '$q',
        'ApiSrv',
        'AudienceCountSrv',
        'ConfigSrv',
        'TranslationsSrv',
        'MultiPromiseSrv',
        'UserSrv'
    ];


    /**
     * events:
     * ParamsSrv.paramsChanged type newValue oldValue. type in ['demography','consume','regions','region','sport','interest','rooting','involve','image','career]
     * ParamsSrv.radarStartChanging - запрос на изменение выбранного радара
     * ParamsSrv.radarChanged - радар изменен
     */
    function ParamsSrv(
        $rootScope,
        $http,
        $q,
        ApiSrv,
        AudienceCountSrv,
        ConfigSrv,
        TranslationsSrv,
        MultiPromiseSrv,
        UserSrv
    ) {

        // функция, возвращающая промис, который резолвится/режектится один раз за сессию
        var getRadars = UserSrv.loadWhenAuth(function(resolve, reject){
            ApiSrv.getRadars().then(resolve, reject);
        });
        
       
        //var paramsDefer = MultiPromiseSrv.defer();
        //var paramsDeferState = angular.copy(paramsDefer.promise.$$state);
        
        var paramsPromise;
        //var currentParams = null;
        
        // TODO отписываться от всех watch!
        function selectRadar(radarId){
            //paramsDefer.notify('qwe');
            //paramsDefer.reset();
            
            paramsPromise = getRadars().then(function(radars){
                radarId = radarId || radars[0].id;
                
                var selected = radars.find(function(radar){ return radar.selected; });
                if (selected && selected.id == radarId){
                    return parameters;
                }
                ApiSrv.setRadarId(radarId);
                AudienceCountSrv.clearCache();
                
                angular.forEach(radars, function(radar){
                    radar.selected = radar.id == radarId;
                })
                
                return ApiSrv.getTranslations().then(function(translations){
                    prepareParams(translations);
                    
                    AudienceCountSrv.getCount(getSelectedAudience());
                    return parameters;
                });
            });
            
            //paramsPromise.then(paramsDefer.resolve, paramsDefer.reject);
            
            $rootScope.$broadcast('ParamsSrv.radarChanged');
            
            // paramsPromise.finally(function(){
                // $rootScope.$broadcast('ParamsSrv.radarChanged');
            // })
        }
        
        // выбираем радар по умолчанию
        selectRadar(1);
        
        function getParams() {
            return paramsPromise;
            // return paramsDefer.promise;
        }
        

        var parametersNames = [
            'audience',
            'demography',
            'gender',
            'age',
            'income',
            'career',
            'familysize',
            'family',
            'children',
            'consume',
            'car',
            'gaming',
            'antivirus',
            'money',
            'mobile',
            'electronics',
            'timeusage',
            'tv',
            'regions',
            'region',
            'sport',
            'interest',
            'rooting',
            'involve',
            'image',
            'watch',
            'walk',
            'tvhome',
            'tvcable',
            'electronics_exist',
            'gasoften',
            'career',
            'decision',
            'timeusage',
            'time_week',
            'visit_time',
            'net',
            'gamingplatform',
            'gamingtime',
            "fan_type",
            "sponsor",
            "services_now"
        ];
        var parametersWatchers = {};
        
        var parameters = {}; // все параметры
        var selected = {}; // выбранные параметры
        
        var colorGenerator = d3.scale.category10();

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function getElement(translations, key){
            function recFind(items){
                var finded;
                items.some(function(item){
                    //if (item.id && item.id == id){
                    if (item.key && item.key == key){
                        finded = item;
                    } else if (item.lists instanceof Array){
                        finded = recFind(item.lists);
                    }
                    return !!finded;
                });
                return finded;
            }
            
            var item = recFind(translations.pages);
            if (!item) return;
            return item;
        }
        
        function applyOldParameters(oldParams, newParams, type) {
            // if (type == 'demography'){
            //     var a = 10;    
            // }
            var oldParam = oldParams[type];
            var newParam = newParams[type];
            recApply(oldParam, newParam);
            
            function recApply(oldParam, newParam){
                if (!oldParam || !newParam) return;
                
                if (oldParam.selected){
                    newParam.selected = oldParam.selected;
                }
                if (oldParam.interested){
                    newParam.interested = oldParam.interested;
                }
                
                if (newParam.lists instanceof Array && oldParam.lists instanceof Array) {
                    angular.forEach(newParam.lists, function(newList){
                        var oldList = oldParam.lists.find(function(oldList){
                            return ((oldList.key && oldList.key == newList.key) || 
                                    (angular.isNumber(oldList.id) && oldList.id == newList.id))
                        });
                        
                        recApply(oldList, newList);
                    });
                }
            }
        }
        
        function extendTranslations(translations){
            // translations.pages.push({
            //     key: "fan_type",
            //     name: "Тип боления",
            //     lists: [{
            //         id: 1,
            //         name: "Монолайнеры"
            //     },{
            //         id: 2,
            //         name: "Традиционалисты"
            //     },{
            //         id: 3,
            //         name: "Спокойные"
            //     },{
            //         id: 4,
            //         name: "Горячие"
            //     },{
            //         id: 5,
            //         name: "Одержимые"
            //     }]
            // });
        }
        
        function extendAfterProcessing(){
            parameters.time_week.lists.forEach(function(item, index){
                item.id = index+1;
            })
        }
            
        function prepareParams(translations) {

            // TODO мок на время отсутствия бекенда
            extendTranslations(translations);
            
            var oldParameters = parameters;
            var oldSelected = selected;
            
            parameters = {}; // все параметры
            selected = {}; // выбранные параметры

            
            parametersNames.forEach(function(type) {
                //angular.isFunction(parametersWatchers[type]) && parametersWatchers[type]();
                var oldWatchFunction = parametersWatchers[type]
                if (angular.isFunction(oldWatchFunction)) {
                    try { // почему-то в FF отписка от watch вызывает ошибку
                        oldWatchFunction();
                    } catch (err){}
                }
                
                parameters[type] = getElement(translations, type);
                applyOldParameters(oldParameters, parameters, type);
                
                selected[type] = getSelectedParamsRec(parameters[type]);
                parametersWatchers[type] = $rootScope.$watch(function(){return parameters[type]; }, function(newValue, oldValue){
                    selected[type] = getSelectedParamsRec(newValue);

                    // игнорируем первый вызов $watch
                    if (newValue != oldValue) {
                        $rootScope.$broadcast('ParamsSrv.paramsChanged', type, selected[type]);
    
                        if (['demography','consume','regions'].indexOf(type) >= 0){
                            AudienceCountSrv.getCount(getSelectedAudience());
                        }
                    }
                }, true);
            });

            
            // проставляем спортам клубы
            parameters.sport.lists.forEach(function(item){
                
                prepareChildren('clubs');
                prepareChildren('players');
                prepareChildren('leagues');
                prepareChildren('playgrounds');
                prepareChildren('tournaments');
                
                function prepareChildren(type){
                    var childObj = item.lists.filter(function(child){return child.key == type;});
                    if (childObj.length && childObj[0].lists && childObj[0].lists.length)
                        item[type] = childObj[0].lists;
                    else item[type] = [];
                }

                // проставляем для каждой лиги клубы
                item.leagues.forEach(function(league){
                   league.clubs = league.clubs.map(function(clubId){
                       for(var i=0; i < item.clubs.length; i++)
                           if(item.clubs[i].id == clubId)
                               return item.clubs[i];
                       return null;
                   }).filter(function(club){return !!club; });
                    
                    
                    // TODO хардкодим, какие лиги показываются в аналитике!!!
                    if(league.name == "КХЛ" || league.name == "РФПЛ")
                        league.showInAnalytics = true;
                });
                item.disableSelectionInAnalytics = true;
            });


            extendAfterProcessing();

            //var colorGenerator = d3.scale.category10();
            parametersNames.forEach(function(type){
                var params = parameters[type];
                if (!params || !params.lists) return;
                
                params.lists.forEach(function(item){
                    item.chartColor = getItemColor(type, item);
                    
                    // var id = item.id;
                    // id = Number.parseInt(id) % 10;
                    // if(!Number.isNaN(id)) {
                    //     item.chartColor = colorGenerator(id);
                    // }
                });
            });
            // parameters.region.lists.forEach(function(item){
            //     item.chartColor = '#777777';
            // })
            
        }
        
        function getItemColor(type, item){
            var colors = ConfigSrv.get().colors;
            var typeColors = colors && colors[type];
            var color = typeColors && (typeColors[item.id] || typeColors[item.key]);
            
            if (!color){
                var id = item.id;
                id = Number.parseInt(id) % 10;
                if(!Number.isNaN(id)) {
                    // var colorGenerator = d3.scale.category10();
                    color = colorGenerator(id);
                }
            }
            //return color || '#000';
            return color;
        }
        
        
        function clearSelection(type){
            clearRec(parameters[type]);
            
            function clearRec(item) {
                if (item.selected) item.selected = false;
                if (item.interested) item.interested = false;

                item.lists && item.lists.forEach(function (subitem) {
                    clearRec(subitem);
                });
            }
        }

        function selectAll(type){
            var lists = parameters[type] && parameters[type].lists;
            if (!lists) return;
            lists.forEach(function (item) {
                if (item.interested !== undefined) item.interested = true;
                else item.selected = true;
            });
        }

        function getSelectedParamsRec(item){
            if (!item) return undefined;
            
            if (item.lists && item.lists.some(function(subitem){return !subitem.lists; })){ // терминальный лист (age, clubs)
                var selectedA = item.lists.filter(function(subitem){return subitem.selected; })
                    .map(function(subitem){return subitem.id});
                if (selectedA.length){
                    return selectedA.length ? selectedA : undefined;
                }
            } else {
                var res = {};
                // проходим по дочерним, только если текущий не отмечен, как выбранный
                if (item.selected !== false && item.interested !== false) {
                    /*item.lists && */item.lists.forEach(function (subitem) {
                        if (!subitem.key) return;
                        var subitemList = getSelectedParamsRec(subitem);
                        if (subitemList) {
                            res[subitem.key] = subitemList;
                        } //else res[subitem.id] = []; //  TODO comment this line
                    });
                }
                if (item.interested) // хардкодим для спорта
                    res.interested = true;
                return Object.keys(res).length ? res : undefined;
            }
        }

        function getSelectedParams(itemName){
            //return getSelectedParamsRec(parameters[itemName]);
            //return selected[itemName];
            if (itemName)
                return selected[itemName];
            else 
                return selected;
        }

        function getSelectedAudience(){
            // return {
            //     demography: getSelectedParams('demography'),
            //     regions: getSelectedParams('regions'),
            //     consume: getSelectedParams('consume')
            // };
            var regions = selected['regions'];
            return {
                demography: selected['demography'],
                // regions: selected['regions'],
                regions: regions,// ? {region:regions} : undefined,
                consume: selected['consume']
            };
        }
        
        function isAudienceSelected(){
            return !!selected['demography'] || !!selected['regions'] || !!selected['consume'];
        }
        
        function isSportSelected() {
            return !!selected['sport'];
        }

       

        function getSelectedDemographyCaption(){
            var demography = parameters.demography;
            var results = [];
            demography.lists.forEach(function(list){
                var selected = list.lists.filter(function(sublist){
                   return sublist.selected;
                }).map(function(sublist){
                    return sublist.name;
                }).join(', ');
                if (selected)
                    results.push({
                        name: list.name,
                        data: selected
                    });
            });

            var result = results.map(function(obj){
                return obj.name + ': ' + obj.data;
            }).join('<br>');
            if (result)
                result = 'Профиль болельщика: <br>' + result;
            return result;
        }


        function getSelectedSportCaption(includeEmptySports){
            var sport = parameters.sport;
            var results = [];
            sport.lists.forEach(function(list){
                //var interestedObj = list.lists.filter(function(child){return child.id == 'clubs';});
                if (!list.interested) return;
                //var clubsObj = list.lists.filter(function(child){return child.id == 'clubs';});

                var selected = list.clubs.length && list.clubs.filter(function(sublist){
                //var selected = clubsObj.length && clubsObj[0].lists.filter(function(sublist){
                    return sublist.selected;
                }).map(function(sublist){
                    return sublist.name;
                }).join(', ');
                if (selected)
                    results.push({
                        name: list.name,
                        data: selected
                    });
                else if (includeEmptySports){
                    results.push({
                        name: list.name
                    });
                }
            });

            var result = results.map(function(obj){
                return obj.name + (obj.data ? ': ' + obj.data : '');
            }).join('<br>');
            if (result)
                result = 'Профиль спорта: <br>' + result;
            return result;
        }

       
        
        


        var me = {
            getRadars: getRadars,
            selectRadar: selectRadar,
            
            getParams: getParams,
            getSelectedParams: getSelectedParams,
            getSelectedAudience: getSelectedAudience,
            isAudienceSelected: isAudienceSelected,
            
            isSportSelected:isSportSelected,

            clearSelection: clearSelection,
            selectAll: selectAll,
            getSelectedDemographyCaption: getSelectedDemographyCaption,
            getSelectedSportCaption: getSelectedSportCaption

            //getSelectedAudience: getSelectedAudience,
            //getSelectedSports: getSelectedSports,
            

            // getDemography: function(){return parameters.demography;},
            // getConsume: function(){return parameters.consume;},
            // getSport: function(){return parameters.sport;},
            // getInterest: function(){return parameters.interest;},
            // getRooting: function(){return parameters.rooting;},
            // getInvolve: function(){return parameters.involve;},
            // getImage: function(){return parameters.image;}
        };


        return me;
    }
}());