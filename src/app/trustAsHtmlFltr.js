(function () {
    "use strict";
    angular.module('SportsensusApp')
        .filter('trustAsHtmlFltr', trustAsHtmlFltr);

    trustAsHtmlFltr.$inject = ['$sce'];

    function trustAsHtmlFltr($sce)
    {
        return function trustAsHtml(value) {
            return $sce.trustAsHtml(value);
        };
    }
}());
