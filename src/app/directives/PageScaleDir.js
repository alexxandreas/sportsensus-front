(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('pageScaleDir', pageScaleDir);

	pageScaleDir.$inject = [
		'$rootScope',
		'$window'
	];

	function pageScaleDir(
		$rootScope,
		$window
	)    {
		return {
			restrict: 'A',
			//scope: {
			//	pageScaleDir: '='
			//},
		
			link: function ($scope, $el, attrs) {
			    
			    var originalWidth = 1420;
			    
				angular.element($window).bind('resize', onResize);
                onResize();
                
                function onResize(){
                    var width = $window.innerWidth;
                    
                    var scale = Math.max(Math.min(width / originalWidth, 1), 0.7);
                    
                    $el.css({zoom: scale});

                    // manuall $digest required as resize event
                    // is outside of angular
                    // $scope.$digest();
                    setTimeout(function(){ $scope.$digest(); });
                }
			
			}
		};
	}
}());
