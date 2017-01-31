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
    .when("/", {templateUrl: "partials/home.html", controller: "GeneralCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "GeneralCtrl"})
    .when("/userGuide", {templateUrl: "partials/userGuide.html", controller: "GeneralCtrl"})
    .when("/faq", {templateUrl: "partials/faq.html", controller: "GeneralCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "GeneralCtrl"})
    .when("/testDb", {templateUrl: "partials/testDb.html", controller: "TestDbCtrl"})

    .when("/connectDb", {templateUrl: "partials/connectDb.html", controller: "ConnectDbCtrl"})
    .when("/workspace", {templateUrl: "partials/workspace.html", controller: "WorkspaceCtrl"})

    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "GeneralCtrl"});
}]);

/* Controls the Connect DB page */
app.controller('ConnectDbCtrl', function ($scope/*, $location, $http */) {
  console.log('Connect Database Controller loaded.');

  // Initialize the inputs to '' and use the $scope.abc handles to access the data
  $scope.usernameInput = '';
  $scope.passwordInput = '';
  $scope.hostInput = '';
  $scope.hostInput = '';

  // TODO: Obfuscate password!!! There might be an external tool/plugin for this.

  // Function that connects the user's DB using the credential supplied
  $scope.connectDatabase = function(){
    console.log('Username:', $scope.usernameInput);
    console.log('Password:', $scope.passwordInput);
    console.log('Host:', $scope.hostInput);
    console.log('Port:', $scope.portInput);

    // Add code here to try to connect with credentials, show messages if incorrect, load data and proceed to workspace page if correct

  };
});

/* Controls the Workspace page */
app.controller('WorkspaceCtrl', function ($scope/*, $location, $http */) {
  $scope.database = function(){
    console.log('Database popup...');

    // TODO: Add code that pops up a database view that lets users see the test database
    //       If custom database selected, take back to connect database page to be able to edit the connnection
    //       (maybe make the text read "Database Connection") when connected to a custom database?

  }  

});

/* Controls the testDb modification page */
app.controller('TestDbCtrl', function ($scope/*, $location, $http */) {
  

});

/* Controls all other Pages (general) */
app.controller('GeneralCtrl', function ($scope/*, $location, $http */) {
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