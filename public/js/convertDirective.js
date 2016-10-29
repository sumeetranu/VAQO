angular.module('vaqoApp')
.directive('convert', function() {
    return{
        restrict:'E',
        transclude:true,
        template:'<p>This is the Convert tab.</p>',
        scope: {},
        link:function(scope,elem,attr){}
    }
})