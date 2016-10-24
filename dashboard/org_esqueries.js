
var elasticSearchAggQuery1 = function (id) {

    var qs = {};
    var idarr = [];
    console.log(id);
    // set any facets
    qs['size'] = 0;
    qs['query'] = {"match": {"_id": id}};
//    qs['aggs'] = {
//        "publication_date": {"date_histogram": {"field": "documents.publication.date_printed", "interval": "year",
//                        "format": "yyyy-MM-dd"}}};

    qs['aggs'] = {
        "publication_date": {
            "nested": {
                "path": "documents"
            },
            "aggs": {publication_dates: {
                    "date_histogram": {"field": "documents.publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd"}}
            }}};
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


var elasticSearchAggQuery5 = function (id) {

    var qs = {};
    // set any facets
    qs['size'] = 10;
    qs['query'] = {"term": {"relations.organisationId": id}};
    qs['sort'] = [
        {"docCount": {"order": "desc"}}
    ];
    var theUrl = JSON.stringify(qs);
    console.log(theUrl);
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

var elasticSearchAggQuery7 = function (id) {

    var qs = {};
    // set any facets
    qs['size'] = 10;
    qs['query'] = {"terms": {"_id": id}};
    qs['aggs'] = {"category": {"terms": {"field": "annotations.$standoff.$keyterm.keyterm"},
            "aggs": {
                "publication_dates": {
                    "date_histogram": {
                        "field": "publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd"
                    }
                }
            }

        }};
    var theUrl = JSON.stringify(qs);
    console.log(theUrl);
    return theUrl;
};

var elasticSearchAggQuery8 = function (id) {

    var qs = {};
    qs['query'] = {"terms": {"_id": id}};
    // set any facets
    qs['size'] = 0;
    qs['aggs'] = {"orgs": {"terms": {"field": "organisations.organisationId"},
            "aggs": {"publication_dates": {
                    "date_histogram": {
                        "field": "publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd"
                    }}}

        }};




    var theUrl = JSON.stringify(qs);

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};


var elasticSearchAggQuery9 = function (id) {

    var qs = {};
    qs['query'] = {"terms": {"_id": id}};
    // set any facets
    qs['size'] = 0;
    qs['aggs'] = {"confs": {"terms": {"field": "publication.monograph.conference.title"},
            "aggs": {"publication_dates": {
                    "date_histogram": {
                        "field": "publication.date_printed", "interval": "year",
                        "format": "yyyy-MM-dd"
                    }}}

        }};




    var theUrl = JSON.stringify(qs);

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};