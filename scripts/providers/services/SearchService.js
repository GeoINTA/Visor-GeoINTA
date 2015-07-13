angular.module('visorINTA.utils.SearchService', [])
.service('SearchService',function($http,$q,networkServices){

	this.search = function(searchString){
		return this.requestData(searchString);
	}

	this.requestData = function(searchString){
		return $http.jsonp(networkServices.searchService, {
                params : {callback:'JSON_CALLBACK',busca:searchString},
                transformResponse: function (data, headers) {
                	data.searchstring = searchString;
                    return data;
                }
        })
	}


});