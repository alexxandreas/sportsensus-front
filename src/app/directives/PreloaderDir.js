(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('preloaderDir', preloaderDir);

	preloaderDir.$inject = [
		'$rootScope',
		'$compile'
	];

	function preloaderDir(
		$rootScope,
		$compile
	)    {
		return {
			restrict: 'A',
			scope: {
				preloaderDir: '='
			},
		
			link: function ($scope, $el, attrs) {
			    var divTemplate = '<div layout="row" layout-align="center center" '+
			        'style="background-color: rgba(49, 37, 37, 0.2);top: 0;left: 0;height: 100%;width: 100%;position: absolute;">'+
			        '<md-progress-circular md-mode="indeterminate" ></md-progress-circular>'+
			        '</div>'
				
                var div = angular.element(divTemplate);
                $compile(div)($scope);
                
                $el.css( "position", "relative" );
				
				$scope.$watch('preloaderDir', function(value){
    				if (value === true) {
    				    $el.append(div);
    				} else {
    				    //$el.remove(div);
    				    div.remove();
    				}
    			});
			
			}
		};
	}
}());
