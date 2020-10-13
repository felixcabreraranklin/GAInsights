'use strict'
define(['config', 'app'], function(globalConfig, app){
	app.register.controller('todo', ['$scope','TodoREST','loading','message','salert', function(ng,TodoREST,loading,message,salert){
		ng.models = (function(){
			return {
				loading : {
					todo : false
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
					query : null
				},
				entity : new TodoREST(),
				list : [],
                roles: [],
				isEdit : false,
			};
		})();

		var api = (function(){
			return {
				getAll : function(){
					ng.models.loading.todo = true;

					var search = angular.copy(ng.models.search);

					var data = {
						page : ng.models.pagination.currentPage,
						perPage : ng.models.pagination.rows,
						search : search.query,
						sortOrder: "name"
					};
                    

					TodoREST.all(data, function(response){
						ng.models.loading.todo = false;
						ng.models.list = response.result;
						ng.models.pagination.totalItems = response.count;
					}, function(){
						message.error('Ups! Sorry. We have problems loading TODO list.');
					});
				}
			};
		})();


		ng.onClick = (function(){
			return {
				add : function(){
					ng.models.modal.add.title = 'Add TODO';
					ng.models.modal.add.open = true;

					ng.models.entity.id = null;
					ng.models.entity.name = null;
					ng.models.entity.description = null;
					ng.models.entity.priority = 1;

					ng.models.isEdit = false;
				},
				edit : function(row){

					ng.models.isEdit = true;

					ng.models.modal.add.title = 'Edit TODO';

					ng.models.entity =  angular.copy(row);
                    
					ng.models.modal.add.open = true;
				},

                search : function(){
					api.getAll();
				},
				clear : function(){
					ng.models.search = {};
				},
				save : function(frm){
					if(frm.$valid){
                        loading.show('Guardando...');
						if(ng.models.isEdit){
							var ent = angular.copy(ng.models.entity);
							ent.name = frm.name.$viewValue;
							ent.description = frm.description.$viewValue;
							TodoREST.id = ent.id;
                            TodoREST.update(ent, function(response){
								loading.hide();
								if(response.statusCode===200){
									message.success('Perfect Updated!');
									ng.models.modal.add.close = true;                                            
									api.getAll();
								}else{
									message.error(response.message);
								}
							},function(error){
								loading.hide();
								message.error('Sorry. Error found!');
							});
						}else{
							var ent = angular.copy(ng.models.entity);
                            TodoREST.save(ent,function(response){
								loading.hide();
								if(response.statusCode===200){
									message.success('Perfect Creation!');
									ng.models.modal.add.close = true; 	                                           
									api.getAll();
								}else{
									message.error('Sorry. Error found!');
								}
							},function(error){
								loading.hide();
								message.error('Sorry. Error found!');
							});
						}	
					}
				},
				pageChanged : function(){
					api.getAll();
				},
				


				delete : function(row){
					salert.confirm('Are you sure?', function(){
						salert.close();
						ng.$apply(function(){
							loading.show('Deleting...');
							var ent = new TodoREST();
							ent.id = row.id;
							ent.$remove(function(response){
								loading.hide();
								if(response.statusCode===200){
									message.success('Perfect Remove!');
									api.getAll();
								}else{
									message.error('Sorry. Error found!');
								}
							},function(error){
								loading.hide();
								message.error('Sorry. Error found!');
							});
						});
					});
				},


			};
		})();


		api.getAll();

	}]);
});