angular.module('vaqoApp')
.directive('run', function() {
    return{
        restrict:'E',
        transclude:true,
        templateUrl:'../partials/runTemplate.html',
        scope: true,
        controllerAs: 'run',
        controller:function(){
            this.hi = "hi!!!";
            this.messages = [{text:"1 text", val:'45'}, {text:"2 text", val:'45'}];
            
        },
        link:function(scope,elem,attr){}
    }
})