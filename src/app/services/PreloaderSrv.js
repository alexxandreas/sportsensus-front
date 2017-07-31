(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('PreloaderSrv', PreloaderSrv);

    // инициализируем сервис
    angular.module('SportsensusApp').run(['PreloaderSrv', function(PreloaderSrv) {

    }]);

    // angula
    // r.module('SportsensusApp').run(PreloaderSrv.init);

    PreloaderSrv.$inject = [
        '$rootScope'
    ];


    function PreloaderSrv(
        $rootScope
    ) {
        
        function showWait(parent){
            $mdDialog.show({
                controller: waitCtrl,
                template: '<md-dialog style="background-color:transparent;box-shadow:none">' +
                            '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait" style="overflow: hidden">' +
                                '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>' +
                            '</div>' +
                         '</md-dialog>',
                parent: parant || angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: false
            })
            .then(function(answer) {
            
            });
            
            function waitCtrl($rootScope, $mdDialog) {
                $rootScope.$on("PreloaderSrv.hideWait", function (event, args) {
                    $mdDialog.cancel();
                });
            }

		}
   
        function hideWait(){
            $rootScope.$emit("PreloaderSrv.hideWait"); 
        }
        
        var me = {
            
        };


        return me;
    }
}());