(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('downloadDir', downloadDir);

    downloadDir.$inject = [
        '$rootScope'
    ];

    function downloadDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            replace: true,
            //scope: true,
            scope: {
                title: '@',
                subtitle: '@'
                //savePdf: '&savePdf'
            },
            transclude: true,
            templateUrl: '/views/widgets/buttons/downloadPDF/downloadPDF.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                
                function(
                    $scope
                    
                ) {
                    $scope.save = function(){
                        $scope.$parent.savePdf && $scope.$parent.savePdf({filename: $scope.filename || $scope.title});
                    };

                    $scope.print = function(){
                        $scope.$parent.printPdf && $scope.$parent.printPdf({filename: $scope.filename || $scope.title});
                    };

                    $scope.send = function(){
                        $scope.$parent.sendPdf && $scope.$parent.sendPdf({
                            title: $scope.title,
                            filename: $scope.title,
                            message: ($scope.subtitle || '' ) + '<br>'
                        });
                    };
                    
                }]
        };
    }
}());
