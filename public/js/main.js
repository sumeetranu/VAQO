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
    .when("/testDb", {templateUrl: "partials/testDb.html", controller: "PageCtrl"})

    .when("/connectDb", {templateUrl: "partials/connectDb.html", controller: "PageCtrl"})
    .when("/workspace", {templateUrl: "partials/workspace.html", controller: "TabsCtrl"})
    // Workspace tabs
    .when("/run", {templateUrl: "partials/run.html", controller: "RunCtrl"})
    .when("/optimize", {templateUrl: "partials/optimize.html", controller: "OptimizeCtrl"})
    .when("/convert", {templateUrl: "partials/convert.html", controller: "ConvertCtrl"})

    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller loaded.");
  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});

app.controller('TabsCtrl', function ($scope, $location) {
  console.log('Tabs Controller loaded.');
  $scope.tabs = [
    {link:'/run', bootLink:'#run', label:'Run'},
    {link:'/optimize', bootLink:'#optimize', label:'Optimize'},
    {link:'/convert', bootLink:'#convert',label:'Convert'}
  ];

  $scope.selectedTab = $scope.tabs[0];

  $scope.setSelectedTab = function(tab){
    $scope.selectedTab = tab;
  }

  $scope.tabClass = function(tab){
    if($scope.selectedTab == tab){
      return "active";
    } else{
      return "";
    }

  }

});

app.controller('RunCtrl', function (/* $scope, $location, $http */) {
  console.log("Run Controller loaded.");

});

app.controller('OptimizeCtrl', function (/* $scope, $location, $http */) {
  console.log("Optimize Controller loaded.");

});

app.controller('ConvertCtrl', function (/* $scope, $location, $http */) {
  console.log("Convert Controller loaded.");

});