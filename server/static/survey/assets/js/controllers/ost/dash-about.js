
angular.module('askApp').controller('DashAboutCtrl', function($scope, $rootScope, $routeParams, $window, surveyFactory) {
    
    //$scope.screen_height = angular.element($window).height();
    $scope.page_title = "About the Central Coast Monitoring Dashboard";
    $rootScope.activePage = 'about';
    $scope.user = app.user || {};

});
