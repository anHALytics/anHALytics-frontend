var record_metadata = {
    id: "_id",
    repositoryDocId: "repositoryDocId",
    title: "$teiCorpus.$teiHeader.$fileDesc.$titleStmt.$title.$title-first",
    titleall: "$teiCorpus.$teiHeader.$fileDesc.$titleStmt.$title.*",
    titleen: "$teiCorpus.$teiHeader.$fileDesc.$titleStmt.$title.$lang_en",
    titlefr: "$teiCorpus.$teiHeader.$fileDesc.$titleStmt.$title.$lang_fr",
    titlede: "$teiCorpus.$teiHeader.$fileDesc.$titleStmt.$title.$lang_de",
    titleid: "$teiCorpus.$teiHeader.$fileDesc.$titleStmt.xml:id",
    datepub: "$teiCorpus.$teiHeader.$fileDesc.$sourceDesc.$biblStruct.$monogr.$imprint.$date.$type_datePub",
    monogr_title: "$teiCorpus.$teiHeader.$fileDesc.$sourceDesc.$biblStruct.$monogr.$title.$title-first",
    author_fullname: "$teiCorpus.$teiHeader.$fileDesc.$sourceDesc.$biblStruct.$analytic.$author.$persName.$fullName.analyzed",
    doi: "$teiCorpus.$teiHeader.$fileDesc.$sourceDesc.$biblStruct.$analytic.$idno.$type_doi",
    anhalyticsid: "$teiCorpus.$teiHeader.$fileDesc.$sourceDesc.$biblStruct.$analytic.$author.$idno.$type_anhalyticsID",
};

// build the search query URL based on current params
var elasticSearchSearchQuery = function () {

    var qs = {};
    var bool = false;
    //var nested = false;
    var filtered = false; // true if a filter at least applies to the query
    var queried_fields = []; // list of queried fields for highlights   
    //sorting field
    var datepub = record_metadata.datepub;
    var date = {};
    date[datepub] = {"order": "desc"};

    // fields to be returned
    var textFieldsNPLReturned = new Array();

    for (var key in record_metadata) {
        textFieldsNPLReturned.push(record_metadata[key]);
    }

    qs['stored_fields'] = textFieldsNPLReturned;
    var quantitiesClauses = [];

    // simple query mode	
    $('.facetview_filterselected', obj).each(function () {
        // facet filter for a range of values
        !bool ? bool = {'must': []} : "";
        if ($(this).hasClass('quantitiesrange')) { 
            // prepare the quantity query
            var rel = $(this).attr('rel');
            var from_ = $(this).attr('from');
            var to_ = $(this).attr('to');
            //var value = $(this).attr('value');
            if(from_ || to_){
                var rngs = {
                    'gte': "" + from_,
                    'lte': "" + to_,
                    'relation': 'intersects'
                };
                var objjrng = {};
                objjrng['$teiCorpus.$standoff.$quantities.' + rel] = rngs;
                var obj2 = {}
                obj2['range'] = objjrng;
                quantitiesClauses.push(obj2);
            }
            else if(value){
                var objjvalue = {};
                objjvalue['$teiCorpus.$standoff.$quantities.' + rel] = value;
                var obj1 = {};
                
                obj1['match'] = objjvalue;
                
                quantitiesClauses.push(obj1);
            }
        } else if ($(this).hasClass('facetview_facetrange')) {
            var rel = options.aggs[ $(this).attr('rel') ]['field'];
            //var from_ = (parseInt( $('.facetview_lowrangeval', this).html() ) - 1970)* 365*24*60*60*1000;
            //var to_ = (parseInt( $('.facetview_highrangeval', this).html() ) - 1970) * 365*24*60*60*1000 - 1;
            var range = $(this).attr('href');
            var ind = range.indexOf('_');
            if (ind != -1) {
                var from_ = range.substring(0, ind);
                var to_ = range.substring(ind + 1, range.length);
                var rngs = {
                    'gte': "" + from_,
                    'lte': "" + to_
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

console.log(quantitiesClauses);

    for (var item in options.predefined_filters) {
        // predefined filters to apply to all search and defined in the options
        !bool ? bool = {'must': []} : "";
        var obj = {'term': {}};
        obj['term'][ item ] = options.predefined_filters[item];
        bool['must'].push(obj);
        filtered = true;
    }

    if (bool) {
        //var obj = {'query': {}};
        var obj2 = {'bool': bool};

        // case no nested documents are queried
        //obj['query'] = obj2;
        var obj4 = {'filter': obj2};
        //}

        if ($('#facetview_freetext1').val() == "") {
            if (quantitiesClauses.length == 0)
                obj4['must'] = {'match_all': {}};
            else {
                obj4['must']= [];
                for(var i in quantitiesClauses) {
                    obj4['must'].push(quantitiesClauses[i]);
                }
            } 
            qs['sort'] = [date];
        } else {
            //obj4['query'] = {'query_string': {'query': $('#facetview_freetext').val(), 'default_operator': 'AND'}};
            var thenum;
            /*var obj3 = {'bool': {'should': [],
                    'must': [], 'must_not': []}};*/
            var rule;
            var field;

            $('#facetview_searchbars').children('.clonedDiv').each(function (i) {
                thenum = $(this).attr("id").match(/\d+/)[0] // "3"
                if ($('#facetview_freetext' + thenum).val() != "") {
                    var obj6 = {'query_string': {}};
                    rule = $('#selected-bool-field' + thenum).text().trim();
                    field = $('#selected-tei-field' + thenum).text().trim();
                    if (field == "all fields")
                        obj6['query_string'] = {'default_field': "_all", 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    else if (field == "title")
                        obj6['query_string'] = {'default_field': record_metadata.title, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    else if (field == "abstract")
                        obj6['query_string'] = {'default_field': abstract_metadata.abstract_en, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    else if (field == "keyword")
                        obj6['query_string'] = {'default_field': abstract_metadata.keywords, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    else if (field == "author")
                        obj6['query_string'] = {'default_field': record_metadata.author_fullname, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    if (rule === "should") {
                        //obj3['bool']['should'].push(obj6);
                        if (!obj4['should'])
                            obj4['should'] = [];
                        obj4['should'].push(obj6);
                    } else if (rule === "must") {
                        if (!obj4['must'])
                            obj4['must'] = [];
                        //obj3['bool']['must'].push(obj6);
                        obj4['must'].push(obj6);
                    } else if (rule === "must_not") {
                        if (!obj4['must_not'])
                            obj4['must_not'] = [];
                        //obj3['bool']['must_not'].push(obj6);
                        obj4['must_not'].push(obj6);
                    }
                    queried_fields.push(obj6['query_string']['default_field']);
                    
                    //obj6['match'][ record_metadata.title ] = $('#facetview_freetext' + thenum).val();
                    //obj6['match'][ 'default_operator' ] = 'AND';
                    //
                }
            });
            //obj4['query'] = obj3;
            if (quantitiesClauses.length > 0) {
                for(var i in quantitiesClauses) {
                    obj4['must'].push(quantitiesClauses[i]);
                }
            }
        }
        qs['query'] = {'bool': obj4};
    } else {
        var thenum;
        var obj3 = {'bool': {'should': [],
                'must': [], 'must_not': []}};
        var rule;
        var field;
        var lang;
        var allEmpty = true;
        $('#facetview_searchbars').children('.clonedDiv').each(function (i) {
            thenum = $(this).attr("id").match(/\d+/)[0] // "3"
            if ($('#facetview_freetext' + thenum).val() != "") {
                allEmpty = false;
                var obj6 = {'query_string': {}};
                rule = $('#selected-bool-field' + thenum).text().trim();
                field = $('#selected-tei-field' + thenum).text().trim();
                lang = $('#selected-lang-field' + thenum).text().trim();
                if (field == "all fields")
                    obj6['query_string'] = {'default_field': "_all", 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                else if (field == "title"){
                    if (lang == "all lang"){
                        obj6['query_string'] = {'fields': [record_metadata.titleall], 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                }else if (lang == "en")
                        obj6['query_string'] = {'default_field': record_metadata.titleen, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    else if (lang == "fr")
                        obj6['query_string'] = {'default_field': record_metadata.titlefr, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    else if (lang == "de")
                        obj6['query_string'] = {'default_field': record_metadata.titlede, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};

                } else if (field == "abstract"){
                        if (lang == "all lang")
                        obj6['query_string'] = {'fields': [abstract_metadata.abstract], 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                else if (lang == "en")
                        obj6['query_string'] = {'default_field': abstract_metadata.abstract_en, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    else if (lang == "fr")
                        obj6['query_string'] = {'default_field': abstract_metadata.abstract_fr, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    if (lang == "de")
                        obj6['query_string'] = {'default_field': abstract_metadata.abstract_de, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                } else if (field == "keyword")
                        obj6['query_string'] = {'default_field': abstract_metadata.keywords, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                    else if (field == "author")
                        obj6['query_string'] = {'default_field': record_metadata.author_fullname, 'query': $('#facetview_freetext' + thenum).val(), 'default_operator': 'AND'};
                if (rule == "should") {
                    obj3['bool']['should'].push(obj6);
                } else if (rule == "must") {
                    obj3['bool']['must'].push(obj6);
                } else if (rule == "must_not") {
                    obj3['bool']['must_not'].push(obj6);
                }

                if(obj6['query_string']['default_field'])
                    queried_fields.push(obj6['query_string']['default_field']);
                else if(obj6['query_string']['fields']) {
                    for (var item in obj6['query_string']['fields']) {
                        queried_fields.push(obj6['query_string']['fields'][item]);
                    }
                }
                //obj6['match'][ record_metadata.title ] = $('#facetview_freetext' + thenum).val();
                //obj6['match'][ 'default_operator' ] = 'AND';
                //
            }
        });
        qs['query'] = obj3;
        if (allEmpty) {
            if (!filtered) {
                qs['query'] = {'match_all': {}};
            }
            qs['sort'] = [date];
        }
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
                obj['order'] = {"_count": "desc"};
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
        if (queried_fields[fie] == '_all' || (queried_fields[fie] != abstract_metadata.keywords && queried_fields[fie] != record_metadata.author_fullname) ) {
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