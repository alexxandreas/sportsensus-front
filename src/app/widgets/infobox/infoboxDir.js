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
            },
            templateUrl: '/views/widgets/infobox/infobox.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$window',
                'ParamsSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $window,
                    ParamsSrv
                ) {
                    $scope.audienceCountText = null;

                    $scope.audienceMenu = [{
                        id:'demography',
                        text:'Социальная демография'
                    },{
                        id:'consume',
                        text:'Потребительское поведение'
                    },{
                        id:'regions',
                        text:'География'
                    }];
                    
                    $scope.sportinfoMenu = [{
                        id:'sport',
                        text:'Спорт'
                    },{
                        //id:'interest',
                        id:'interestGraph',
                        text:'Степень интереса'
                    },{
                        id:'rooting',
                        text:'Сила боления'
                    },{
                        id:'involve',
                        text:'Причастность к видам спорта'
                    },{
                        id:'imageGraph',
                        text:'Восприятие видов спорта'
                    }];

                    $scope.pages = {};
                    ['imageGraph'].forEach(function(page){
                        $scope.pages[page] = {id:page};
                    });
                    


                    ParamsSrv.getParams().then(function(params){
                        $scope.parameters = params;
                    });


                    $scope.activePage = null;
                    $scope.activeMenuItem = null;
                    $scope.setActiveMenuItem = function(item){
                        $scope.activeMenuItem = item;
                        $scope.activePage = item;
                    };
                    
                    
                    
                    // возвращает все наборы параметров, включая вложенные в виде линейной структуры
                    $scope.getAllSubchildren = function(item){
                        if (!item) return;
                        var finalItems = [];
                        if (!item.lists || item.lists.every(function(subitem){ return !subitem.lists; }))
                            finalItems.push(item);
                        else item.lists.forEach(function(subitem){
                            finalItems = finalItems.concat($scope.getAllSubchildren(subitem));
                        });
                        return finalItems;
                    };

                    $scope.pathClick = function(){
                        $scope;
                        var a = 10;
                    };

                    $scope.checkButtonClick = function(){
                        if ($scope.activeMenuItem && $scope.activeMenuItem.id == 'image'){
                            $scope.activePage = $scope.pages.imageGraph;
                            
                        }
                       
                        var a = 10;
                    };

                    
                    $scope.$on('ApiSrv.countError', function(){
                        $scope.audienceCountText = 'Болельщики: ошибка загрузки';
                    });

                    $scope.$on('ApiSrv.countLoaded', function(event, result){
                        if (result.is_valid_count)
                            $scope.audienceCountText = 'Болельщики: ' + result.audience_count.toLocaleString();
                        else
                            $scope.audienceCountText = 'Болельщики: недостаточно данных';// + ' ' + result.audience_count.toLocaleString();
                    });
                    
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

                    // кнопки левого меню
                    function a() {
                        iApp.Utils.bind(this.dom.button_menu, 'click', function (event) {
                            var button = event.target;
                            var id = button.getAttribute('data-id');

                            iApp.Utils.each(this.dom.button_menu, function (item) {
                                item.classList.remove('l-board__menu-button_active');
                            });

                            this.dom.body.style.display = '';
                            this.dom.express.style.display = '';
                            iApp.Utils.each(this.dom.box, function (item) {
                                if (item.getAttribute('data-id') == id) {
                                    item.style.display = 'flex';
                                } else {
                                    item.style.display = '';
                                }
                            });

                            button.classList.add('l-board__menu-button_active');
                        }.bind(this));

                        // кнопка Показать результаты
                        this.dom.check_button_result.addEventListener('click', function () {
                            var data = new FormData(this.dom.form);
                            var list_data = {};
                            var names = [];
                            data.forEach(function (value, key) {
                                list_data[key] = value;
                                names.push(key);
                            });

                            names = names.join('||');

                            if (Object.keys(list_data).length) {
                                this.dom.body.style.display = 'none';
                                this.dom.express.style.display = 'block';

                                console.log(this.is_info_sportinterest(names))

                                if (this.is_info_sportinterest(names)) {
                                    iApp.post('/infobox/info_sportinterest/', data, function (response) {
                                        response = iApp.Utils.parse_json(response);
                                        console.log(response)
                                        this.dom.express.innerHTML = response.template;
                                        iApp.define(iApp.blocks.gInfo, this.dom.express);
                                    }.bind(this));
                                    return;
                                }

                                if (this.is_info_fan_involvment(names)) {
                                    iApp.post('/infobox/info_fan_involvment/', data, function (response) {
                                        response = iApp.Utils.parse_json(response);
                                        console.log(response);
                                        this.dom.express.innerHTML = response.template;
                                        iApp.define(iApp.blocks.gInfo, this.dom.express);
                                    }.bind(this));
                                    return;
                                }

                                if (names.indexOf('image') > -1) {
                                    iApp.post('/infobox/info_sportimage/', data, function (response) {
                                        response = iApp.Utils.parse_json(response);
                                        //console.log(response);
                                        this.dom.express.innerHTML = response.template;
                                        //iApp.define(iApp.blocks.gInfo, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardChartRadar, this.dom.express);
                                    }.bind(this));
                                    return;
                                }
                                var path = '/infobox/express/';
                                if (
                                    names.indexOf('sport') > -1 ||
                                    names.indexOf('interest') > -1 ||
                                    names.indexOf('involve') > -1 ||
                                    names.indexOf('image') > -1
                                ) {
                                    path = '/infobox/express_sport/';
                                }

                                iApp.post(path, data, function (response) {
                                    response = iApp.Utils.parse_json(response);

                                    if (response.status) {
                                        console.log(response)
                                        this.dom.express.innerHTML = response.template;

                                        iApp.Utils.bind(this.dom.express.querySelectorAll('.l-board__chart-panel-hide'), 'click', function (event) {
                                            event
                                                .currentTarget
                                                .parentNode
                                                .parentNode
                                                .querySelector('.l-board__chart-box-body')
                                                .classList
                                                .toggle('l-board__chart-box-body_hide')
                                        });

                                        iApp.define(iApp.blocks.lBoardCharts, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardCircleChart, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardDubleChart, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardCustomChart, this.dom.express);
                                        iApp.define(iApp.blocks.lBoardChartCareer, this.dom.express);


                                        if (response.express) {
                                            //this.create_charts(response.express);
                                            iApp.Utils.each(
                                                this.dom.express.querySelectorAll('canvas'),
                                                function (canvas) {
                                                    var data = iApp.Utils.parse_json(canvas.getAttribute('data-data'));
                                                    var type = canvas.getAttribute('data-type') || 'doughnut';

                                                    this.create_canvas(canvas, data, type);
                                                }.bind(this));

                                        } else if (response.express_sport) {

                                            iApp.Utils.each(
                                                this.dom.express.querySelectorAll('canvas'),
                                                function (canvas) {
                                                    var data = iApp.Utils.parse_json(canvas.getAttribute('data-init'));
                                                    var type = canvas.getAttribute('data-type') || 'doughnut';

                                                    this.create_canvas(canvas, data, type);
                                                }.bind(this));
                                            //this.create_charts(response.express_sport);
                                        } else if (response.image) {
                                            //this.create_charts(response.express);
                                            iApp.Utils.each(
                                                this.dom.express.querySelectorAll('canvas'),
                                                function (canvas) {
                                                    var data = iApp.Utils.parse_json(canvas.getAttribute('data-init'));
                                                    var type = canvas.getAttribute('data-type') || 'doughnut';

                                                    this.create_canvas(canvas, data, type);
                                                }.bind(this));
                                        }
                                    }

                                }.bind(this));
                            }
                        }.bind(this));
                    }
                }]
        };
    }
}());
