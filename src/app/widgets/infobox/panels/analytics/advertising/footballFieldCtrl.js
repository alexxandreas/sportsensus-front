(function () {
	"use strict";
	/**
	 * @desc
	 */
	angular.module('SportsensusApp')
		.controller('footballFieldCtrl', footballFieldCtrl);

	footballFieldCtrl.$inject = [
		'$scope',
		'$controller',
		'ParamsSrv',
		'ApiSrv'
	];

	function footballFieldCtrl(
		$scope,
		$controller,
		ParamsSrv,
		ApiSrv
	) {

		// Вид спорта «Футбол» средние показатели за матча РПФЛ 2015-16
		
	}

}());
