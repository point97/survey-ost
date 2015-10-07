angular.module('askApp').factory('surveyFactory', function($http, $location) {
    return {
        survey : {},
        getSurvey: function(callback) {
            var self = this;
            var surveySlug;
            $http.get('/api/v1/surveyreport/' + surveySlug + '/?format=json', {cache:true}).success(function(data) {
                self.survey = data;
            }).success(callback);
        },

        getAllSurveys: function(callback) {
            var self = this;
            $http.get('/api/v1/surveyreport/?format=json', {cache:true}).success(function(data) {
                self.survey = data;
            }).success(callback);
        },

        searchRespondants : function(q){
            $location.path('/RespondentList/').search({q: q});
        }

        

    }
});
