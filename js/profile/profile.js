(function () {

    var coauthorExists = function (coauthor, coauthors)
    {
        var found = false;
        for (var i = 0; i < coauthors.length; i++) {
            if (coauthors[i]['personId'] == coauthor['personId']) {
                coauthors[i]['personId']['hist']++;
                found = true;
                break;
            }
        }
        return found;
    }
    var app = angular.module('profile', ['elasticsearch']);


    app.service('client', function (esFactory) {
        return esFactory({
            host: 'http://localhost:9200'
        });
    });

    app.controller('ProfileController', function ($scope, client) {
        var url_options = $.getUrlVars();
        var authorID = url_options.authorID;
        client.search({
            index: 'anhalytics_metadatas',
            type: 'authors',
            size: 1,
            body: {
                "query":
                        {
                            "match": {
                                _id: url_options.authorID
                            }
                        },
            }

        }).then(function (response) {
            $scope.profile = response.hits.hits[0];
            $scope.publications = [];
            $scope.coauthors = [];
            var coauthors = [];
            for (var i = 0; i < $scope.profile['_source']['publications'].length; i++) {
                //console.log($scope.profile['_source']['publications'][i]);
                client.search({
                    index: 'anhalytics_metadatas',
                    type: 'publications',
                    body: {
                        "query":
                                {
                                    "match": {
                                        _id: $scope.profile['_source']['publications'][i].docID
                                    }
                                }
                    }

                }).then(function (response) {
                    $scope.publications.push(response.hits.hits[0]);
                    for (var j = 0; j < response.hits.hits[0]['_source']['authors'].length; j++) {
                        var coauthor = response.hits.hits[0]['_source']['authors'][j];
                        if (coauthor['personId'] != url_options.authorID) {
                            if (!coauthorExists(coauthor, $scope.coauthors)) {
                                coauthor['hits'] = 1;
                                $scope.coauthors.push(coauthor);
                            }
                        }
                    }
                });

            }


        });




    });
})();
