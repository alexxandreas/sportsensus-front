(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('homeDir', homeDir);

    homeDir.$inject = [
        '$rootScope'
    ];

    function homeDir(
        $rootScope
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
                function(
                    $scope,
                    $routeParams,
                    $location,
                    $anchorScroll,
                    $window,
                    ApiSrv
                ){
                    $scope.actionItems = [
                        'Изучайте аудиторию,<br>выбирайте наиболее<br>релевантрую и лояльную',
                        'Измеряйте<br>эффективность',
                        'Формируйте или верифицируйте<br>спонсорские предложения<br>в режиме реального времени'
                    ];
                    
                    $scope.forWho = [{
                        title: 'Правообладатель',
                        items: [
                            'Доступ к данным об<br>аудитории спорта/клуба',
                            'Пакетирование спонсорских<br>предложений, обоснование<br>стоимости и эффективности',
                            'Увеличение общей<br>стоимости пакетов за счет<br>эффективного<br>комбинирования позиций'
                        ]
                    },{
                        title: 'Спонсор',
                        items: [
                            'Изучение спортивных<br>предпочтений целевой<br>аудитории бренда/продукта',
                            'Верификация спонсорских<br>предложений',
                            'Формирование<br>эффективного<br>спонсорского пакета'
                        ]
                    },{
                        title: 'Агенство',
                        items: [
                            'Профессиональная<br>аналитика спонсорских<br>пакетов',
                            'Быстрый и удобный доступ<br>к данным',
                            'Помощь в планировании<br>активационных кампаний'
                        ]
                    }];
                    
                    
                    
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

                    $scope.companyTypes = [
                        //{value: null, name: 'Тип компании', selected:true},
                        {value: 0, name: 'Спонсор'},
                        {value: 1, name: 'Правообладатель'},
                        {value: 2, name: 'Агенство'}
                    ];
                    
                    $scope.companyTypeFiz = function(fiz) {
                        if (arguments.length)
                            return $scope.regData.legal_status  = fiz ? 0 : 1;
                        else
                            return $scope.regData.legal_status  == 0 ? true : false;
                    };

                    $scope.companyTypeYur = function(yur) {
                        if (arguments.length)
                            return $scope.regData.legal_status  = yur ? 1 : 0;
                        else
                            return $scope.regData.legal_status  == 0 ? false : true;
                    };

                    
                    $scope.register = function(){
                        ApiSrv.register($scope.regData);
                    }
                    
                    $scope.scrollToRegistration = function(){
                        $scope.scrollTo('registration'); 
                    }
                    
                    $scope.scrollTo = function(id) {
                        var old = $location.hash();
                        $location.hash(id);
                        $anchorScroll();
                        //reset to old to keep any additional routing logic from kicking in
                        $location.hash(old);
                    }
                }]
        };
    }
}());
