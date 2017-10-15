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
        
        function getCheckAccessTemplate(type, defaultTemplate){
	    	return '<check-access-dir type="' + (type || '') + '">' + defaultTemplate + '</check-access-dir>'
	    }
	    
	    function activateController($scope, $location, $mdDialog, ApiSrv) {
    		var code = $location.search().code;
    		if (code){
    			ApiSrv.activate(code).then(function(){
    				showAlert('Учётная запись успешно активирована');
    				$location.search('code', undefined);
    				$location.path('/');
    			}, function(){
    				showAlert('Ошибка активации учётной записи');
    				$location.search('code', undefined);
    				$location.path('/');
    			})
    		} else {
    			$location.path('/');
    		}
    
    		function showAlert(text) {
    			$mdDialog.show(
    				$mdDialog.alert()
    					.title('Активация учетной записи')
    					.textContent(text)
    					.ok('OK')
    			);
    		}
    	}
    	activateController.$inject = ['$scope', '$location', '$mdDialog', 'ApiSrv'];
	
	    function getUserAuthResolver(options) {
    		return {
    			userAuthResolver: ['ApiSrv', 'UserSrv', '$location', '$q', function(ApiSrv, UserSrv, $location, $q) {
    				return UserSrv.getUserCheckPromise().then(function(user){
    					return;
    				}, function(){
    					$location.path('/');
    					return $q.reject();
    				})
    			}]
    		};
    	}
	
	
        var routes = {
            'root': {
                path: '/',
                template: '<home-dir></home-dir>'
            },
            'login': {
                path: '/login/', 
                template: '<login-dir></login-dir>'
            },
            'activate': {
                path: '/activate/',
				template: ' ',
				controller: activateController
			},
			'account': {
    			path: '/account/',
				template: getCheckAccessTemplate(null, '<account-dir></account-dir>'),
				resolve: getUserAuthResolver()
			},
            'infobox': {
                path: '/infobox/',
                template: getCheckAccessTemplate('infoblock', '<infobox-dir></infobox-dir>'),
				resolve: getUserAuthResolver()
            },
            // остальные роуты для инфоблока ниже, в цикле
            
    //         'infobox:regions': {
    //             path: '/infobox/regions/',
    //             template: getCheckAccessTemplate('infoblock', '<infobox-dir><articles-dir></articles-dir></infobox-dir>'),
				// resolve: getUserAuthResolver()
    //         },
            'analytics': {
                path: '/analytics/',
                template: getCheckAccessTemplate('rightholder,sponsor', '<analytics-dir></analytics-dir>'),
				resolve: getUserAuthResolver()
            },
            'cases': {
                path: '/articles/',
                template: getCheckAccessTemplate('cases', '<articles-dir></articles-dir>'),
				resolve: getUserAuthResolver()
            },
            'cases:id': {
                path: '/articles/:articleId',
				// template: '<article-dir></article-dir>',
				template: getCheckAccessTemplate('cases', '<article-dir></article-dir>'),
				resolve: getUserAuthResolver()
            },
            
            /** ADMIN **/
            
            'admin': {
                path: '/admin/',
                template: getCheckAccessTemplate('admin', '<admin-dir></admin-dir>'),
				resolve: getUserAuthResolver()
            },
            
            'admin:articles': {
                path: '/admin/articles/',
				// template: '<admin-articles-dir></admin-articles-dir>',
				template: getCheckAccessTemplate('admin', '<admin-articles-dir></admin-articles-dir>'),
				resolve: getUserAuthResolver()
			},
			
			'admin:profiles': {
			    path: '/admin/profiles/',
				//template: '<admin-profiles-dir></admin-profiles-dir>',
				template: getCheckAccessTemplate('admin', '<admin-profiles-dir></admin-profiles-dir>'),
				resolve: getUserAuthResolver()
			},
			
			'admin:profiles:id': {
			    path: '/admin/profiles/:userId',
				// template: '<admin-profile-dir></admin-profile-dir>',
				template: getCheckAccessTemplate('admin', '<admin-profile-dir></admin-profile-dir>'),
				resolve: getUserAuthResolver()
			},
			
			'admin:sendMail:id': {
			    path: '/admin/sendMail/:userId?',
				// template: '<admin-send-mail-dir></admin-send-mail-dir>',
				template: getCheckAccessTemplate('admin', '<admin-send-mail-dir></admin-send-mail-dir>'),
				resolve: getUserAuthResolver()
			},
			
			'admin:cases': {
			    path: '/admin/cases/',
				// template: '<admin-cases-dir></admin-cases-dir>',
				template: getCheckAccessTemplate('admin', '<admin-cases-dir></admin-cases-dir>'),
				resolve: getUserAuthResolver()
			},
			
			'admin:cases:id': {
			    path: '/admin/cases/:caseId',
				// template: '<admin-case-dir></admin-case-dir>',
				template: getCheckAccessTemplate('admin', '<admin-case-dir></admin-case-dir>'),
				resolve: getUserAuthResolver()
			}
            
        };
        
        // роуты для инфоблока
        var infoblockRoutes = {
            'demography': '<infobox-demography-dir></infobox-demography-dir>',
            'consume': '<infobox-consume-dir></infobox-consume-dir>',
            'regions': '<infobox-regions-dir></infobox-regions-dir>',
            
            'sport': '<infobox-sport-dir></infobox-sport-dir>',
            'interest': '<infobox-interest-dir></infobox-interest-dir>',
            'rooting': '<infobox-rooting-dir></infobox-rooting-dir>',
            'involve': '<infobox-involve-dir></infobox-involve-dir>',
            'image': '<infobox-image-dir></infobox-image-dir>',
            
            'expressAudience': '<infobox-express-audience-dir></infobox-express-audience-dir>',
            'expressSport': '<infobox-express-sport-dir></infobox-express-sport-dir>',
            'result': '<infobox-result-dir></infobox-result-dir>'    
        }
        angular.forEach(infoblockRoutes, function(template, key){
            routes['infobox:' + key] = {
                path: '/infobox/' + key + '/',
                template: getCheckAccessTemplate('infoblock', '<infobox-dir>' + template + '</infobox-dir>'),
				resolve: getUserAuthResolver()
            }
        })
        
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
        
        function getRoutes(){
            return routes;   
        }
        
        function getPath(type){
            var route = routes[type];
            return '#!' + route.path;
        }
        
        
        
        var me = {
            navigate: navigate,
            getCurrentRoute: getCurrentRoute,
            getRoutes: getRoutes,
            getPath: getPath
        };


        return me;
    }
}());