/*
    
    Displays a list of respondants in a sortable pagiantated table. 
    
    Usage:

        <table respondant-table 
               resource='/api/v1/completerespondant/' 
               params='data.queryParams'
               options='{page_size:15}'>

    Inputs:

        resource - the API endpoint, e.g. '/api/v1/dashrespondant', '/api/v1/dashrespondant/search'
        params - An object whose keyword/values are added as query parmameters on the request. 
               - complete : [BOOLEAN]
               - ef : [STRING] A ',' list of ecofsystem features
               - q: [STRING] A query term to search on, only used when using 
                             the '/api/v1/dashrespondant/search' endpoint
        options: Object containing the following options:
               - limit : [INTEGER] Number of records to show per page 
        

*/

angular.module('askApp')
    .directive('respondentsTable', ['$http', '$location', 'surveyFactory', function(http, location, surveyFactory) {

    return {
        restrict: 'EA',
        templateUrl : app.viewPath +'components/p97-respondent-table/templates/table.html',
        scope: {
                resource:'=',
                options:'=',
            },

        link: function (scope, element, attrs) {
            scope.respondents = null;
            scope.orderBy = null;
            scope.meta = null;
            scope.http = http;
            scope.surveySlug = surveyFactory.survey.slug;
            scope.location = location;

            // Get the search term from the URL
            scope.searchTerm = scope.location.search().q;

            // Paginated respondent table
            scope.goToPage = function (page) {
                /*
                Page is a page index
                */
                
                var meta = scope.meta || {}
                    , offset = scope.options.limit * (page - 1);

                var url = scope.build_url(offset);
                console.log(url)

                scope.http.get(url).success(function (data) {
                    
                    // make sure the to parts is not grater than the total count.
                    var results_to = data.meta.offset + data.meta.limit;
                    results_to = ( results_to > data.meta.total_count ) ? data.meta.total_count : results_to;


                    scope.respondents = data.objects;
                    scope.meta = data.meta;
                    scope.currentPage = page;
                    scope.results_from = scope.meta.offset + 1;
                    scope.results_to = results_to;
                });
            };

            scope.setOrderBy = function(field){
                if (scope.orderBy === field){
                    scope.orderBy = "-"+field;
                } else if (scope.orderBy === '-'+field){
                    scope.orderBy = null;
                } else {
                    scope.orderBy = field;
                }
            };

            scope.showRespondent = function(respondent){
                /*
                This is the row click callback that takes the user to the respondaent detail page.
                */
                scope.location.path('/RespondantDetail/'+respondent.survey_slug+'/'+respondent.uuid );
            };

            scope.build_url = function(offset){
                /*
                Builds a URL based on pagination, user permissions, and search terms.
                
                Inputs:
                    offset: [INTEGER] the 0-based page offset

                /resource/?format='json'&limit=XX&offset=YY&q=SSSSS&complete=BOOL

                */

                // Attach pagination
                var url = [ 
                            scope.resource ,
                            '?format=json&limit=',
                            scope.options.limit,
                            '&offset=',
                            offset,
                          ];

                if (scope.searchTerm) {
                    url.push('&q='+scope.searchTerm);
                };
                if (!scope.$parent.user.is_staff){
                    url.push('&complete=true')
                }

                url = url.join('');
                return url;

            };


            // Load data when the resource is defined.
            scope.$watch('resource', function(newVal){
                if (newVal && scope.respondents === null){
                    scope.goToPage(1);
                }
            });



        }
    };
}]);

