'use strict';

define(['config'], function (config) {
    var module = angular.module(config.getNS('services'),[]);
    return module;
});