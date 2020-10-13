'use strict';

define(['config'], function (config) {
    var module = angular.module(config.getNS('filters'),[]);
    return module;
});