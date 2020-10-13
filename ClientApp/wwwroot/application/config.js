'use strict'
define([],function(){
	return {
            getBaseURL : function(){
			        var url = "https://localhost:5003/";
                    return url;
                },
                getControllersDirectory : function(name){
                	return 'application/controllers/' + name + '.js';
                },
                getViewsDirectory : function(name){
                    return 'application/views/' + name + '.html';
                },
                getTemplatesDirectory : function(name){
                    return 'application/templates/' + name + '.html';
                },
                getNS : function (name) {
                	return 'com.av2sf.' + name;
                },
                getError : function(code){
                    return 'Error.';
                },
                getGlobal : function(key){
                    if(angular.isDefined(window.com) && angular.isDefined(window.com.av2sf) && angular.isDefined(window.com.av2sf.global) && angular.isDefined(window.com.av2sf.global[key])){
                        return window.com.av2sf.global[key];
                    }else{
                        return undefined;
                    }
                },
                setGlobal : function(key, value){
                    window.com = window.com || {};
                    window.com.av2sf = window.com.av2sf || {};
                    window.com.av2sf.global = window.com.av2sf.global || {};
                    window.com.av2sf.global[key] = value;
                },
                setConfig : function(config){
                    this.setGlobal("config", config);            
                },
                getConfig : function(){
                    return this.getGlobal("config");
                },
                setAuth : function(value){
                    this.setGlobal("auth", value);
                },
                getAuth : function(){
                    return this.getGlobal("auth");
                },
                setToken : function(value){
                    this.setGlobal("token", value);
                },
                getToken : function(){
                    return this.getGlobal("token");
                },
                getBoolean : function(value){
                    if(parseInt(value,10)===1){
                        return true;
                    }else{
                        return false;
                    }
                }
            };
        });
