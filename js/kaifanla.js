/**
 * Created by bjwsl-001 on 2017/1/10.
 */


var app = angular.module('kfl', ['ionic']);

//配置状态
app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('start', {
      url: '/myStart',
      templateUrl: 'tpl/start.html'
    })
    .state('main', {
      url: '/myMain',
      templateUrl: 'tpl/main.html',
      controller: 'mainCtrl'
    })
    .state('detail', {
      url: '/myDetail/:id',
      templateUrl: 'tpl/detail.html',
      controller: 'detailCtrl'
    })
    .state('order', {
      url: '/myOrder/:id',
      templateUrl: 'tpl/order.html',
      controller: 'orderCtrl'
    })
    .state('personOrder', {
      url: '/personOrder',
      templateUrl: 'tpl/myOrder.html',
      controller:'personOrderCtrl'
    })
  $urlRouterProvider.otherwise('myStart');
})

app.controller('parentCtrl',
  ['$scope', '$state', function ($scope, $state) {
    $scope.jump = function (state) {
      $state.go(state);
    }
  }])


app.controller('mainCtrl',
  ['$scope', '$http', function ($scope, $http) {

    $scope.hasMore = true;
    $scope.inputTxt = {kw: ''};
    $scope.$watch('inputTxt.kw', function () {
      //console.log($scope.inputTxt.kw);
      if ($scope.inputTxt.kw) {
        $http
          .get('data/dish_getbykw.php?kw=' + $scope.inputTxt.kw)
          .success(function (data) {
            $scope.dishList = data;
          })
      }

    })

    $http
      .get('data/dish_getbypage.php?start=0')
      .success(function (data) {
        //console.log(data);
        $scope.dishList = data;
      })

    $scope.loadMore = function () {
      $http
        .get('data/dish_getbypage.php?start=' + $scope.dishList.length)
        .success(function (data) {
          console.log(data);
          if (data.length < 5) {
            $scope.hasMore = false;
          }
          $scope.dishList = $scope.dishList.concat(data);

          $scope.$broadcast('scroll.infiniteScrollComplete');

        })
    }

  }])


app.controller('detailCtrl',
  ['$scope', '$http', '$stateParams',
    function ($scope, $http, $stateParams) {
      //console.log($stateParams.id);
      $http
        .get('data/dish_getbyid.php?id=' + $stateParams.id)
        .success(function (data) {
          console.log(data);
          $scope.dish = data[0];
        })
    }])

app.controller('orderCtrl',
  ['$scope', '$http', '$stateParams','$httpParamSerializerJQLike',
    function ($scope, $http, $stateParams,$httpParamSerializerJQLike) {
      console.log($stateParams.id);
      $scope.order = {did:$stateParams.id};

      $scope.submitOrder = function () {
        var result = $httpParamSerializerJQLike($scope.order);
        console.log(result);
        $http
          .get('data/order_add.php?'+result)
          .success(function (data) {
            console.log(data);
            if(data[0].msg == 'succ')
            {
              $scope.succMsg = "下单成功，订单编号为"+data[0].oid;
              sessionStorage.setItem('phone',$scope.order.phone);
            }
            else
            {
              $scope.errMsg = "下单失败";
            }
          })
      }
    }]);

app.controller('personOrderCtrl',['$scope','$http',function($scope,$http){
  var phone=sessionStorage.setItem('phone');
  console.log('下单成功的手机号为：'+phone);

  $http.get('data/order_getbyphone.php?phone='+phone)
    .success(function(data){
      console.log(data);
      $scope.orderList=data;
    });
}]);