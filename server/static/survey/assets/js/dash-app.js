//'use strict';

var app = {};

// var HC_EXPORT_SERVER_URL = "http://util.point97.io/highcharts-export-web";
var HC_EXPORT_SERVER_URL = "http://export.highcharts.com";


app.server = window.location.protocol + '//' + window.location.host;
app.viewPath = app.server + '/static/survey/';
angular.module('askApp', ['ngRoute', 'mgcrea.ngStrap.datepicker', 'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.button', "ui.bootstrap.tpls", "ui.bootstrap.modal", "ui.bootstrap.tooltip", "ui.directives",
    , 'ui.bootstrap.pagination']) //'ui', 'ui.bootstrap',
.config(function($routeProvider, $httpProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.patch = {
        'Content-Type': 'application/json;charset=utf-8'
    };
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    
    $routeProvider.when('/author/:surveySlug', {
        templateUrl: '/static/survey/views/author.html',
        controller: 'AuthorCtrl',
        reloadOnSearch: false
    })
    .when('/author', {
        templateUrl: '/static/survey/views/author.html',
        controller: 'AuthorCtrl',
        reloadOnSearch: false
    })
    .when('/surveys', {
        templateUrl: '/static/survey/views/SurveyList.html',
        controller: 'SurveyListCtrl'
    })
    .when('/survey/:surveySlug/complete/:uuidSlug', {
        templateUrl: '/static/survey/views/complete.html',
        controller: 'CompleteCtrl'
    })
    .when('/survey/:surveySlug/complete/:uuidSlug/:action/:questionSlug', {
        templateUrl: '/static/survey/views/complete.html',
        controller: 'CompleteCtrl'
    })
    .when('/survey/:surveySlug/:questionSlug/:uuidSlug', {
        templateUrl: '/static/survey/views/SurveyDetail.html',
        controller: 'SurveyDetailCtrl'
    })
    .when('/survey/:surveySlug/:uuidSlug', {
        templateUrl: '/static/survey/views/landing.html',
        controller: 'SurveyDetailCtrl'
    })
    .when('/agency-dash/:surveySlug', {
        templateUrl: '/static/survey/views/agency-dash.html',
        controller: 'AgencyDashCtrl'
    })

    /* Survey authoring */
    .when('/admin', {
        templateUrl: '/static/survey/views/survey-list.html',
        controller: 'SurveyListMenuCtrl'
    })

    /* Routes for dashboard side nav */
    .when('/welcome/', {
        templateUrl: '/static/survey/views/ost/dash-welcome.html',
        controller: 'DashWelcomeCtrl',
        reloadOnSearch: false
    })
    .when('/about/', {
        templateUrl: '/static/survey/views/ost/dash-about.html',
        controller: 'DashAboutCtrl',
        reloadOnSearch: false
    })
    .when('/explore/monitoring-project', {
        templateUrl: '/static/survey/views/ost/dash-explore.html',
        controller: 'DashExploreCtrl',
        reloadOnSearch: false
    })
    .when('/explore/ncc-monitoring', {
        templateUrl: '/static/survey/views/ncc/dash-explore.html',
        controller: 'DashExploreCtrl',
        reloadOnSearch: false
    })
    .when('/overview/', {
        templateUrl: '/static/survey/views/ost/dash-overview.html',
        controller: 'DashOverviewCtrl',
        reloadOnSearch: false
    })
    .when('/overview/ncc-monitoring', {
        templateUrl: '/static/survey/views/ost/dash-overview.html',
        controller: 'DashOverviewCtrl',
        reloadOnSearch: false
    })
    .when('/overview/monitoring-project', {
        templateUrl: '/static/survey/views/ost/dash-overview.html',
        controller: 'DashOverviewCtrl',
        reloadOnSearch: false
    })
    .when('/RespondentList/:surveySlug', {
        templateUrl: '/static/survey/views/ost/dash-respondent-list.html',
        controller: 'RespondantListCtrl',
        reloadOnSearch: false
    })

    .when('/RespondentList', {
        templateUrl: '/static/survey/views/ost/dash-respondent-list.html',
        controller: 'RespondantListCtrl',
        reloadOnSearch: true
    })

    .when('/responses/:surveySlug', {
        templateUrl: '/static/survey/views/ost/dash-respondent-list.html',
        controller: 'RespondantListCtrl',
        reloadOnSearch: false
    })

    .when('/RespondentDetail/monitoring-project/:uuidSlug', {
        templateUrl: '/static/survey/views/ost/dash-respondent-detail.html',
        controller: 'RespondentDetailCtrl'  // <-- This is in controllers/ost/respondentDetail.js
    })
    
    .when('/responses/monitoring-project/:uuidSlug', {
        templateUrl: '/static/survey/views/ost/dash-respondent-detail.html',
        controller: 'RespondentDetailCtrl', // <-- This is in controllers/ost/respondentDetail.js
    })

    .when('/RespondentDetail/ncc-monitoring/:uuidSlug', {
        templateUrl: '/static/survey/views/ncc/dash-respondent-detail.html',
        controller: 'RespondentDetailCtrl'  // <-- This is in controllers/ost/respondentDetail.js
    })
    
    .when('/responses/ncc-monitoring/:uuidSlug', {
        templateUrl: '/static/survey/views/ncc/dash-respondent-detail.html',
        controller: 'RespondentDetailCtrl', // <-- This is in controllers/ost/respondentDetail.js
    })

    .when('/ecosystems/:surveySlug', {
        templateUrl: '/static/survey/views/ost/dash-ecosystems.html',
        controller: 'DashEcosystemsCtrl'
    })
    .when('/project-overview/:surveySlug', {
        templateUrl: '/static/survey/views/ost/dash-project-overview.html',
        controller: 'DashProjectOverviewCtrl'
    })
    .when('/project-info/:surveySlug/:id', {
        templateUrl: '/static/survey/views/ost/dash-project-info-detail.html',
        controller: 'DashProjectInfoDetailCtrl'
    })

    // .when('/download/:surveySlug', {
    //     templateUrl: '/static/survey/views/ost/dash-download.html',
    //     controller: 'DashDownloadCtrl',
    // })
    .otherwise({
        redirectTo: '/welcome/'
    });
})
.run(function($rootScope, $location){
    if ($location.path().indexOf('monitoring-project') > -1) {
        $rootScope.survey = {
            slug: "monitoring-project"
        }
    } else {
        $rootScope.survey = {
            slug: "ncc-monitoring"
        }
    };
    
    $rootScope.user = app.user || {}
})
.controller('DashStatsCtrl', function($scope, surveyFactory) {
    surveyFactory.getAllSurveys(function (data) {
        var totals;
        $scope.survey = data;

        _.each(data.objects, function(survey) {
            if (survey.name === 'Monitoring Project'){
                $scope.ccSurvey = survey;
            } else {
                $scope.nccSurvey = survey;
            }
        })
        
        //only map neccessary data
        var arr = _.map(data.objects, function(i) {
            return _.pick(i, 'num_orgs', 'completes', 'total_sites')
        });

        //reduce and sum survey data
        _(arr).reduce(function(acc, obj) {
          _(obj).each(function(value, key) { acc[key] = (acc[key] ? acc[key] : 0) + value });
          return totals = acc;
        }, {});

        $scope.totals = totals;

    });
})
