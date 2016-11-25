
var IndivPublicationsPerYearESQuery = function (authorID) {

    var qs = {};

    // set any facets
    qs['size'] = 0; 
    qs['query'] = {"match": {"_id": authorID}};
    qs['aggs'] = {
        "publication_date": {
            "nested": {
                "path": "publications"
            },
            "aggs": {"publication_dates": {
                    "date_histogram": {"field": "publications.publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd"}
                        }
                        }
            }
            };
    
    var theUrl = JSON.stringify(qs);
    return theUrl;
};


var elasticSearchAggQuery2 = function (authorID) {

    var qs = {};

    // set any facets
    //qs['size'] = 0; 
    qs['query'] = {"match": {"_id": authorID}};
    qs['aggs'] = {"publication_date": {"terms": {"field": "pauthors.publications.publication.date_printed"}}};
    var theUrl = JSON.stringify(qs);

    return theUrl;
};


var TopicsByAuthorESQuery = function (id) {

    var qs = {};
    // set any facets
    qs['size'] = 10;
    qs['query'] = {"terms": {"_id": id}};
    qs['aggs'] = {"category": {"terms": {"field": "annotations.$standoff.$category.category", "size": 20}}};
    var theUrl = JSON.stringify(qs);
    return theUrl;
};

var IndivPublicationsPerCountryESQuery = function () {

    var qs = {};
    qs['query'] = {"match": {"authors.personId": authID}};
    // set any facets
    qs['size'] = 0;
    qs['aggs'] = {"country": {"terms": {"field": "organisations.address.country", "size": 20}}};

    var theUrl = JSON.stringify(qs);

    return theUrl;
};


var IndivPublicationsPerAffiliationESQuery = function () {

    var qs = {};

    // set any facets
    qs['size'] = 0; 
    qs['aggs'] = {"Organisation":{"terms":{"field":"$teiCorpus.$teiHeader.$fileDesc.$sourceDesc.$biblStruct.$analytic.$author.$affiliation.$org.$idno.$type_orgAnhalyticsID"},
   "aggs": {
    "authors": {
     "terms": {
      "field": "$teiCorpus.$teiHeader.$fileDesc.$sourceDesc.$biblStruct.$analytic.$author.$idno.$type_authorAnhalyticsID"
     }
    }
   }}};
    
    var theUrl = JSON.stringify(qs);

    return theUrl;
};


var IndivPublicationsPerTopicESQuery = function () {

    var qs = {};

    // set any facets
    qs['size'] = 0; 
    
    qs['query'] = {"match": {"authors.personId": authID}};
    qs['aggs'] = {"topic":{"terms":{"field":"annotations.$standoff.$nerd.preferredTerm"},
   "aggs": {
    "authors": {
     "terms": {
      "field": "authors.personId", "size": 20
     }
    }
   }}};
    
    var theUrl = JSON.stringify(qs);

    return theUrl;
};

var PersonNamesByPersonId = function (ids){

    var qs = {};
    qs['size'] = 50;
    qs['query'] = {"ids": {"values": ids}};
    // set any facets
    qs['fields'] = ["names.fullname"];
    var theUrl = JSON.stringify(qs);

    return theUrl;
};

var CoAuthorsOverTimeESQuery = function () {

    var qs = {};

    // set any facets
    qs['size'] = 0;
//    if (params.topic)
//        qs['query'] = {"filtered": {"filter": {"query": {"bool": {"must": [{"term": {"annotations.$standoff.$category.category": params.topic}
//                                }
//                            ]
//                        }
//                    }
//                }, "query": {"match": {"organisations.organisationId": params.organisationID}
//                }
//            }
//        }
//    else
        qs['query'] = {"match": {"authors.personId": authID}};
    
    qs['aggs'] = {"publication_dates": {
                    "date_histogram": {
                        "field": "publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd", "size": 20
                    },
            "aggs": {
                "author": {"terms": {"field": "authors.personId", "size": 20}
                }
            }

        }};
    
    var theUrl = JSON.stringify(qs);

    return theUrl;
};

var IndivKeywordsByAuthorByYearESQuery = function () {

    var qs = {};

    // set any facets
    qs['size'] = 0; 
    qs['query'] = {"match": {"authors.personId": authID}};
    
    qs['aggs'] = {"publication_dates": {
                    "date_histogram": {
                        "field": "publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd", "size": 20
                    },
            "aggs": {
                "keyterms": {"terms": {"field": "annotations.$standoff.$keyterm.keyterm", "size": 20}
                }
            }

        }};
    
    var theUrl = JSON.stringify(qs);
    return theUrl;
};