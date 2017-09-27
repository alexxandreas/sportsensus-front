(function () {

    "use strict";
    angular.module('SportsensusApp')
        .factory('RouteSrv', RouteSrv);

    // инициализируем сервис
    // angular.module('SportsensusApp').run(['RouteSrv', function(RouteSrv) { }]);

    RouteSrv.$inject = [
        '$rootScope',
        // '$q',
        '$location'
        // 'UserSrv'
        // 'PluralSrv'
    ];


    function RouteSrv(
        $rootScope,
        // $q,
        $location
        // UserSrv
        // PluralSrv
    ) {
        
        var routes = {
            'infobox': {
                path: '/infobox/'
            },
            'analytics': {
                path: '/analytics/'
            },
            'cases': {
                path: '/articles/'
            },
            'login': {
                path: '/login/'
            },
            'account': {
                path: '/account/'
            },
            'admin': {
                path: '/admin/'
            },
            'root': {
                path: '/'
            }
        };
        Object.keys(routes).forEach(function(key){ routes[key].key = key; })
        
        function navigate(key) {
            var route = routes[key];
            if (!route) return;
            
            $location.path(route.path);
        }
        
        function getCurrentRoute() {
            var path = $location.path();
            var route = getRouteByPath(path);
            
            return route;
        }
        
        function getRouteByPath(path){
            var route;
            var routeKey = Object.keys(routes).forEach(function(key){
                //return route.path == path;
                if (routes[key].path == path)
                    route = routes[key];
            });
            return route || routes.root;
        }
        
        
        $rootScope.$on('$locationChangeSuccess', function () {
            //console.log('$locationChangeSuccess changed!', new Date());
            var currentRoute = getCurrentRoute();
            $rootScope.$broadcast('RouteSrv.locationChangeSuccess', currentRoute);
        });
        
        var me = {
            navigate: navigate,
            getCurrentRoute: getCurrentRoute
        };


        return me;
    }
}());