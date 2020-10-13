'use strict';
define(['config', 'angular-route', 'angular-resource', 'angular-cookies'], function(globalConfig){
	var app = angular.module('appModule', ['ngRoute', 'ngResource', 'ngCookies']);
	app.constant('constants',{});
	app.config([
		'$routeProvider',
		'routeResolverProvider',
		'$controllerProvider',
		'$compileProvider',
		'$filterProvider',
		'$httpProvider',
		'$provide',
		'$locationProvider',
		function (
			$routeProvider,
			routeResolverProvider,
			$controllerProvider, 
			$compileProvider, 
			$filterProvider,
			$httpProvider, 
			$provide,
			$locationProvider
			){
			$compileProvider.debugInfoEnabled(false);
			$locationProvider.hashPrefix('');
			$httpProvider.interceptors.push(function($q, $location, auth, message){
				return {
                    request: function (config) {
                        if (auth.getToken() !== null) {
                            config.headers['token'] = auth.getToken();
						}						
						return config;
					},
					responseError: function(response) {
						var status = response.status;
						if(status === 401) {
							if(window.unauthenticated < 1){
								auth.removeToken();
								$location.path('login');
								message.error('Please. Authentification');
								window.unauthenticated++;
							}							
						}else if(status === 403){
							auth.removeToken();
							$location.path('login');
							if(/Licencia Inactiva/.test(response.data))
								message.info('Licencia Inactiva');
							else 
								message.error('Access Error.');
						}
						return $q.reject(response);
					}
				};
			});
			app.register =
			{
				controller: $controllerProvider.register,
				directive: $compileProvider.directive,
				filter: $filterProvider.register,
				factory: $provide.factory,
				service: $provide.service
			};
			$httpProvider.defaults.headers.post['Accept'] = 'application/json';
			$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
			var route = routeResolverProvider.resolve;
            $routeProvider.when('/login', route('login'));
            $routeProvider.when('/todo', route('todo'));
            $routeProvider.when('/404', route('404'));
			$routeProvider.when('/', { redirectTo: '/todo' });
			$routeProvider.otherwise({ redirectTo: '/404' });

		}]);
	app.controller('appController',['$scope', '$rootScope', '$location', 'auth','message', function(ng, root, location, auth,message){
		ng.models = (function(){
			return {
				company_name: "NTSprint",
				ws: null
			};
		})();
		
		// Model to JSON for demo purpose
		ng.$watch('models', function(model) {
			ng.modelAsJson = angular.toJson(model, true);
		}, true);

		//Manage Events
        ng.onClick = (function(){
			return {
				goHome : function(){
					location.path('');
				},
				exit : function(){
					auth.removeToken();
					location.href = '/login';
					// location.path('login');
				},
				account : function() {
					location.path('account');
				}
				
			};
		})();


		root.$on('$routeChangeStart', function (event, next, current) {
			ng.isLoading = true;
			var isValid = false;
				if(angular.isDefined(next.$$route)){					
					switch(next.$$route.controller){
						case 'login':
							isValid = true;
						break;
						default:
							isValid = false;
						break;
					}
				}			
            if (!auth.isLogin()){
				ng.loginRequire = true;
				location.path('login');
            }
            else {
				ng.loginRequire = false;				
				if(isValid){
					location.path('home');	
				}
			}
		});
		root.$on('$routeChangeSuccess', function (event, current, previous) {
			ng.isLoading = false;
		});
		root.$on("$routeChangeError", function (event) {
			location.path('404');
		});

		//langs momment y highchart
		// moment.locale('es');
		//tooltip y popover
		$(function () {
			$('a[data-toggle=popover]').popover({
			  container: 'body'
			});

			$('#conection-indicator').show('slow');
			$('.hidden-only-initial').slideDown('slow');
		})
        
	}]);
	app.provider('routeResolver', function(){
		this.$get = function () {
			return this;
		};
		this.resolve = function(name){
			var route = {};
			route.controller = name;
			route.templateUrl = globalConfig.getViewsDirectory(name);
			route.resolve = {
				load : ['$q', '$rootScope', function($q, $rootScope){					
					var defer = $q.defer();
                    require([globalConfig.getControllersDirectory(name)], function(){
						defer.resolve();
						$rootScope.$apply();
                    });
					return defer.promise;
				}]
			};
			return route;
		}
	});
	
	return app;
});