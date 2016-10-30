angular.module('vaqoApp')
.directive('run', function() {
    return{
        restrict:'E',
        transclude:true,
        templateUrl:'../partials/runTemplate.html',
        scope: {},
        link:function(scope,elem,attr){}
    }
})