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
            scope: true,
            templateUrl: '/views/widgets/buttons/downloadPDF/downloadPDF.html',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                
                function(
                    $scope
                    
                ) {
                    $scope.save = function(){
                        $scope.saveAsPdf && $scope.saveAsPdf();
                    };

                    $scope.print = function(){

                    };

                    $scope.send = function(){

                    };
                    
                }]
        };
    }
}());
