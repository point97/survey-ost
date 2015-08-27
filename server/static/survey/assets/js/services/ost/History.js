//'use strict';

angular.module('askApp')
  .factory('history', function ($http, $location, survey) {

    var getSurveyTitle = function(respondent) {
        var title = respondent.survey;
        title += respondent.ts;
        return title;
    }

    var getOrganizationName = function(respondent) {
        var val = "None";
        try {
            val = _.findWhere(respondent.responses, {question: 'org-name'}).answer.text;
        } catch(e) { }
        return val;
    };

    var getAnswer = function(questionSlug, respondent) {
        /*
        Returns a string i think
        */


        if (typeof(respondent) === 'undefined') {
            return "";
        }
        try {
            
            var question = _.findWhere(respondent.responses, {question: questionSlug});
            var answer = '';
            
                
                // We don't have access to the question types here 
                // so we're sorting them out here.
                singleSelects = 
                            ['org-type',
                             'proj-num-people', 
                             'proj-data-years', 
                             'proj-data-frequency', 
                             'proj-financial-support-timeline',
                             'ncc-rockyintertidal-point-vs-grid',
                             'ncc-kelp-and-shallow-rock-point-vs-grid',
                             'ncc-middepthrock-point-vs-grid',
                             'ncc-estuarine-point-vs-grid',
                             'ncc-softbottomintertidal-point-vs-grid',
                             'ncc-softbottomsubtidal-point-vs-grid',
                             'ncc-deep-point-vs-grid',
                             'ncc-nearshore-point-vs-grid',
                             'ncc-consumptive-point-vs-grid',
                             'ncc-nonconsumptive-point-vs-grid',
                             'cd-collection-locations',
                             'cde-where',
                             'proj-data-availability', 
                             'future-monitoring-yes-no',
                             'cd-use',
                             'cde-use',
                             'proj-financial-support-timeline'],
                
                multiSelects = 
                             ['proj-operational-capacity-if-funded', 
                              'ncc-ecosystem-features', 
                              'future-monitoring-ecosystems',
                              'proj-operational-capacity-if-funded'],
                
                groupedMultiSelects = 
                             ['org-funding',
                              'ncc-rockyintertidal-species',
                              'ncc-kelp-and-shallow-rock-species',
                              'ncc-middepthrock-species',
                              'ncc-estuarine-species',
                              'ncc-softbottomintertidal-species',
                              'ncc-softbottomsubtidal-species',
                              'ncc-deep-species',
                              'ncc-nearshore-species',
                              'ncc-consumptive-species',
                              'ncc-nonconsumptive-species'],

                mapPolys =  ['ncc-rockyinteridal-collection-areas',
                             'ncc-kelp-and-shallow-rock-collection-areas',
                             'ncc-middepthrock-collection-areas',
                             'ncc-estuarine-collection-areas',
                             'ncc-softbottomintertidal-collection-areas',
                             'ncc-softbottomsubtidal-collection-areas',
                             'ncc-deep-collection-areas',
                             'ncc-nearshore-collection-areas',
                             'ncc-consumptive-collection-areas',
                             'ncc-nonconsumptive-collection-areas'],
                
                mapPoints = ['ncc-rockyintertidal-collection-points',
                             'ncc-kelp-and-shallow-rock-collection-points',
                             'ncc-middepthrock-collection-points',
                             'ncc-estuarine-collection-points',
                             'ncc-softbottomintertidal-collection-points',
                             'ncc-softbottomsubtidal-collection-points',
                             'ncc-deep-collection-points',
                             'ncc-nearshore-collection-points',
                             'ncc-consumptive-collection-points',
                             'ncc-nonconsumptive-collection-points'];



            // Grab answer based on the type of question.
            if (_.contains(singleSelects, questionSlug)) {
                answer = question.answer.text;

            } else if (_.contains(multiSelects, questionSlug)) {
                var objs = question.answer;
                _.each(objs, function(obj, index) {
                    answer += answer.length > 0 ? ", " + obj.text : obj.text;
                });

            } else if (_.contains(groupedMultiSelects, questionSlug)) {
                answer = question.answer;
                _.each(answer, function(obj, index) {
                    if (index === 0 && obj.groupName) {
                        obj.showGroupName = true;
                    } else if (obj.groupName && obj.groupName !== answer[index-1].groupName) {
                        obj.showGroupName = true;
                    } else if (obj.other && answer[index-1].showGroupName !== 'Other') {
                        obj.showGroupName = true;
                        obj.groupName = 'Other';
                    } else {
                        obj.showGroupName = false;
                    }
                });

            } else if (questionSlug === 'proj-collaborating-orgs'){
                answer = question.answer_raw.substring(1, question.answer_raw.length-1).split("\\n");
            
            } else {
                answer = question.answer;
            }

            //if (answer === '') answer = 'Not Available';
            
        } catch(e) {
            
            
            if (question) {
                console.log('using "other" answer for '+questionSlug);
                answer = question.answer;
            } else {
                console.log("No answer found for " + questionSlug);
                answer = '';
            }
            
        }

        if (answer === 'NA' || answer === 'NO_ANSWER') {
            answer = 'Not Available';
        }
        
        return answer;
    };

    



    // Public API here
    return {
      'getOrganizationName': getOrganizationName,
      'getAnswer': getAnswer
    };
  });
