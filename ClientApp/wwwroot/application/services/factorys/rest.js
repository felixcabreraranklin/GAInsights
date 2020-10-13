'use strict';
define(['config','modules/factorys'], function (globalConfig, module) {

    module.factory('TodoREST', ['$resource', function (res) {
        return res( globalConfig.getBaseURL() + 'api/todo/:id', {id:'@id'},{
            remove: {
                method : 'DELETE'
            },
            update: {
                method : 'PUT',
            },
            save : {
                method: 'POST',
                url : globalConfig.getBaseURL() + 'api/todo/',
            },
            all : {
                method: 'GET',
                url : globalConfig.getBaseURL() + 'api/todo/',
                // interceptor : {
                //     response: function(response) {
                //         var result = response.resource;
                //         result.$status = response.status;
                //         return result;
                //     }
                // }
            },
            change : {
                method: 'PUT',
                url : globalConfig.getBaseURL() + 'api/todo/:id/priority/',
            },
        });
    }]);


    module.factory('configREST', ['$resource', function (res) {
        return res( globalConfig.getBaseURL() + 'config', {},{
            reload : {
                method: 'GET',
                url : globalConfig.getBaseURL() + 'config',
                interceptor : {
                    response: function(response) {
                        var result = response.resource;        
                        result.$status = response.status;
                        globalConfig.setConfig(angular.fromJson(result));
                        return result;
                    }
                }
            }
        });
    }]);
    module.factory('usersREST', ['$resource', function (res) {
        return res( globalConfig.getBaseURL() + 'users/:id', {id:'@id'},{
            login : {
                method: 'POST',
                url : globalConfig.getBaseURL() + 'login',
                interceptor : {
                    response: function(response) {      
                        var result = response.resource;        
                        result.$status = response.status;
                        return result;
                    }
                }
            }
        });
    }]);
    
});