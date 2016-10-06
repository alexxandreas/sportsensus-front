(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('ParamsSrv', ParamsSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['ParamsSrv', function(ParamsSrv) {

    }]);

    // angula
    // r.module('SportsensusApp').run(ParamsSrv.init);

    ParamsSrv.$inject = [
        '$rootScope',
        '$http',
        '$q',
        'ApiSrv',
        'ConfigSrv'
    ];


    /**
     * events:
     * ParamsSrv.paramsChanged type newValue oldValue. type in ['demography','consume','regions','sport','interest','rooting','involve','image']
     */
    function ParamsSrv(
        $rootScope,
        $http,
        $q,
        ApiSrv,
        ConfigSrv
    ) {

        var padamsDefer = $q.defer();

        var parametersNames = ['demography','consume','regions','sport','interest','rooting','involve','image'];
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
        ApiSrv.getTranslations().then(function(data){
            translations = data;
            prepareParams();
            setParamsWatchers();
            padamsDefer.resolve(parameters);
        }, function(){
            padamsDefer.reject();
        });

        // подписка на изменение параметров, для перезапроса count
        function setParamsWatchers(){

        }

        function prepareParams() {

            function getElement(id){
                function isNumber(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }
                /*function recFillTranslations(item){ // TODO убрать, когда будет переделан формат выдачи
                    if (!(item.lists instanceof Array)) return;
                    if (item.lists.every(function(subitem){return isNumber(subitem);})){
                        item.lists = item.lists.map(function(subitem){
                            return {
                                id: subitem,
                                name: translations.translates[item.id + '_' + subitem]
                            }
                        })
                    } else {
                        item.lists.forEach(function(subitem){
                            recFillTranslations(subitem);
                        })
                    }
                }*/
                
                function recFind(items){
                    var finded;
                    items.some(function(item){
                        if (item.id && item.id == id){
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

                    $rootScope.$broadcast('ParamsSrv.paramsChanged', type, selected[type]);

                    if (['demography','consume','regions'].indexOf(type) >= 0){
                        ApiSrv.getCount(getSelectedAudience());
                    }
                }, true);
            });

            // TODO убрать! хардкодим числовые ключи для спортов
            var allSports = {
                "football":1, 
                "hockey":2, 
                "basketball":3, 
                "car":4, 
                "figskating":5, 
                "biathlon":6, 
                "boxing":7, 
                "tennis":8
            };
            var colorGenerator = d3.scale.category10();
            parameters.sport.lists.forEach(function(item){
                item.key = allSports[item.id];
                item.chartColor = colorGenerator(allSports[item.id]);
            });
            parameters.interest.lists.forEach(function(item){
                item.chartColor = colorGenerator(item.id);
            });
            parameters.involve.lists.forEach(function(item){
                item.chartColor = colorGenerator(item.id);
            });




            // $rootScope.$watch(function(){return [
            //     parameters.demography,
            //     parameters.consume,
            //     parameters.regions
            // ]}, audienceChanged, true);
            //
            // function audienceChanged(){
            //     var audience = getSelectedAudience();
            //     ApiSrv.getCount(audience);
            // }
 
           

        }


        function getSelectedParamsRec(item){
            if (item.lists.every(function(subitem){return !subitem.lists; })){ // терминальный лист (age, clubs)
                var selectedA = item.lists.filter(function(subitem){return subitem.selected; })
                    .map(function(subitem){return subitem.id});
                if (selectedA.length){
                    return selectedA.length ? selectedA : undefined;
                }
            } else {
                var res = {};
                // проходим по дочерним, только если текущий не отмечен, как выбранный
                if (item.selected !== false && item.interested !== false) {
                    item.lists.forEach(function (subitem) {
                        var subitemList = getSelectedParamsRec(subitem);
                        if (subitemList) {
                            res[subitem.id] = subitemList;
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
            return {
                demography: selected['demography'],
                regions: selected['regions'],
                consume: selected['consume']
            };

            var demography = {
                    age:[],
                    gender:[],
                    familysize:[],
                    children:[],
                    income:[],
                    career:[],
                    family:[]
            };
            var consume = {
                    gaming: {
                        gamingtime:[],
                        gamingplatform:[]
                    },
                    mobile: {
                        mobileprovider:[],
                        mobilenet:[]
                    },
                    electronics: {
                        electronics_exist:[],
                        decision:[],
                        buy_time: {
                            smart:[],
                            tablet:[],
                            laptop:[],
                            computer:[]
                        }
                    },
                    tv: {
                        tvhome:[],
                        tvcable:[],
                        tvsputnic:[]
                    },
                    car: {
                        carexist:[],
                        gasyear:[],
                        gasoften:[],
                        bus:[],
                        oil:[]
                    },
                    money: {
                        services_now:[],
                        services_desicion:[],
                        realestate:[],
                        insurance:[],
                        insurance_decision:[]
                    },
                    antivirus:[],
                    timeusage: {
                        time_week: {
                            net:[],
                            book:[],
                            sport:[],
                            hobby:[],
                            shops:[],
                            sport_events:[]
                        },
                        visit:[],
                        visit_time: {
                            centre:[],
                            cinema:[],
                            fitness:[],
                            yoga:[]
                        }
                    }
            };
            var regions = {
                region:[],
                fedregion:[]
            }
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




        function getParams(){
            return padamsDefer.promise;
        }


        var me = {
            getParams: getParams,
            getSelectedParams: getSelectedParams,
            getSelectedAudience: getSelectedAudience
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