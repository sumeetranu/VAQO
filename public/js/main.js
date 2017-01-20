/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('vaqoApp', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/faq", {templateUrl: "partials/faq.html", controller: "PageCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    .when("/testDb", {templateUrl: "partials/testDb.html", controller: "PageCtrl"})

    .when("/connectDb", {templateUrl: "partials/connectDb.html", controller: "ConnectDbCtrl"})
    .when("/workspace", {templateUrl: "partials/workspace.html", controller: "PageCtrl"})

    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ($scope/*, $location, $http */) {
  console.log("Page Controller loaded.");
  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  });

});

app.controller('ConnectDbCtrl', function ($scope/*, $location, $http */) {
  console.log('Connect Database Controller loaded.');

  $scope.usernameInput = '';
  $scope.passwordInput = '';
  $scope.hostInput = '';
  $scope.hostInput = '';

  // Function that connects the user's DB using the credential supplied
  $scope.connectDatabase = function(){
    console.log('Username:', $scope.usernameInput);
    console.log('Password:', $scope.passwordInput);
    console.log('Host:', $scope.hostInput);
    console.log('Port:', $scope.portInput);
  };
});