(function () {
    
    function compare(a,b) {
    var d1 = Date.parse(a.date);
var d2 = Date.parse(b.date);
  if ( d1 < d2)
    return -1;
  if (d1 > d2)
    return 1;
  return 0;
}


    var app = angular.module('institution', ['elasticsearch']);


    app.service('client', function (esFactory) {
        return esFactory({
            host: defaults.es_host
        });
    });

    app.controller('InstitutionController', function ($scope, client) {
        $scope.currentPage = 0;
        $scope.numPerPage = 10;
        $scope.pagedItems = [];
        var url_options = $.getUrlVars();
        var orgID = url_options.orgID;

        client.search({
            index: defaults.kb_index,
            type: defaults.organisations_type,
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
            $scope.organisation._source.names.sort(compare)
            $scope.loadPulications();
            $scope.loadAuthors();
               });
            
        $scope.loadAuthors = function () {client.search({
            index: defaults.kb_index,
            type: defaults.authors,
            body: {
                "query":
                        {"match": {"affiliations.organisationId": url_options.orgID}
                        }

            }

        }).then(function (response) {
           $scope.authorsCount = response.hits.total;
        });
        }
        
        $scope.loadPulications = function () {client.search({
            index: defaults.kb_index,
            type: defaults.publications_type,
            
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
            for (var i = 0; i < response.hits.total; i++) {
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
            console.log($scope.pagedItems.length);
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
                console.log($scope.currentPage);
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
                index: defaults.fulltext_index,
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