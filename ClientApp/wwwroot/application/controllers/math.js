'use strict'
define(['config', 'app'], function(globalConfig, app){
	app.register.controller('math', ['$scope','$http','loading','message','salert', function(ng,http,loading,message,salert){
		ng.models = (function(){
			return {
				loading : {
					math : false
				},
				modal : {
					add : {
						open : false,
						close : false,
						title : '',
					},
					combinations : {
						open : false,
						close : false,
						title : ''
					}
				},
				pagination : {
					rows : 50,
					totalItems : 0,
					currentPage :  1,
					maxSize : 5
				},
				search : {
					query : '2+3*sqrt(4)'
				},
				expresion:'0',
				list : [],
                roles: [],
				isEdit : false,
			};
		})();

		var api = (function(){
			return {
				calculate: function() {

				}
			};
		})();


		ng.onClick = (function(){
			return {
				calculate: function () {
					loading.show('Calculating...');
					http.get('https://api.mathjs.org/v4/?expr='+window.encodeURIComponent(ng.models.search.query)).then(function(response) {
						loading.hide();
						if(response.status===200){
							message.success(response.statusText + "Exp = " + response.data);
							ng.models.expresion = "Exp = " + response.data;
						}else{
							message.error('Sorry. Error found!');
						}
					}).catch(function(response) {
						loading.hide();
						message.error('Sorry. Bad Expresion!');
					});
				}
			};
		})();

	}]);
});