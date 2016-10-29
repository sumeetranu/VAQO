angular.module('vaqoApp')
.directive('run', function() {
    return{
        restrict:'E',
        transclude:true,
        template:'<p>This is the Run tab.</p>',
        scope: {},
        link:function(scope,elem,attr){}
    }
})