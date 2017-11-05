(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('homeDir', homeDir);

    homeDir.$inject = [
        '$rootScope',
        '$mdDialog'
    ];

    function homeDir(
        $rootScope,
        $mdDialog
    )    {
        return {
            restrict: 'E',
            scope: {
            },
            templateUrl: '/views/widgets/home/homeNew.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$routeParams',
                '$location',
                '$anchorScroll',
                '$window',
                'ApiSrv',
                'RouteSrv',
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $anchorScroll,
                    $window,
                    ApiSrv,
                    RouteSrv
                ){
                    $scope.actionItems = [
                        'Изучайте аудиторию,<br>выбирайте наиболее<br>релевантрую и лояльную',
                        'Измеряйте<br>эффективность',
                        'Формируйте или верифицируйте<br>спонсорские предложения<br>в режиме реального времени'
                    ];
                    
                    $scope.forWho = [{
                        title: 'Правообладатель',
                        type: 1,
                        items: [
                            'Доступ к данным об<br>аудитории спорта/клуба',
                            'Пакетирование спонсорских<br>предложений, обоснование<br>стоимости и эффективности',
                            'Увеличение общей<br>стоимости пакетов за счет<br>эффективного<br>комбинирования позиций'
                        ]
                    },{
                        title: 'Спонсор',
                        type: 0,
                        items: [
                            'Изучение спортивных<br>предпочтений целевой<br>аудитории бренда/продукта',
                            'Верификация спонсорских<br>предложений',
                            'Формирование<br>эффективного<br>спонсорского пакета'
                        ]
                    },{
                        title: 'Агенство',
                        type: 2,
                        items: [
                            'Профессиональная<br>аналитика спонсорских<br>пакетов',
                            'Быстрый и удобный доступ<br>к данным',
                            'Помощь в планировании<br>активационных кампаний'
                        ]
                    }];
                    
                    $scope.enterPath = RouteSrv.getPath('login');
                    
                    $scope.scrollToRegistration = function(type){
                        $scope.scrollTo('registration'); 
                        $scope.regData.company_type = type;
                    }
                    
                    $scope.scrollTo = function(id) {
                        var old = $location.hash();
                        $location.hash(id);
                        $anchorScroll();
                        //reset to old to keep any additional routing logic from kicking in
                        $location.hash(old);
                    }
                    
                    // $scope.regData = {
                    //     first_name:  '',
                    //     last_name: '',
                    //     company_name: '',
                    //     phone: '',
                    //     login: '',
                    //     company_type: null, // 0 - спонсор, 1 - правообладатель, 2 - агенство
                    //     legal_status: 0, // 0 - физ, 1 - юр
                    //     lang: "ru"
                    // };
                    clearRegisterFields();

                    $scope.companyTypes = [
                        //{value: null, name: 'Тип компании', selected:true},
                        {value: 0, name: 'Спонсор'},
                        {value: 1, name: 'Правообладатель'},
                        {value: 2, name: 'Агенство'}
                    ];
                    
                    $scope.register = function(){
                        $scope.showPreloader = true;
                        // return;
                        ApiSrv.register($scope.regData).then(function(){
                            clearRegisterFields();
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Регистрация')
                                .htmlContent('Благодарим за регистрацию! Вам на почту отправлено письмо<br>'+
                                    'с данными для входа на сайт и ссылкой активации. В ближайшее время<br>'+
                                    'с Вами свяжется наш менеджер. Если Вам по какой либо причине<br>'+
                                    'не пришло наше сообщение – пожалуйста, напишите нам на <a href="mailto:sales@sportsensus.ru">sales@sportsensus.ru</a>')
                                .ok('OK')
                            );
                            
                        }, function(){
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .htmlContent('Благодарим за попытку регистрации!<br>'+
                                    'К сожалению, она закончилась неудачно. Пожалуйста, <br>'+
                                    'попробуйте ещё раз, или напишите нам на <a href="mailto:sales@sportsensus.ru">sales@sportsensus.ru</a>')
                                .ok('OK')
                            );
                        }).finally(function(){
                            $scope.showPreloader = false;
                        });
                    }
                    
                    function clearRegisterFields(){
                        $scope.regData = {
                            first_name:  '',
                            last_name: '',
                            company_name: '',
                            phone: '',
                            login: '',
                            company_type: null, // 0 - спонсор, 1 - правообладатель, 2 - агенство
                            legal_status: 0, // 0 - физ, 1 - юр
                            lang: "ru"
                        };
                    }
                    
                }]
        };
    }
}());
