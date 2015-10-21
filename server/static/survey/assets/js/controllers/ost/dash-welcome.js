
angular.module('askApp').controller('DashWelcomeCtrl', function($scope, $rootScope, $routeParams, $window, surveyFactory, $location) {
    
    //$scope.screen_height = angular.element($window).height();
    $scope.page_title = "Welcome to the California Coastal Monitoring Dashboard!";
    $rootScope.activePage = 'welcome';

    $scope.go = function(survey) {
    	$location.path('/overview/' + survey );
    }

});
