(function () {

function compare(a,b) {
    var d1 = Date.parse(a.begin_date);
var d2 = Date.parse(b.begin_date);
  if ( d1 < d2)
    return -1;
  if (d1 > d2)
    return 1;
  return 0;
}

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
            host: defaults.es_host
        });
    });

    app.controller('ProfileController', function ($scope, client) {
        var url_options = $.getUrlVars();
        var authorID = url_options.authorID;
        client.search({
            index: defaults.kb_index,
            type: defaults.authors_type,
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

//$scope.profile._source.affiliations.sort(compare);


            $scope.terms = [];
            for (var i = 0; i < $scope.profile['_source']['publications'].length; i++) {
                $scope.terms.push({"term": {"_id": $scope.profile['_source']['publications'][i].docID}});
            }
            $scope.loadPulicationsAndCoAuthors();
            $scope.loadKeywordsAndInterests();

        });

        $scope.loadPulicationsAndCoAuthors = function () {

            $scope.publications = [];
            $scope.coauthors = [];
            client.search({
                index: defaults.kb_index,
                type: defaults.publications_type,
                size: 200, //could be tuned..
                body: {
                    "query": {
                        "filtered": {
                            "filter": {
                                "bool": {
                                    "should": $scope.terms
                                }
                            }
                        }
                    }
                }

            }).then(function (response) {
                for (hit in response.hits.hits) {
                    $scope.publications.push(response.hits.hits[hit]);
                    for (var j = 0; j < response.hits.hits[hit]['_source']['authors'].length; j++) {
                        var coauthor = response.hits.hits[hit]['_source']['authors'][j];
                        if (coauthor['personId'] != url_options.authorID) {
                            if (!coauthorExists(coauthor, $scope.coauthors)) {
                                coauthor['hits'] = 1;
                                $scope.coauthors.push(coauthor);
                                
                                console.log(coauthor);
                            }
                        }
                    }
                }
            });
        }
        $scope.loadKeywordsAndInterests = function () {

            $scope.interests = [];
            $scope.keywords = [];
            client.search({
                index: defaults.fulltext_index,
                body: {
                    "fields": [
                        "$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.$term",
                        "$teiCorpus.$standoff.$category.category"],
                    "query": {
                        "filtered": {
                            "filter": {
                                "bool": {
                                    "should": $scope.terms
                                }
                            }
                        }
                    }
                }

            }).then(function (response) {
                for (hit in response.hits.hits) {
                    var fields = response.hits.hits[hit].fields;
                    if (fields) {
                        var keywords = fields["$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.$term"];
                        var interests = fields["$teiCorpus.$standoff.$category.category"];
                        //nerd categories are more reliable
                        if (interests) {
                            for (var i = 0; i < interests.length && $scope.interests.length < 6; i++) {
                                $scope.interests.push(interests[i]);
                            }
                        }
                        if (keywords) {
                            for (var i = 0; i < keywords.length && $scope.keywords.length < 6; i++) {
                                $scope.keywords.push(keywords[i]);
                            }
                        }
                    }
                }
            });

        }
    });
})();
