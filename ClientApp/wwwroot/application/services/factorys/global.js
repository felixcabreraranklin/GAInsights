'use strict';
define(['config','modules/factorys'],function (globalConfig, module) {
    module.factory('loading', ['$timeout', function (to) {
        return{
            show : function (message) {
                var html = '';
                html +='<div class="loading" style="position:fixed;top:0;left:0;width:100%;height:100%;background: #34495E;opacity: 0.75;z-index: 999999;">';
                html +='<div style="position: relative;width:100%;height: 100%;">';
                html +='<img src="application/statics/svg/oval.svg" width="50" alt="" style="position: absolute;top:50%;left:50%;margin-left:-25px;">';                
                if(angular.isDefined(message)){
                    html +='<p style="width:200px;position: absolute;top:50%;left:50%;margin-left:-100px;color:#fff;margin-top: 50px;text-align: center;font-size: 13px;font-family: monospace;">';
                    html +=message;
                    html +='</p>';
                }
                html +='</div>';
                html +='</div>';
                if(!$('body').hasClass('loading-active')){
                    $('body').addClass('loading-active');
                    $('body').prepend(html);
                }
            },
            hide : function () {
                to(function(){
                    $('body').removeClass('loading-active');
                    $('body>.loading').remove();
                }, 250);
            }
        };
    }]);
    module.factory('message', function(){
        return {
            success : function(message, position){
                Lobibox.notify('success', {
                    soundPath: 'application/statics/sounds/',
                    size: 'normal',
                    rounded: true,
                    delayIndicator: false,
                    msg: message,
                    title : 'Excelent',
                    position : angular.isDefined(position) ? position : 'bottom right'
                });
            },
            info : function(message, position){
                Lobibox.notify('info', {
                    soundPath: 'application/statics/sounds/',
                    size: 'normal',
                    rounded: true,
                    delayIndicator: false,
                    msg: message,
                    title : 'Attention',
                    position : angular.isDefined(position) ? position : 'bottom right'
                });
            },
            error : function(message, position){
                Lobibox.notify('error', {
                    soundPath: 'application/statics/sounds/',
                    size: 'normal',
                    rounded: true,
                    delayIndicator: false,
                    msg: message,
                    position : angular.isDefined(position) ? position : 'bottom right'
                });
            }
        };
    });

    module.factory('salert',['$timeout', function (to) {
        return{
            confirm : function (message, fnAccept, fnCancel) {
                swal({ 
                  title: "Please wait!",
                  text: message,
                  html: true,
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "YES",
                  cancelButtonText: "NO",
                  closeOnConfirm: false,
                  closeOnCancel: true,
                  allowEscapeKey : false
                },
                function(isConfirm){
                  if (isConfirm) {
                    if(typeof fnAccept==='function'){
                        fnAccept();
                    }
                  } else {
                    if(typeof fnCancel==='function'){
                        fnCancel();
                    }
                  }
                });
            },
            accept : function (message, fnAccept) {
                swal({ 
                  title: "Please Wait!",
                  text: message,
                  html: true,
                  type: "warning",
                  showCancelButton: false,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "YES",
                  cancelButtonText: "NO",
                  closeOnConfirm: false,
                  closeOnCancel: true,
                  allowEscapeKey : false
                },
                function(isConfirm){
                  if (isConfirm) {
                    if(typeof fnAccept==='function'){
                        fnAccept();
                    }
                  }
                });
            },
            download : function (title, message, fnAccept, fnCancel) {
                swal({ 
                  title: title,
                  text: message,
                  html: true,
                  type: "success",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "YES",
                  cancelButtonText: "NO",
                  closeOnConfirm: false,
                  closeOnCancel: true,
                  allowEscapeKey : false
                },
                function(isConfirm){
                  if (isConfirm) {
                    if(typeof fnAccept==='function'){
                        fnAccept();
                    }
                  } else {
                    if(typeof fnCancel==='function'){
                        fnCancel();
                    }
                  }
                });
            },
            close : function(){
                swal.close();
            }
        };
    }]);
    
    module.factory('auth', ['$cookies', function ($cookies) {
        return{
            user: null,
            hasMenu: function (menu) {
                if(globalConfig.getToken() == 'test') return true;
                //console.log(this.user.menus);
                //console.log(menu);
                return this.getUser() && this.user.menus[menu];
            },
            setToken : function(token){
                $cookies.put('token', token.message);
                localStorage.user = angular.toJson(token.user);
            },
            isLogin : function(){
                if(globalConfig.getToken() == 'test') return true;
                var login = $cookies.get('token');
                if(angular.isDefined(login) && globalConfig.getAuth()){
                    return true;
                }else{
                    return false;
                }
            },
            getToken : function(){
                var login = $cookies.get('token');
                if(angular.isDefined(login)){
                    return login;
                }else{
                    return null;
                }
            },
            getUser : function()    {
              if(globalConfig.getToken() == 'test') return {username: 'test', menus:[]};
                if(!this.user)
                    this.user = angular.fromJson(localStorage.user);
                return this.user;
            },
            removeToken : function()    {
              // globalConfig.setToken(null);
                var login = $cookies.get('token');
                if(angular.isDefined(login)){
                    $cookies.remove('token');
                    localStorage.clear();
                }
            },
           
        };
    }]);
    module.factory('fns', ['$http','loading','auth',function(http,loading,auth){
      return {
        isArrowKeys : function(charCode){
          if((charCode >= 37 && charCode <= 40)){
            return true;
          }else{
            return false;
          }
        },
        isSpaceKeys : function(charCode){
          //bar space
          if((charCode == 32)){
            return true;
          }else{
            return false;
          }
        },
        isSpecialKeys : function(charCode){
          //backspace, delete, tab
          if((charCode == 8 || charCode == 9)){
            return true;
          }else{
            return false;
          }
        },
        isNumberKeys : function(charCode){
          if((charCode >= 48 && charCode <= 57)){
            return true;
          }else{
            return false;
          }
        },
        isLowercaseKeys : function(charCode){
          if((charCode >= 97 && charCode <= 122)){
            return true;
          }else{
            return false;
          }
        },
        isUppercaseKeys : function(charCode){
          if((charCode >= 65 && charCode <= 90)){
            return true;
          }else{
            return false;
          }
        }
      };
    }]);

});