(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('fileModelDir', fileModelDir);

	fileModelDir.$inject = [
		'$rootScope',
		'$parse'
	];

	function fileModelDir(
		$rootScope,
		$parse
	)    {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModelDir);
                var modelSetter = model.assign;
                
                // var openEvent = $parse(attrs.fileModelOpenEvent);
                var openEvent = attrs.fileModelOpenEvent;
                openEvent && scope.$on(openEvent, function(){
                    element[0].click();
                });
    
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
		};
	}
}());

