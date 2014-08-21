
angular.module('askApp').controller('DashAboutCtrl', function($scope, $routeParams, $window, surveyFactory) {
    
    //$scope.screen_height = angular.element($window).height();
    $scope.page_title = "About the Central Coast Monitoring Dashboard";
    $scope.activePage = 'about';
    $scope.user = app.user || {};
    $scope.filters = {};
    $scope.filtersJson = '';

    $scope.survey = {};
    $scope.survey.slug = $routeParams.survey_slug;

    $scope.survey.loading = true;
    surveyFactory.getSurvey(function (data) {
        data.questions.reverse();
        $scope.survey = data;
    });
    

    $scope.search = function(searchTerm){
        surveyFactory.searchRespondants(searchTerm);
    };

});
