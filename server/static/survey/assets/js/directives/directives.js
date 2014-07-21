
angular.module('askApp')
    .directive('password', function() {

    return {
        templateUrl: app.viewPath + 'views/password.html',
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            passwordText: "=passwordText",
            placeholderText: "=placeholderText"
        },
        link: function (scope, element, attrs) {
            scope.visible = false;
            scope.element = element;
            
            scope.toggleVisible = function () {
                scope.visible = ! scope.visible;
            }
        }
    }
});

angular.module('askApp')
    .directive('progress', function() {

    return {
        templateUrl: app.viewPath + 'views/progress.html',
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            value: "=value",
            max: "=max"
        },
        link: function (scope, element, attrs) {
            scope.percent = (scope.value/scope.max) * 100;
            console.log(scope.percent);
        }
    }
});

/**
 * This directive only applies to <select> elements. It applies the 
 * select2 component.
 */
angular.module('askApp')
    .directive('select2', ['$timeout', function($timeout) {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $timeout(function () {
                // The placeholder text was not being displayed without doing 
                // this in a a timeout().
                element.select2();
            });
        }
    }
}]);

/**
 * This directive applies the monthpicker component to <input> elements.
 */
angular.module('askApp')
    .directive('monthpicker', ['$timeout', function($timeout) {

    return {
        restrict: 'A',
        //restrict: 'EA',
        // scope: {
        //     valueasdf: "="
        // },
        link: function (scope, element, attrs) {
            // var options = { 
            //     ShowIcon: false,
            //     OnAfterChooseMonth: function() {
            //         scope.valueasdf = element.val();
            //         //scope.$apply(function () {
            //         //     console.log(element.val());
            //         // });
            //     }
            // }; 
            var options = { 
                ShowIcon: false
            }; 
            $timeout(function () {
                element.MonthPicker(options);
            });
        }
    }
}]);    



angular.module('askApp')
    .directive('respondentsearch', function(surveyFactory) {

    return {
        restrict: 'EA',
        templateUrl : app.viewPath +'views/ost/searchbox.html',
        scope: {},

        link: function (scope, element, attrs) {
            scope.surveyFactory = surveyFactory;
            scope.element = element
            
            // Bind enter key
            element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.search();
                });
                event.preventDefault();
            }
        });

            scope.search = function(){
                var val = element.find("input").val();
                surveyFactory.searchRespondants(val)
            };

        }
    };
});


angular.module('askApp')
    /*
    This watches the survey object and when a survey is loaded it turns off the spinners.

    It will create a elements that sits on top of the directives element and spinns until
    the survey is loaded and a survey.id is present.
    */

    .directive('loadingSurvey', function() {
        'use strict';

        return {
            scope: {
                survey:'='
            },
            link : function(scope, element) {

                element.append("<div class='loader'><i class='icon-spinner icon-spin icon-3x'></i></div>");
                element.css("position","relative");
                
                scope.$watch('survey', function(newVal){
                    console.log("in watch");
                    console.log(newVal);

                    if (newVal && newVal.id) {
                        console.log('Surveys loaded');
                        scope.survey.loading = false;
                        console.log(scope.survey.loading);
                        element.find(".loader").hide();
                    }
                });
            }
        };
    });

angular.module('askApp')
    .directive('back', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);
