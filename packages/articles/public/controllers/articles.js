'use strict';

angular.module('mean').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Global', 'Articles',
    function($scope, $stateParams, $location, Global, Articles) {
        $scope.global = Global;

        $scope.hasAuthorization = function(article) {
            if (!article || !article.user) return false;
            return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
        };

        

        $scope.create = function(isValid) {

            if (isValid) {
                var article = new Articles({
                    title: this.title,
                    capacity: this.capacity,
                    type: this.type, 
                    content: this.content,
                    booked: false
                });
                console.log('Create article JSONP --', article);
                article.$save(function(response) {
                    $location.path('articles/' + response._id);
                });

                this.title = '';
                this.content = '';
                this.type = '';
                this.capacity = '';
            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function(response) {
                    $location.path('articles');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var article = $scope.article;

                if (!article.updated) {
                    article.updated = [];
                }
                article.updated.push(new Date().getTime());
                 console.log("Article Updated", article.updated) 
                console.log("Article Scope after update", $scope.article)
                article.$update(function() {
                    //$location.path('articles/' + article._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Articles.query(function(articles) {
                $scope.articles = articles;
                
            });
        };

        $scope.findOne = function() {
            Articles.get({
                articleId: $stateParams.articleId
            }, function(article) {
                $scope.article = article;
                console.log("FIND ONE --- ", $scope.article);
            });
        };

        
        $scope.book = function(isValid) {
           if(isValid) {
                 var article = $scope.article;
                 article.booked = true;

                 article.$book();

                console.log('This is the book function', $scope.article);
               
                // if (!article.updated) {
                //     article.updated = [];
                // }

                // $scope.article.booked = true;
               // article.updated.push(article.booked);   
               //$scope.update();
                console.log("Article Updated", article.updated) 
                console.log("Article Scope after update", $scope.article)
                $scope.submitted = true;
            }
        }
    }
]);
