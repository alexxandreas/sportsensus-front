(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('MultiPromiseSrv', MultiPromiseSrv);

    MultiPromiseSrv.$inject = [
        '$q'
    ];


    function MultiPromiseSrv(
        $q
    ) {
        
        function defer(){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var initialPromiseState = angular.copy(promise.$$state);
            var currentPromiseState = angular.copy(promise.$$state);
            
            var core = {
				resolve: deferred.resolve,
				reject: deferred.reject,
				notify: deferred.notify,
				then: promise.then
			};
				
			deferred.reset = function() {
			    angular.extend(promise.$$state, initialPromiseState);
			    currentPromiseState = angular.copy(promise.$$state);
			    deferred.notify('reset');
			}
			
            deferred.resolve = function() {
                angular.extend(promise.$$state, initialPromiseState);
				core.resolve.apply( deferred, arguments );
				currentPromiseState = angular.copy(promise.$$state);
			};
			
			deferred.reject = function() {
                angular.extend(promise.$$state, initialPromiseState);
				core.reject.apply( deferred, arguments );
				currentPromiseState = angular.copy(promise.$$state);
			};
			
			deferred.notify = function() {
			    var tempPromiseState = angular.copy(promise.$$state);
                angular.extend(promise.$$state, initialPromiseState);
				
				core.notify.apply( deferred, arguments );
				
				angular.extend(promise.$$state, tempPromiseState);
			};
			
			promise.getState = function(){
			    return currentPromiseState;
			}
			
			return deferred;
        }
        
        
        

        return {
            defer: defer
        };
    }
}());