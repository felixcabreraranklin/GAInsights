'use strict';
define(['config', 'modules/directives'],function (globalConfig, module) {

    module.constant('validatorsConfig', {
        LETTERS : {reg:/^[a-zA-Z ]+$/, val: 'uiletters'},
        EMAIL: { reg: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, val: 'uiemail' },
        INTEGER: { reg: /^[0-9]*$/, val: 'uiinteger' },
        DECIMAL: { reg: /^\-?\d+((\.)\d+)?$/, val: 'uidecimal' },
        DEVICEMAC : {reg:/^[0-9A-Z]{12}$/, val:'uidevicemac'},
        DEVICEMACSEACH : {reg:/^([0-9A-Z][0-9A-Z]\:?){1,6}$/, val:'uidevicemacseach'}
    });

    module.directive('uiValid', ['validatorsConfig', function(config) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$parsers.unshift(function(viewValue) {
                    var split = attrs.uiValid.split('|');

                    if(split[0]==='DEVICEMAC'){
                        var viewValue = viewValue.toUpperCase();
                        ctrl.$setViewValue(viewValue);
                        ctrl.$render();
                    }

                    if(split.length > 1 && split[1]==='NO_REQUIRED'){
                        if(angular.isDefined(viewValue) && viewValue!==null){
                            if(viewValue.length > 0){
                                if (config[split[0]].reg.test(viewValue)) {
                                    ctrl.$setValidity(config[split[0]].val, true);
                                    return viewValue;
                                } else {
                                    ctrl.$setValidity(config[split[0]].val, false);
                                    return undefined;
                                }
                            }else{
                                ctrl.$setValidity(config[split[0]].val, true);
                                return viewValue;
                            }
                        }else{
                            ctrl.$setValidity(config[split[0]].val, true);
                            return viewValue;
                        }
                    }else{
                        if(viewValue.length > 0){
                            if (config[split[0]].reg.test(viewValue)) {
                                ctrl.$setValidity(config[split[0]].val, true);
                                return viewValue;
                            } else {
                                ctrl.$setValidity(config[split[0]].val, false);
                                return undefined;
                            }
                        }else{
                            ctrl.$setValidity(config[split[0]].val, false);
                            return undefined;
                        }                        
                    }
                });

                ctrl.$formatters.unshift(function(viewValue) {
                    var split = attrs.uiValid.split('|');                    
                    if(split.length > 1 && split[1]==='NO_REQUIRED'){
                        if(angular.isDefined(viewValue) && viewValue!==null){
                            if(viewValue.length > 0){
                                if (config[split[0]].reg.test(viewValue)) {
                                    ctrl.$setValidity(config[split[0]].val, true);
                                    return viewValue;
                                } else {
                                    ctrl.$setValidity(config[split[0]].val, false);
                                    return viewValue;
                                }
                            }else{
                                ctrl.$setValidity(config[split[0]].val, true);
                                return viewValue;
                            }
                        }else{
                            ctrl.$setValidity(config[split[0]].val, true);
                            return viewValue;
                        }
                    }else{
                        if (config[split[0]].reg.test(viewValue)) {
                            ctrl.$setValidity(config[split[0]].val, true);
                            return viewValue;
                        } else {
                            ctrl.$setValidity(config[split[0]].val, false);
                            return viewValue;
                        }
                    }
                });

            }
        };
    }]);

    module.directive('uiLoading', function(){
        return {
            scope : {
                uiRender : '='
            },
            template : '<div style="position: relative;width:100%;height:150px;" data-ng-if="uiRender"><div style="text-align:center;background:#666;border-radius:10px;padding:5px 10px;position: absolute;top:50%;left:50%;margin-left:-38px;margin-top:-33px;">'+
            '<img src="application/statics/svg/oval.svg" width="25" alt=""><p style="color:#fff;font-size:10px;margin-bottom:0px;">Cargando...</p>'+
            '</div></div>'
        };
    });
   

    module.directive('uiCheck', function($timeout, $parse){
        return {
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                if($attrs.uiCheck.length > 0){
                    var myID = new Date().getTime() + Math.random();
                    $(element).attr('id', myID);
                    $(element).after('<label style="padding-left:5px;text-transform: uppercase; font-size: 11px;" for="'+myID+'">'+ $attrs.uiCheck +'</label>');
                }                
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_flat-blue',
                        radioClass: 'iradio_flat-blue'

                    }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    });

     module.directive('uiNoData', function(){
        return {
            restrict : 'EA',
            replace : true,
            scope : {
                uiTitle : '@',
                uiMessage : '@',
                uiIcon : '@'
            },
            template : ''+
                '<div class="text-center" style="padding:30px 0px;">'+
                    '<div class="text-center" data-ng-if="!!uiIcon">'+
                        '<i class="{{uiIcon}}" style="font-size:90px;"></i>'+
                    '</div>'+
                    '<h3>{{uiTitle}}</h3>'+
                    '<p>{{uiMessage}}</p>'+
                '</div>'
        };
    });

    module.directive('uiModal', function(){
        return {
            scope :{
                uiOpen : '=',
                uiClose : '='
            },
            link : function(scope, element, attrs){
                scope.myID = 'modal_' + scope.$id + '_' +new Date().getTime();
                $(element).addClass('modal fade');
                $(element).attr('tabindex', '1');
                $(element).attr('role', 'dialog');
                $(element).attr('id', scope.myID);
                $(element).attr('data-backdrop', 'static');
                $(element).attr('data-keyboard', 'false');

                scope.$watch('uiOpen', function(newValue, oldValue){
                    if(angular.isDefined(newValue) && newValue){
                        $('#' + scope.myID).modal('show');
                        scope.uiOpen = false;
                    }
                });

                scope.$watch('uiClose', function(newValue, oldValue){
                    if(angular.isDefined(newValue) && newValue){
                        $('#' + scope.myID).modal('hide');
                        scope.uiClose = false;
                    }
                });
            }
        };
    });
    module.directive('uiModalDialog', function(){
        return {
            link : function(scope, element, attrs){
                $(element).addClass('modal-dialog');
                $(element).addClass('modal-dialog-centered');
                $(element).attr('role', 'document');
            }
        };
    });
    module.directive('uiModalContent', function(){
        return {
            scope:{
                uiClose : '='
            },
            link : function(scope, element, attrs){
                $(element).addClass('modal-content');
                var header = '';
                header +='<div class="modal-header" style="background:#efefef;">';                
                header +='<h5 class="modal-title" style="text-transform: uppercase;font-size: 15px;"></h5>';

                if(angular.isDefined(attrs.uiClose)){
                    header +='<button type="button" class="close"><span aria-hidden="true">&times;</span></button>';
                }else{
                    header +='<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                }                            

                header +='</div>';
                
                $(element).prepend(header);

                attrs.$observe('uiModalContent', function(newValue, oldValue){                    
                    $(element).find('.modal-title').html(newValue);                   
                });

                attrs.$observe('uiNoClose', function(newValue, oldValue){
                    $(element).find('.close').remove();
                });

                if(angular.isDefined(attrs.uiClose)){
                    $(element).on('click','.close', function(e){
                        scope.$apply(function() {
                            scope.uiClose = true;
                        });
                    });
                }
            }
        };
    });
    module.directive('uiModalBody', function(){
        return {
            link : function(scope, element, attrs){
                $(element).addClass('modal-body');
            }
        };
    });
    module.directive('uiModalFooter', function(){
        return {
            link : function(scope, element, attrs){
                $(element).addClass('modal-footer');
            }
        };
    });
   

    module.directive('screenfull', function(){
        return {
            link : function(ng, element, attrs){
                $(element).click(function(e){
                    e.preventDefault();
                    screenfull.toggle();
                });
            }
        }
    });
    
    module.directive('uiButton', function(){
        return {
            replace : true,
            transclude : true,
            template : '<button type="button" class="btn btn-sm"><ng-transclude></ng-transclude></button>'
        };
    });

    module.directive('uiHeading', function() {
        return {
            restrict : 'EA',
            transclude : true,
            scope :{
              uiTitle : '@'  
            },
            link : function(scope, element, attrs){
                
            },
            template : ''+
            '<div style="background:#fff;box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);margin-bottom:30px;">'+
                '<div class="row m-0">'+
                    '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12" style="padding-top:20px;padding-bottom:20px;">'+
                       '<span style="font-size:22px;text-transform:uppercase;letter-spacing: 1px;">{{uiTitle}}</span>'+
                    '</div>'+
                    '<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 text-right buttons-responsive"  style="padding-top:20px;" data-ng-transclude>'+
                    '</div>'+
                '</div>'+
            '</div>'
        };
    });

    module.directive('uiLogin',['$http','message', 'loading', 'usersREST','auth', function(http, message, loading, usersREST, auth){
        return {
            restrict : 'EA',
            replace : true,
            scope: {
                uiOpen : '='
            },
            link : function(scope, element, attrs){

                var ng = scope;

                 ng.models = (function(){
                    return {
                        disabled : {
                            login : false
                        },
                        account : new usersREST()
                    };
                })();

                ng.onClick = (function(){
                    return {
                        login : function(frm){
                            if(frm.$valid){
                                loading.show('Wait...');
                                ng.models.disabled.login = true;
                                var copy = angular.copy(ng.models.account);
                                copy.$login(function(response){
                                    ng.models.disabled.login = false;
                                    if(response.$status===200){
                                        loading.hide();
                                        switch(response.code){
                                            case '000':
                                                //se envia la respuesta completa con user y token al metodo setToken
                                                auth.setToken(response);
                                                location.reload();
                                            break;
                                            case '001':
                                                message.error(response.message);
                                            break;
                                        }
                                    }
                                }, function(error){
                                    ng.models.disabled.login = false;
                                    loading.hide();
                                    message.error('Ocurrió un error inesperado, intente otra vez.');
                                });
                            }
                        }
                    };
                })();

                ng.onKey = (function(){
                    return {
                        press : function(event, frmLogin){
                            if (event.which === 13){
                                ng.onClick.login(frmLogin);
                            }
                        }
                    };
                })();
            },
            templateUrl : globalConfig.getTemplatesDirectory('uiLogin')
        };
    }]);


    module.directive('uiInputButtons', [function(){
        return {
            restrict : 'EA',
            replace : true,
            scope: {
                uiText : '@',
                uiItems : '=',
                uiItem : '=',
                uiModel : '='
            },
            link : function(scope, element, attrs){

                var ng = scope;

                ng.onClick = (function(){
                    return {
                        select : function(row){
                            ng.uiItem = row;
                        }
                    };
                })();

            },
            templateUrl : globalConfig.getTemplatesDirectory('uiInputButtons')
        };
    }]);
    

    module.directive('uiQuantity', function(fns){
        return {
            require: 'ngModel',
            link:function(scope, element, attrs, modelCtrl){
                $(element).keypress(function(evt){
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if (fns.isNumberKeys(charCode) || fns.isSpecialKeys(charCode) || fns.isArrowKeys(charCode))
                        return true;
                    return false;
                });
            }
        }
    });

    module.directive('uiMessageUsable', function(){
        return {
            restrict : 'EA',
            replace : true,
            template : ''+
                '<div class="row">'+
                    '<div class="col-md-12">'+
                        '<div class="alert alert-warning" role="alert">'+
                            'Los campos marcados de color rojo, son obligatorios o en su defecto muestran un error de datos.'+
                        '</div>'+
                    '</div>'+                    
                '</div>'
        };
    });

    module.directive('uiLetters', function(fns){
        return {
            require: 'ngModel',
            link:function(scope, element, attrs, modelCtrl){            
                $(element).keypress(function(evt){
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if (fns.isUppercaseKeys(charCode) || fns.isLowercaseKeys(charCode) || fns.isSpecialKeys(charCode) || fns.isArrowKeys(charCode) || fns.isSpaceKeys(charCode))
                        return true;
                    return false;
                });
            }
        }
    });

    module.directive('uiMac', function(fns){
        return {
            require: 'ngModel',
            link:function(scope, element, attrs, modelCtrl){            
                $(element).keypress(function(evt){
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if (fns.isUppercaseKeys(charCode) || fns.isLowercaseKeys(charCode) || fns.isNumberKeys(charCode) || fns.isSpecialKeys(charCode) || fns.isArrowKeys(charCode))
                        return true;
                    return false;
                });
            }
        }
    });

    module.directive('uiLettersEmail', function(fns){
        return {
            require: 'ngModel',
            link:function(scope, element, attrs, modelCtrl){            
                $(element).keypress(function(event){
                    var regex = new RegExp("^[a-zA-Z0-9\\@\\-\\.\\_]+$");
                    var charCode = (event.which) ? event.which : event.keyCode;
                    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                    if (!regex.test(key)) {
                        if(fns.isSpecialKeys(charCode) || fns.isArrowKeys(charCode)){

                        }else{
                            event.preventDefault();
                            return false;
                        }
                        
                    }
                });
                /*$(element).keypress(function(evt){
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    console.log(charCode);
                    if (fns.isUppercaseKeys(charCode) || fns.isLowercaseKeys(charCode) || fns.isNumberKeys(charCode) || fns.isSpecialKeys(charCode) || fns.isArrowKeys(charCode))
                        return true;
                    return false;
                });*/
            }
        }
    });


    module.directive('uiAlphaNumeric', function(fns){
        return {
            require: 'ngModel',
            link:function(scope, element, attrs, modelCtrl){            
                $(element).keypress(function(evt){
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if (fns.isUppercaseKeys(charCode) || fns.isLowercaseKeys(charCode) || fns.isNumberKeys(charCode) || fns.isSpecialKeys(charCode) || fns.isArrowKeys(charCode))
                        return true;
                    return false;
                });
            }
        }
    });

    module.directive('uiFloat', function(fns){
        return {
            require: 'ngModel',
            link:function(scope, element, attrs, modelCtrl){
                $(element).on("keypress keyup blur",function (event) {
                    //this.value = this.value.replace(/[^0-9\.]/g,'');
             $(this).val($(this).val().replace(/[^0-9\.]/g,''));
                    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }
                });
            }
        }
    });

    module.directive('uiInteger', function(fns){
        return {
            require: 'ngModel',
            link:function(scope, element, attrs, modelCtrl){
                $(element).keypress(function(evt){
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if (fns.isNumberKeys(charCode) || fns.isSpecialKeys(charCode) || fns.isArrowKeys(charCode))
                        return true;
                    return false;
                });
            }
        }
    });

    module.directive('uiSelect', function($http){
        return {
            replace : true,
            scope : {
                uiProp : '@',
                uiUrl : '@',
                uiRender : '=',
                uiModel : '=',
                uiList : '=',
                uiAll : '@',
                uiComplete : '&',
                uiOptions : '&'
            },
            link : function(ng, element, attrs){

                if(!angular.isDefined(attrs.uiProp)){
                    console.error('uiProp is not defined!');
                    return;
                }

                if(!angular.isDefined(attrs.uiModel)){
                    console.error('uiModel is not defined!');
                    return;
                }

                ng.models = (function(){
                    return {
                        list : [],
                        model : null
                    };
                })();

                var fn = (function(){
                    return {
                        message : function(msg){
                            ng.models.list = [];
                            var el = {
                                name : msg
                            };
                            el[ng.uiProp] = null;
                            ng.models.list.push(el);
                            ng.models.model = ng.models.list[0];
                        },
                        call : function(){
                            fn.message('Cargando...');
                            $http.get(globalConfig.getBaseURL() + ng.uiUrl).then(function(response){
                                if(response.status===200){

                                    ng.models.list = response.data;

                                    if(angular.isDefined(attrs.uiAll)){
                                        switch(ng.uiAll){
                                            case '1':
                                                var e = {
                                                    name : 'Todos'
                                                };
                                                e[ng.uiProp] = 'ALL';
                                                ng.models.list.unshift(e);
                                            break;
                                            case '2':
                                                var e = {
                                                    name : 'Ninguno'
                                                };
                                                e[ng.uiProp] = 'NONE';
                                                ng.models.list.unshift(e);
                                            break;
                                            case '3':
                                                var e = {
                                                    name : 'Seleccione'
                                                };
                                                e[ng.uiProp] = null;
                                                ng.models.list.unshift(e);
                                            break;
                                        }
                                    }

                                    if(ng.models.list.length === 0){
                                        var e = {
                                            name : 'Seleccione'
                                        };
                                        e[ng.uiProp] = null;
                                        ng.models.list.push(e);
                                    }

                                    if(angular.isDefined(ng.uiModel) && ng.uiModel!==null){
                                        var pos = 0;
                                        for(var i=0; i<ng.models.list.length;i++){
                                            if(ng.models.list[i][ng.uiProp] == ng.uiModel[ng.uiProp]){
                                                pos = i;
                                                break;
                                            }
                                        }
                                        ng.models.model = ng.models.list[pos];
                                        ng.uiModel = ng.models.model;
                                    }else{
                                        ng.models.model = ng.models.list[0];
                                        ng.uiModel = ng.models.model;   
                                    }
                                    if(angular.isDefined(ng.uiComplete)){
                                        ng.uiComplete({l : response.data.length});
                                    }
                                    if(angular.isDefined(ng.uiList)){
                                        ng.uiList = ng.models.list;
                                    }
                                    if(angular.isDefined(ng.uiOptions)){
                                        ng.uiOptions({
                                            value: ng.models.model,
                                            list : ng.models.list
                                        });
                                    }
                                }
                            }, function(error){
                                fn.message('Seleccione');
                            });
                        }
                    };
                })();

                ng.onChange = (function(){
                    return {
                        select : function(){
                            ng.uiModel = ng.models.model;
                        }
                    };
                })();
                ng.$watch('uiModel', function(newValue, oldValue){
                    ng.models.model = newValue;
                });
                ng.$watch('uiRender', function(newValue, oldValue){
                    if(angular.isDefined(newValue) && newValue){
                        if(ng.models.list.length > 0 ){
                            var call = false;
                            for(var i=0; i< ng.models.list.length;i++){
                                if(ng.models.list[i][ng.uiProp]===null){
                                    call = true;
                                    break;
                                }
                            }
                            if(call){
                                fn.call();
                            }else{
                                if(angular.isDefined(ng.uiModel) && ng.uiModel!==null){
                                    var pos = 0;
                                    for(var i=0; i<ng.models.list.length;i++){
                                        if(ng.models.list[i][ng.uiProp] == ng.uiModel[ng.uiProp]){
                                            pos = i;
                                            break;
                                        }
                                    }
                                    ng.models.model = ng.models.list[pos];
                                    ng.uiModel = ng.models.model;
                                }else{
                                    ng.models.model = ng.models.list[0];
                                    ng.uiModel = ng.models.model;   
                                }
                            }
                        }else{
                            fn.call();
                        }
                        ng.uiRender = false;
                    }
                });
            },
            template : '<select class="custom-select" data-ng-model="models.model" data-ng-change="onChange.select()" data-ng-options="p.name for p in models.list"></select>'
        };
    });
    

   
   

    module.directive('uiAccount',['$location','auth', function( location, auth){
        return {
            //restrict : 'E',
            //replace : true,
            link : function(scope, element, attrs){
                var ng = scope;
                ng.onClick = (function(){
                    return {
                        exit : function(){
                            auth.removeToken();
                            location.path('login');
                        },
                        account : function() {
                            location.path('account');
                        }
                    };
                })();

                ng.user = auth.getUser();
            },
            templateUrl : globalConfig.getTemplatesDirectory('uiAccount')
        };
    }]);

    module.directive('uiMenu',['$location','auth', function( location, auth){
        return {
            //restrict : 'E',
            //replace : true,
            link : function(scope, element, attrs){
                var ng = scope;
                ng.show = auth.isLogin();

                ng.hasPermiso = function(menu) {
                    return auth.hasMenu(menu);
                }

            },
            templateUrl : globalConfig.getTemplatesDirectory('uiMenu')
        };
    }]);

    

   
});