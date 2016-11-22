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
                title: '@'
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
                        $scope.$parent.savePdf && $scope.$parent.savePdf({filename: $scope.title});
                    };

                    $scope.print = function(){
                        $scope.$parent.printPdf && $scope.$parent.printPdf();
                    };

                    $scope.send = function(){
                        $scope.$parent.sendPdf && $scope.$parent.sendPdf();
                    };
                    
                }]
        };
    }
}());
