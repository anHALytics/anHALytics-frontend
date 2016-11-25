(function () {
    var app = angular.module('institution', ['elasticsearch']);


    app.service('client', function (esFactory) {
        return esFactory({
            host: 'http://localhost:9200'
        });
    });

    app.controller('InstitutionController', function ($scope, client) {
        $scope.currentPage = 0;
        $scope.numPerPage = 10;
        $scope.pagedItems = [];
        var url_options = $.getUrlVars();
        var orgID = url_options.orgID;

        client.search({
            index: 'anhalytics_kb_inria',
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
            $scope.loadPulications();
               });
            
        $scope.loadPulications = function () {client.search({
            index: 'anhalytics_kb_inria',
            type: 'publications',
            
                from: $scope.currentPage,
                size: $scope.numPerPage,
            body: {
                "query":
                        {"match": {"organisations.organisationId": url_options.orgID}
                        }

            }

        }).then(function (response) {
            $scope.publications = [];
            $scope.publicationsCount = response.hits.total;
            for (var i = 0; i < $scope.organisation['_source']['documents'].length; i++) {
                if (i % $scope.numPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.numPerPage)] = [response.hits.hits[i]];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.numPerPage)].push(response.hits.hits[i]);
                }
            }
            
            $scope.publicationsAbstracts = [];
            $scope.terms1 = [];
                for (hit in response.hits.hits) {
                    $scope.publications.push(response.hits.hits[hit]);
                    $scope.terms1.push({"term": {"_id": response.hits.hits[hit]["_id"]}});
                }
                $scope.loadPulicationsAbstracts();
        });
            
     
        }




        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
                $scope.loadPulications();
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
            $scope.loadPulications();
        };
        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 0;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.loadPulicationsAbstracts = function () {
            $scope.abstracts = {};
            $scope.keywords = {};
            client.search({
                index: 'anhalytics_fulltextteis_inria',
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
                                    "should": $scope.terms1
                                }
                            }
                        }
                    }
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
        };
//        
//            // change sorting order
//    $scope.sort_by = function(newSortingOrder) {
//        if ($scope.sortingOrder == newSortingOrder)
//            $scope.reverse = !$scope.reverse;
//
//        $scope.sortingOrder = newSortingOrder;
//
//        // icon setup
//        $('th i').each(function(){
//            // icon reset
//            $(this).removeClass().addClass('icon-sort');
//        });
//        if ($scope.reverse)
//            $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-up');
//        else
//            $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-down');
//    };
    });
})();