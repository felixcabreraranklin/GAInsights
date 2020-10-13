'use strict'
define(['config', 'app'], function(globalConfig, app){
    app.register.controller('login', ['$scope', '$location', 'auth', 'loading', function (ng, location, auth, loading) {
        if (globalConfig.getToken() == 'test') {
            loading.show();
            setTimeout(function () {
                debugger;
                location.path('todo');
            }, 3000);
        }

	}]);
});