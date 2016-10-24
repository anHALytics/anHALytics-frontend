
var elasticSearchAggQuery1 = function (authorID) {

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

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};


var elasticSearchAggQuery2 = function (authorID) {

    var qs = {};

    // set any facets
    //qs['size'] = 0; 
    console.log(authorID);
    qs['query'] = {"match": {"_id": authorID}};
    qs['aggs'] = {"publication_date": {"terms": {"field": "pauthors.publications.publication.date_printed"}}};
    var theUrl = JSON.stringify(qs);

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};


var elasticSearchAggQuery6 = function (id) {

    var qs = {};
    // set any facets
    qs['size'] = 10;
    qs['query'] = {"terms": {"_id": id}};
    qs['aggs'] = {"category": {"terms": {"field": "annotations.$standoff.$category.category"}}};
    var theUrl = JSON.stringify(qs);
    console.log(theUrl);
    return theUrl;
};

var elasticSearchAggQuery3 = function (id) {

    var qs = {};
    qs['query'] = {"terms": {"_id": id}};
    // set any facets
    qs['size'] = 0;
    qs['aggs'] = {"country": {"terms": {"field": "organisations.address.country"}}};

    var theUrl = JSON.stringify(qs);

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};


var elasticSearchAggQuery2 = function () {

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

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};


var elasticSearchAggQuery4 = function () {

    var qs = {};

    // set any facets
    qs['size'] = 0; 
    qs['aggs'] = {"country":{"terms":{"field":"$teiCorpus.$standoff.$nerd.preferredTerm"},
   "aggs": {
    "typology": {
     "terms": {
      "field": "$teiCorpus.$teiHeader.$fileDesc.$sourceDesc.$biblStruct.$analytic.$author.$idno.$type_authorAnhalyticsID"
     }
    }
   }}};
    
    var theUrl = JSON.stringify(qs);

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};

var elasticSearchAggQuery5 = function (ids) {

    var qs = {};

    // set any facets
    qs['size'] = 0; 
    qs['query'] = {"terms": {"_id": ids}};
    
    qs['aggs'] = {"publication_dates": {
                    "date_histogram": {
                        "field": "publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd"
                    },
            "aggs": {
                "author": {"terms": {"field": "authors.personId"}
                }
            }

        }};
    
    var theUrl = JSON.stringify(qs);

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};

var elasticSearchAggQuery7 = function (ids) {

    var qs = {};

    // set any facets
    qs['size'] = 0; 
    qs['query'] = {"terms": {"_id": ids}};
    
    qs['aggs'] = {"publication_dates": {
                    "date_histogram": {
                        "field": "publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd"
                    },
            "aggs": {
                "keyterms": {"terms": {"field": "annotations.$standoff.$keyterm.keyterm"}
                }
            }

        }};
    
    var theUrl = JSON.stringify(qs);

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};