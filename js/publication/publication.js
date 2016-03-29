(function () {
    var app = angular.module('publication', ['elasticsearch']);

    app.controller("PanelController", function () {
        this.tab = 'Overview';
        this.selectTab = function (setTab) {
            this.tab = setTab;
        }
        this.isSelected = function (checkTab) {
            return this.tab === checkTab;
        }

    });

    app.service('client', function (esFactory) {
        return esFactory({
            host: 'http://localhost:9200'
        });
    });

    app.controller('PublicationController', function ($scope, client) {
        var url_options = $.getUrlVars();
        var pubID = url_options.pubID;
// search for documents
        client.search({
            index: 'anhalytics_metadatas',
            type: 'publications',
            size: 1,
            body: {
                "query":
                        {
                            "match": {
                                _id: url_options.pubID
                            }
                        },
            }

        }).then(function (response) {
            $scope.publication = response.hits.hits[0];
        });

        client.search({
            index: 'anhalytics_teis',
            body: {
                "fields": [
                    "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_en",
                    "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_fr",
                    "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_de",
                    "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_es",
                    "$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.$term"],
                "query":
                        {
                            "match": {
                                _id: url_options.pubID
                            }
                        }
            }


        }).then(function (response) {
            var fields = response.hits.hits[0].fields;
            var abstract = null;
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

            var keywordsPiece = null;
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


            $scope.abstract = abstract;
            $scope.keywords = keywordsPiece;

        });
    });
})();
