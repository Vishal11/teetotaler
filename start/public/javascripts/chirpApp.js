// <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>

// ngResource Options

// { 'get':    {method:'GET'},
//   'save':   {method:'POST'},
//   'query':  {method:'GET', isArray:true},
//   'remove': {method:'DELETE'},
//   'delete': {method:'DELETE'} };


var app=angular.module('chirpApp',['ngRoute','ngResource']).run(function($rootScope,$http){
	$rootScope.authenticated=false;
	$rootScope.current_user="";
	$rootScope.current_userId="";

	$rootScope.logout=function(){
		$http.get('/auth/signout');
		$rootScope.authenticated=true;
		$rootScope.current_user="";
	};

});

app.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:'main.html',
		controller:'mainController'
	})
	.when('/login',{
		templateUrl:'login.html',
		controller:'authController'
	})
	.when('/register',{
		templateUrl:'register.html',
		controller:'authController'
	})
	.when('/bars',{
		templateUrl:'bars.html',
		controller:'barController'
	})
	.when('/adminBar',{
		templateUrl:'adminBar.html',
		controller:'barController'
	});
});

// app.factory('postService',function($resource){
// 	return $resource('/api/posts/:id');
// 	// var factory={};
// 	// factory.getAll=function(){
// 	// 	return $http.get('/api/posts');
// 	// }
// 	// return factory;
// });

app.factory('barCreateUpdateService',function($resource){
	return $resource('/api/bars/:id');
	// var factory={};
	// factory.getAll=function(){
	// 	return $http.get('/api/posts');
	// }
	// return factory;
});

app.factory('barReviewCreateUpdateService',function($resource){
	return $resource('/api/barreview/:id',{ id: '@id' },{update: {
      method: 'PUT' // this method issues a PUT request
    }
});
	// var factory={};
	// factory.getAll=function(){
	// 	return $http.get('/api/posts');
	// }
	// return factory;
});

app.controller('mainController',function($rootScope,$scope){
	//$scope.posts=postService.query();
	$scope.posts=[];
	$scope.newPost={created_by:'', text:'', created_at:''};
	
	
	// postService.getAll().success(function(data){
	// 	$scope.posts=data;
	// });

	// $http.post('/api/posts',function(data){

	// });


	// $scope.post=function()
	// {
	// 	$scope.newPost.created_by=$rootScope.current_user;
	// 	$scope.newPost.created_at=Date.now();
	// 	postService.save($scope.newPost,function(){
	// 	$scope.posts=postService.query();
	// 	$scope.newPost={created_by:'', text:'', created_at:''};	
	// 	})
		
	// };


});

app.controller('authController',function($scope,$rootScope,$http,$location){


$scope.user={username:'',password:''};
$scope.error_message='';

$scope.login=function()
{

	$http.post('/auth/login',$scope.user).success(function(data){
		$rootScope.authenticated=true;
		$rootScope.current_user=data.user.username;
		$rootScope.current_userId=data.user._id;
		$location.path('/')
	})
	//$scope.error_message='login request for '+ $scope.user.username;
};

$scope.register=function(user){	
	
	$http.post('/auth/signup',user).success(function(data){
		$rootScope.authenticated=true;
		$rootScope.current_user=data.user.username;
		$rootScope.current_userId=data.user._id;
		$location.path('/')
	});
	//$scope.error_message='registration request for '+ $scope.user.username;	
};
});


app.controller('barController',function($scope,$rootScope,$http,barCreateUpdateService,barReviewCreateUpdateService){

	$scope.current_userId=$rootScope.current_userId
	$http.get('/files/states.csv').success(function(allText){
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];

		for ( var i = 0; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				var tarr = [];
				for ( var j = 0; j < headers.length; j++) {
					tarr.push(data[j].replace(/"/g,''));
				}
				lines.push(tarr);
			}
		}
		$scope.states = lines;		

	});

	$scope.GetStateBars=function(){


		$scope.bars=$scope.allBars.filter(function(obj){
			return obj.stateId==$scope.selectedStateId
		});
		

	}




	$scope.createUpdateBar=function(bar){
		console.log(bar);
		if(bar.name && bar.address && bar.stateId && bar.contactNumber && bar.cuisines && bar.type)
		{
			//$scope.bar.imagePath=$scope.imagePath;
			barCreateUpdateService.save($scope.bar,function(){
				$scope.allBars=$scope.bars=barCreateUpdateService.query();		
				//$scope.bar.name=$scope.bar.address=$scope.bar.contactNumber=$scope.bar.cuisines=$scope.bar.type=$scope.bar.description1=$scope.bar.description2=$scope.bar.description3=''
				//$scope.stateId='-1'			
			});
			
		}

			
		
		else
		{
			alert("Please fill the complete info");
		
			return false
		}
	}

	$scope.allBars=$scope.bars=barCreateUpdateService.query();
	
	// $scope.states='New Delhi|Andaman/Nicobar Islands|Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chandigarh|Chhattisgarh|Dadra/Nagar Haveli|Daman/Diu|Goa|Gujarat|Haryana|Himachal Pradesh|Jammu/Kashmir|Jharkhand|Karnataka|Kerala|Lakshadweep|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Orissa|Pondicherry|Punjab|Rajasthan|Sikkim|Tamil Nadu|Tripura|Uttaranchal|Uttar Pradesh|West Bengal'.split('|');

	$scope.GetSelectedBarData=function(bar){
		
		$scope.barData=$scope.bars.filter(function(obj){
			return obj.id==$scope.selectedBarId;
		});
		// barReviewCreateUpdateService.get({}, {'query': {method: 'GET', isArray: false/*true*/}},function(data){
		// 	$scope.reviews=data;
		// });
	}

	
	$scope.barReview={barId:'',	review:'',rating:'',userId:'',created_at:''};
	$scope.reviews={};
	$scope.review={text:'',rating:''};

	$scope.addUpdateReview=function(){
		$scope.barReview.barId=$scope.selectedBarId
		$scope.barReview.review=$scope.review.text;
		$scope.barReview.rating=$scope.review.rating;
		$scope.barReview.userId=$rootScope.current_userId;
		$scope.reviews=barReviewCreateUpdateService.save($scope.barReview,function(){
			$scope.reviews= barReviewCreateUpdateService.query();
		})
		$scope.review.text='';
		$scope.review.rating='-1'
	}

	$scope.reviews=barReviewCreateUpdateService.query();


	$scope.deleteReview=function(review){			
		barReviewCreateUpdateService.delete({id: review._id});		
		$scope.reviews= barReviewCreateUpdateService.query();
	}
	$scope.editable=false
	$scope.editReview=function(review){
		$scope.editable=true;
		// $scope.review.text=review.review;
		// $scope.review.rating=review.rating
	}

	$scope.updateReview=function(review){
		review.created_at=Date.now();
		barReviewCreateUpdateService.update(review)
		$scope.editable=false
	}
	$scope.cancelUpdateReview=function(){
		$scope.editable=false
	}

});