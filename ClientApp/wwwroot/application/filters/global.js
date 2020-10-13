'use strict';
define(['config','modules/filters'],function (globalConfig, module) {
    module.filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
});