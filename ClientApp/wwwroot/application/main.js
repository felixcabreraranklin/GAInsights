'use strict';
angular.element(document).ready(function() {
	require.config({
		urlArgs: 'version=' + (new Date()).getTime(),
		waitSeconds: 0,
		paths : {
			'angular-route' : 'statics/js/angular/angular-route.min',
			'angular-resource' : 'statics/js/angular/angular-resource.min',
			'angular-cookies' : 'statics/js/angular/angular-cookies.min',
			'lobibox' : 'statics/js/lobibox/lobibox.min',
			'notifications' : 'statics/js/lobibox/notifications.min',
			'screenfull' : 'statics/js/screenfull/screenfull.min',
			'sweetalert' : 'statics/js/sweetalert/sweetalert.min',
		}
	});
	require([
		'config',
		'app',
		'filters/global',
		'directives/global',
		'services/factorys/global',
        'services/factorys/rest',
        'services/services/global',
		'lobibox',
		'notifications',
		'screenfull',
		'modules/extra/pagination',
		'sweetalert',
	],function(globalConfig, app){

		function getCookie(name) {
		  var value = "; " + document.cookie;
		  var parts = value.split("; " + name + "=");
		  if (parts.length == 2) return parts.pop().split(";").shift();
		}

		(function(){
			var xhr = new XMLHttpRequest();
			xhr.open('POST', globalConfig.getBaseURL() + 'config');
			var token = getCookie('token');		
			xhr.setRequestHeader( 'token', angular.isDefined(token) ? token : null );
			xhr.setRequestHeader( 'Content-Type', 'application/json' );
			xhr.onload = function() {
                if (xhr.status === 200) {
					var response  = angular.fromJson(xhr.responseText);
                    globalConfig.setConfig(response);
			        globalConfig.setAuth(true);
					window.unauthenticated = 0;
					if(response.token == 'test') 
						globalConfig.setToken('test');
			    }
			    else if (xhr.status !== 200) {
			        globalConfig.setConfig(null);
			        globalConfig.setAuth(false);
			        window.unauthenticated = 0;
			    }
			    angular.bootstrap(angular.element(document), [
					app.name,
					globalConfig.getNS('directives'),
					globalConfig.getNS('factorys'),
					globalConfig.getNS('services'),
					globalConfig.getNS('filters'),
					'com.av2sf.pagination'
				]);
			};
			xhr.send(null);
		})();

			
	});
});