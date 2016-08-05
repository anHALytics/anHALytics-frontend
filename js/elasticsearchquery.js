// build the search query URL based on current params
var elasticSearchQuery = function () {

    var qs = {};
    var bool = false;
    //var nested = false;
    var filtered = false; // true if a filter at least applies to the query
    var queried_fields = []; // list of queried fields for highlights   
    //sorting field
    var datepub = $.fn.facetview.record_metadata.datepub;
    var date = {};
    date[datepub] = {"order": "desc"};

    // fields to be returned
    var textFieldsNPLReturned = new Array();

    for (var key in $.fn.facetview.record_metadata) {
        textFieldsNPLReturned.push($.fn.facetview.record_metadata[key]);
    }

    qs['fields'] = textFieldsNPLReturned;



    // simple query mode	
    $('.facetview_filterselected', obj).each(function () {
        // facet filter for a range of values
        !bool ? bool = {'must': []} : "";
        if ($(this).hasClass('facetview_facetrange')) {
            var rel = options.aggs[ $(this).attr('rel') ]['field'];
            //var from_ = (parseInt( $('.facetview_lowrangeval', this).html() ) - 1970)* 365*24*60*60*1000;
            //var to_ = (parseInt( $('.facetview_highrangeval', this).html() ) - 1970) * 365*24*60*60*1000 - 1;
            var range = $(this).attr('href');
            var ind = range.indexOf('_');
            if (ind != -1) {
                var from_ = range.substring(0, ind);
                var to_ = range.substring(ind + 1, range.length);
                var rngs = {
                    'from': "" + from_,
                    'to': "" + to_
                };
                var obj = {'range': {}};
                obj['range'][ rel ] = rngs;
                bool['must'].push(obj);
                filtered = true;
            }
        } else if (($(this).attr('rel').indexOf("$date") != -1) ||
                ($(this).attr('rel').indexOf("Date") != -1) ||
                ($(this).attr('rel').indexOf("when") != -1)) {
            /// facet filter for a date
            var rel = $(this).attr('rel');
            var obj = {'range': {}};
            var from_ = $(this).attr('href');
            //var to_ = parseInt(from_) + 365*24*60*60*1000 - 1;
            var to_ = parseInt(from_) + 365 * 24 * 60 * 60 * 1000;
            var rngs = {
                'from': from_,
                'to': to_
            };
            obj['range'][ rel ] = rngs;
            bool['must'].push(obj);
            filtered = true;
        } else {
            // other facet filter 
            var obj = {'term': {}};
            obj['term'][ $(this).attr('rel') ] = $(this).attr('href');
            bool['must'].push(obj);
            filtered = true;
        }
    });
    
    
    for (var item in options.predefined_filters) {
        // predefined filters to apply to all search and defined in the options
        !bool ? bool = {'must': []} : "";
        var obj = {'term': {}};
        obj['term'][ item ] = options.predefined_filters[item];
        bool['must'].push(obj);
        filtered = true;
    }
    if (bool) {
        
        // $('#facetview_freetext').val() != ""
        //    ? bool['must'].push( {'query_string': { 'query': $('#facetview_freetext').val() } } )
        //    : "";
        var obj = {'query': {}};
        var obj2 = {'bool': bool};

        /*if (nested) {
         // case nested documents are queried 
         obj['query'] = obj2;
         // when nested documents are for the classes
         obj['path'] = '$teiCorpus.$teiCorpus.$teiHeader.$profileDesc.$textClass';
         // other cases in the future here...
         
         var obj3 = {'nested': obj};
         var obj4 = {'filter': obj3};
         }
         else*/
        {
            // case no nested documents are queried
            obj['query'] = obj2;
            var obj4 = {'filter': obj};
        }

//        if ($('#facetview_freetext').val() == "") {
//            obj4['query'] = {'match_all': {}};
//            qs['sort'] = [date];
//
//        } else {
        //obj4['query'] = {'query_string': {'query': $('#facetview_freetext').val(), 'default_operator': 'AND'}};
        var thenum;
        var obj3 = {'bool': {'should': [],
            'must': [],'must_not': []}};
        var rule;
        var field;
        
        $('#facetview_searchbars').children('.clonedDiv').each(function (i) {
            thenum = $(this).attr("id").match(/\d+/)[0] // "3"
            if ($('#facetview_freetext' + thenum).val() != "") {
                var obj6 = {'query_string': {}};
                rule = $('#selected-bool-field' + thenum).text().trim();
                field = $('#selected-tei-field' + thenum).text().trim();
                if (field == "all fields")
                    obj6['query_string'] = {'default_field': "_all",'query' :$('#facetview_freetext' + thenum).val()};
                else if (field == "title")
                    obj6['query_string'] = {'default_field': record_metadata.title,'query' :$('#facetview_freetext' + thenum).val()};
                else if (field == "abstract")
                    obj6['query_string'] = {'default_field':record_metadata.abstract, 'query':$('#facetview_freetext' + thenum).val()};
                else if (field == "keyword")
                    obj6['query_string'] = {'default_field':record_metadata.keywords, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                else if (field == "author")
                    obj6['query_string'] = {'default_field':record_metadata.author_fullname, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                if (rule == "should") {
                    obj3['bool']['should'].push(obj6);
                } else if (
                        rule = "must") {
                    obj3['bool']['must'].push(obj6);

                } else if (rule = "must_not") {
                    obj3['bool']['must_not'].push(obj6);
                }
                queried_fields.push(obj6['query_string']['default_field']);
                //obj6['match'][ record_metadata.title ] = $('#facetview_freetext' + thenum).val();
                //obj6['match'][ 'default_operator' ] = 'AND';
                //
            }
        });
obj4['query'] = obj3;
        //}
        qs['query'] = {'filtered': obj4};
        //qs['query'] = {'bool': bool}
    } else {
        var thenum;
        var obj3 = {'bool': {'should': [],
            'must': [],'must_not': []}};
        var rule;
        var field;
        $('#facetview_searchbars').children('.clonedDiv').each(function (i) {
            thenum = $(this).attr("id").match(/\d+/)[0] // "3"
            if ($('#facetview_freetext' + thenum).val() != "") {
                var obj6 = {'query_string': {}};
                rule = $('#selected-bool-field' + thenum).text().trim();
                field = $('#selected-tei-field' + thenum).text().trim();
                if (field == "all fields")
                    obj6['query_string'] = {'default_field': "_all",'query' :$('#facetview_freetext' + thenum).val()};
                else if (field == "title")
                    obj6['query_string'] = {'default_field': record_metadata.title,'query' :$('#facetview_freetext' + thenum).val()};
                else if (field == "abstract")
                    obj6['query_string'] = {'default_field':record_metadata.abstract, 'query':$('#facetview_freetext' + thenum).val()};
                else if (field == "keyword")
                    obj6['query_string'] = {'default_field':record_metadata.keywords, 'query': $('#facetview_freetext' + thenum).val()};
                else if (field == "author")
                    obj6['query_string'] = {'default_field':record_metadata.author_fullname, 'query': $('#facetview_freetext' + thenum).val()};
                if (rule == "should") {
                    obj3['bool']['should'].push(obj6);
                } else if (
                        rule = "must") {
                    obj3['bool']['must'].push(obj6);

                } else if (rule = "must_not") {
                    obj3['bool']['must_not'].push(obj6);
                }
                
                queried_fields.push(obj6['query_string']['default_field']);
                //obj6['match'][ record_metadata.title ] = $('#facetview_freetext' + thenum).val();
                //obj6['match'][ 'default_operator' ] = 'AND';
                //
            }
        });
        qs['query'] = obj3;
//        if ($('#facetview_freetext').val() != "") {
//            qs['query'] = {'query_string': {'query': $('#facetview_freetext').val(), 'default_operator': 'AND'}}
//        } else {
//            if (!filtered) {
//                qs['query'] = {'match_all': {}};
//            }
//            qs['sort'] = [date];

        //}
    }

    // set any paging
    options.paging.from != 0 ? qs['from'] = options.paging.from : "";
    options.paging.size != 10 ? qs['size'] = options.paging.size : "";

    // set any facets
    qs['aggs'] = {};
    for (var item in options.aggs) {
        var obj = jQuery.extend(true, {}, options.aggs[item]);
        var nameFacet = obj['display'];
        delete obj['display'];

        if (options.aggs[item]['type'] == 'date') {
            obj['interval'] = "year";
            //obj['size'] = 5; 
            qs['aggs'][nameFacet] = {"date_histogram": obj};
        } else {
            obj['size'] = options.aggs[item]['size'] + 50;
            // this 50 is a magic number due to the following ES bug:
            // https://github.com/elasticsearch/elasticsearch/issues/1305
            // hopefully to be fixed in a near future
            if (options.aggs[item]['order'])
                obj['order'] = options.aggs[item]['order'];
            else
                obj['order'] = { "_count" : "desc" };
            // we need to remove type and view fields since ES 1.2
            
            qs['aggs'][nameFacet] = {"terms": obj};
        }
        delete obj['type'];
            delete obj['view'];
    }
    // set snippets/highlight
//    if (queried_fields.length === 0) {
//        queried_fields.push("_all");
//    }

    qs['highlight'] = {};
    qs['highlight']['fields'] = {};
    
    for (var fie in queried_fields) {
//        if (options['snippet_style'] == 'andlauer') {
//            qs['highlight']['fields'][queried_fields[fie]] = {'fragment_size': 130, 'number_of_fragments': 100};
//        } else {
if(queried_fields[fie] == '_all' || queried_fields[fie] ==record_metadata.abstract){
            qs['highlight']['fields'][queried_fields[fie]] = {'fragment_size': 130, 'number_of_fragments': 3};
        }
        //}
    }
    qs['highlight']['order'] = 'score';
    qs['highlight']['pre_tags'] = ['<strong>'];
    qs['highlight']['post_tags'] = ['</strong>'];
    qs['highlight']['require_field_match'] = true;
    var theUrl = JSON.stringify(qs);

    //if (window.console != undefined) {
    console.log(theUrl);
    //}
    return theUrl;
};