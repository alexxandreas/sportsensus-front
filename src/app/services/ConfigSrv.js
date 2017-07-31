(function () {
    "use strict";
    angular.module('SportsensusApp')
        .factory('ConfigSrv', ConfigSrv);


    function ConfigSrv() {
        var conf = {};
        var me = {
            set: function set(conf_) {
                conf = angular.extend({}, conf_);
            },
            _update: function _update(conf_) {
                angular.extend(conf, conf_);
            },
            get: function get() {
                return conf || {};
            }
        };
        return me;
    }
}());