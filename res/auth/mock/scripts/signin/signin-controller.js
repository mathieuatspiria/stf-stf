/**
* Copyright © 2019 contains code contributed by Orange SA, authors: Denis Barbaron - Licensed under the Apache license 2.0
**/
var url = require('url')

module.exports = function SignInCtrl($scope, $http, CommonService) {

  $scope.error = null

  $scope.submit = function() {
    var data = {
      name: $scope.signin.username.$modelValue
      , email: $scope.signin.email.$modelValue
    }
    $scope.invalid = false
    $http.post('/auth/api/v1/mock', data)
      .success(function(response) {
        $scope.error = null
        var urlParams = url.parse(location.href, true)
        location.replace(response.redirect + decodeURIComponent(urlParams.hash ? urlParams.hash : ""))
      })
      .error(function(response) {
        switch (response.error) {
          case 'ValidationError':
            $scope.error = {
              $invalid: true
            }
            break
          case 'InvalidCredentialsError':
            $scope.error = {
              $incorrect: true
            }
            break
          default:
            $scope.error = {
              $server: true
            }
            break
        }
      })
  }

  $scope.mailToSupport = function() {
    CommonService.url('mailto:' + $scope.contactEmail)
  }

  $http.get('/auth/contact').then(function(response) {
    $scope.contactEmail = response.data.contact.email
  })
}
