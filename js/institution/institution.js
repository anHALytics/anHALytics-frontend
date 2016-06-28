(function () {
    var app = angular.module('institution', ['elasticsearch']);


    app.service('client', function (esFactory) {
        return esFactory({
            host: 'http://localhost:9200'
        });
    });

    app.controller('InstitutionController', function ($scope, client) {
        var url_options = $.getUrlVars();
        var orgID = url_options.orgID;
        client.search({
            index: 'anhalytics_kb',
            type: 'organisations',
            body: {
                "query":
                        {
                            "match": {
                                _id: url_options.orgID
                            }
                        }
            }

        }).then(function (response) {
            $scope.organisation = response.hits.hits[0];
            $scope.publications = [];
            $scope.abstracts = {};
            $scope.keywords = {};
            var terms = [];
            for (var i = 0; i < $scope.organisation['_source']['publications'].length; i++) {
                terms.push({"term": {"_id": $scope.organisation['_source']['publications'][i].docID}});
            }
            client.search({
                index: 'anhalytics_kb',
                type: 'publications',
                body: {
                    "query": {
                        "filtered": {
                            "filter": {
                                "bool": {
                                    "should": terms
                                }
                            }
                        }
                    }
                }

            }).then(function (response) {
                for (hit in response.hits.hits) {
                    $scope.publications.push(response.hits.hits[hit]);
                }
            });


            client.search({
                index: 'anhalytics_fulltextteis',
                body: {
                    "fields": [
                        "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_en",
                        "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_fr",
                        "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_de",
                        "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_es",
                        "$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.$term"],
                    "query": {
                        "filtered": {
                            "filter": {
                                "bool": {
                                    "should": terms
                                }
                            }
                        }
                    },
                }


            }).then(function (response) {
                if (response.hits.hits.length > 0) {
                    for (hit in response.hits.hits) {
                        var keywordsPiece = "";
                        var abstract = "";
                        var fields = response.hits.hits[hit].fields;
                        var id = response.hits.hits[hit]._id;

                        var abstracts = fields['$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_en'];
                        if (typeof abstracts == 'string') {
                            abstract = abstracts;
                        } else {
                            if (abstracts && (abstracts.length > 0)) {
                                abstract = abstracts[0];
                                while ((typeof abstract != 'string') && (typeof abstract != 'undefined')) {
                                    abstract = abstract[0];
                                }
                            }
                        }

                        if (!abstract || (abstract.length == 0)) {
                            abstracts = fields['$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_fr'];
                            if (typeof abstracts == 'string') {
                                abstract = abstracts;
                            } else {
                                if (abstracts && (abstracts.length > 0)) {
                                    abstract = abstracts[0];
                                    while ((typeof abstract != 'string') && (typeof abstract != 'undefined')) {
                                        abstract = abstract[0];
                                    }
                                }
                            }
                        }

                        if (!abstract || (abstract.length == 0)) {
                            abstracts = fields['$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_de'];
                            if (typeof abstracts == 'string') {
                                abstract = abstracts;
                            } else {
                                if (abstracts && (abstracts.length > 0)) {
                                    abstract = abstracts[0];
                                    while ((typeof abstract != 'string') && (typeof abstract != 'undefined')) {
                                        abstract = abstract[0];
                                    }
                                }
                            }
                        }

                        if (!abstract || (abstract.length == 0)) {
                            abstracts = fields['$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_es'];
                            if (typeof abstracts == 'string') {
                                abstract = abstracts;
                            } else {
                                if (abstracts && (abstracts.length > 0)) {
                                    abstract = abstracts[0];
                                    while ((typeof abstract != 'string') && (typeof abstract != 'undefined')) {
                                        abstract = abstract[0];
                                    }
                                }
                            }
                        }

                        // keywords
                        var keyword = null;
                        var keywords =
                                fields['$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.$term'];
                        if (typeof keywords == 'string') {
                            keyword = keywords;
                        } else {
                            var keyArray = keywords;
                            if (keyArray) {
                                for (var p in keyArray) {
                                    if (p == 0) {
                                        keyword = keyArray[p];
                                    } else {
                                        keyword += ' - ' + keyArray[p];
                                    }
                                }
                            }
                        }

                        if (keyword && (keyword.length > 0) && (keyword.trim().indexOf(" ") != -1)) {
                            keywordsPiece = keyword;
                        }

                        $scope.abstracts[id] = abstract;
                        $scope.keywords[id] = keywordsPiece;
                    }
                }
            });
        });


    });
})();