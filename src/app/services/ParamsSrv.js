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
        'TranslationsSrv'
    ];


    /**
     * events:
     * ParamsSrv.paramsChanged type newValue oldValue. type in ['demography','consume','regions','region','sport','interest','rooting','involve','image','career]
     */
    function ParamsSrv(
        $rootScope,
        $http,
        $q,
        ApiSrv,
        AudienceCountSrv,
        ConfigSrv,
        TranslationsSrv
    ) {

        var padamsDefer = $q.defer();

        var parametersNames = ['demography','consume','regions','region','sport','interest','rooting','involve',
            'image','watch','walk','tvhome', 'tvcable','electronics','electronics_exist','gasoften','career',
            'decision', 'timeusage', 'time_week', 'visit_time', 'net','gamingplatform', 'gamingtime'];
        var parameters = {}; // все параметры
        var selected = {}; // выбранные параметры

        //var enums = null;
        /*ApiSrv.getEnums().then(function(data){
            enums = data;
            prepareParams();
            setParamsWatchers();
            padamsDefer.resolve(parameters);
        }, function(){
            padamsDefer.reject();
        });*/

        var translations = null; // {pages, translates}
        TranslationsSrv.getTranslations().then(function(data){
            translations = data;
            extendTranslations();
            prepareParams();
            setParamsWatchers();
            padamsDefer.resolve(parameters);
        }, function(){
            padamsDefer.reject();
        });

        function extendTranslations(){
            return;
          
        }


        // подписка на изменение параметров, для перезапроса count
        function setParamsWatchers(){

        }

        function prepareParams() {

            function isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

          

            function getElement(key){
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
                //recFillTranslations(item); // TODO убрать, когда будет переделан формат выдачи
                return item;
                
                // translations.translates = {}
            }

            parametersNames.forEach(function(type){
                parameters[type] = getElement(type);
                $rootScope.$watch(function(){return parameters[type]; }, function(newValue, oldValue){
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
                prepareChildren('leagues');
                prepareChildren('playgrounds');
                
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



            var colorGenerator = d3.scale.category10();
            parametersNames.forEach(function(type){
            //['sport','interest','involve','watch','walk'].forEach(function(type){
                parameters[type].lists.forEach(function(item){
                    var id = item.id;
                    id = Number.parseInt(id) % 10;
                    if(!Number.isNaN(id)) {
                        item.chartColor = colorGenerator(id);
                        //console.log(id + ' ' + typeof(id) + ' ' + item.chartColor);
                    }
                });
            });
            parameters.region.lists.forEach(function(item){
                item.chartColor = '#777777';
            })

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
            /*
            selectRec(parameters[type]);

            function selectRec(item) {
                if (item.selected !== undefined) item.selected = true;
                if (item.interested !== undefined) item.interested = true;

                item.lists && item.lists.forEach(function (subitem) {
                    selectRec(subitem);
                });
            }*/
        }

        function getSelectedParamsRec(item){
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

        // function getSelectedSports(){
        //     return getSelectedParamsRec(parameters.sport);
        // }
        //
        // function getSelectedInterest(){
        //     // return {
        //     //     sport: getSelectedParamsRec(parameters.sport),
        //     //     interest: getSelectedParamsRec(parameters.interest)
        //     // }
        //     return getSelectedParamsRec(parameters.interest);
        // }
        //
        // function getSelectedInterest(){
        //
        // }


        function getSelectedDemographyCaption(){
            var demography =parameters.demography;
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

        function getParams(){
            return padamsDefer.promise;
        }


        var me = {
            getParams: getParams,
            getSelectedParams: getSelectedParams,
            getSelectedAudience: getSelectedAudience,
            isAudienceSelected: isAudienceSelected,

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