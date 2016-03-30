// given a result record, build how it should look on the page
var buildrecord = function (index, node) {
    var record = options.data['records'][index];
    var highlight = options.data['highlights'][index];
    //var score = options.data['scores'][index];

    var result = '';

    var jsonObject = eval(record);
    result += '<tr style="border-collapse:collapse;"><td>';

    result += '<div class="row">';

    var type = null;
    var id = options.data['ids'][index];


    result += '<div class="col-md-2">';
    // add image where available
    var repositoryDocId;
    repositoryDocId = jsonObject['repositoryDocId'];

    if (options.display_images) {

        if (options.subcollection == "hal") {

            result += '<strong> <a href="https://hal.archives-ouvertes.fr/'
                    + repositoryDocId + '" target="_blank" style="color: #0094DE;text-decoration:underline;" alt="see resource on HAL">' + repositoryDocId + '</a></strong>\
<a class="fa fa-file-pdf-o" href="https://hal.archives-ouvertes.fr/' + repositoryDocId +
                    '/document" target="_blank"><img class="img-thumbnail img-responsive" style="float:right; width: 70px" src="' +
                    'https://hal.archives-ouvertes.fr/' + repositoryDocId + '/thumb' + '" /></a>';
        }
    }
    result += '</div>';

    result += '<div class="col-md-10" class="height:100%;" id="myCollapsible_' + index + '" style="white-space:normal;">';


    // date
    var date;
    var dates = null;
    dates = jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$date'];
    if (!dates) {
        dates = jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$when'];
    }
    if (!dates) {
        dates = jsonObject['$teiCorpus.$teiHeader.$editionStmt.$edition.$date'];
    }

    var title;
    var titles = null;
    var titleID = null;
    var titleIDs = null;
    var titleAnnotated = null;

    // NPL
    titles = jsonObject['$teiCorpus.$teiHeader.$titleStmt.$title.$title-first'];
    titleIDs = jsonObject['$teiCorpus.$teiHeader.$titleStmt.xml:id'];

    if (typeof titles == 'string') {
        title = titles;
    }
    else {
        if (titles) {
            title = titles[0];
            while ((typeof title != 'string') && (typeof title != 'undefined')) {
                title = title[0];
            }
        }
    }
    if (typeof titleIDs == 'string') {
        titleID = titleIDs;
    }
    else {
        if (titleIDs) {
            titleID = titleIDs[0];
            while ((typeof title != 'string') && (typeof title != 'undefined')) {
                titleID = titleID[0];
            }
        }
    }

    if (!title || (title.length === 0)) {

        titles = jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$title.$lang_en'];

        if (typeof titles == 'string') {
            title = titles;
        }
        else {
            if (titles) {
                title = titles[0];
                while ((typeof title != 'string') && (typeof title != 'undefined')) {
                    title = title[0];
                }
            }
        }
    }

    if (!title || (title.length === 0)) {

        titles = jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$title.$lang_fr'];

        if (typeof titles == 'string') {
            title = titles;
        }
        else {
            if (titles) {
                title = titles[0];
                while ((typeof title != 'string') && (typeof title != 'undefined')) {
                    title = title[0];
                }
            }
        }
    }

    if (!title || (title.length === 0)) {

        titles = jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$title.$lang_de'];

        if (typeof titles == 'string') {
            title = titles;
        }
        else {
            if (titles) {
                title = titles[0];
                while ((typeof title != 'string') && (typeof title != 'undefined')) {
                    title = title[0];
                }
            }
        }
    }

    if (title && (title.length > 1) && !titleAnnotated) {
        if (options['collection'] == 'npl') {
            var docid = id;
            if (options.subcollection == "hal") {


                // document type
                var type =
                        jsonObject['$teiCorpus.$teiHeader.$profileDesc.$textClass.$classCode.$scheme_halTypology'];
                if (type) {
                    result += '<p><a href="publication.html?pubID='+id+'"><span class="label pubtype" style="white-space:normal;">' + type + '</span></a></p>';
                    //piece += '<p><strong>' + type + '</strong></p>';
                }
            }
            result += ' <strong><a target="_blank" href="publication.html?pubID='+id+'"><span class="titleNaked" pos="' + index+'" ';
            if (titleID) {
                result += 'rel="' + titleID + '" ';
            }
            result += ' style="font-size:13px; color:black; white-space:normal;">' + title + '</span></a></strong>';



        }
        else {
            result += '<strong><span style="font-size:13px">' + title + '</span></strong>';

        }
    }

    result += '<br />';


    result += '<strong style="font-size:11px">';
    var authorsLast = null;
    var authorsFirst = null;

    authorsLast = jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$author.$persName.$surname'];
    var tempStr = "" + authorsLast;
    authorsLast = tempStr.split(",");
    authorsFirst = jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$author.$persName.$forename'];
    tempStr = "" + authorsFirst;
    authorsFirst = tempStr.split(",");

    if (authorsLast.length < 4) {
        for (var author in authorsLast) {
            if (author === 0) {
                if (authorsFirst.length > 0) {
                    result += authorsFirst[0][0] + ". ";
                }
                result += authorsLast[0];
            }
            else {
                result += ", ";
                if (authorsFirst.length > author) {
                    result += authorsFirst[author][0] + ". ";
                }
                result += authorsLast[author];
            }
        }
    }
    else {
        if (authorsFirst.length > 0) {
            result += authorsFirst[0][0] + ". ";
        }
        result += authorsLast[0] + ' et al.';
    }

    // book, proceedings or journal title
    var titleBook = null;
    var titlesBook = null;
    //if (options['collection'] == 'npl') {
    titlesBook = jsonObject["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$title.$title-first"];
    var titleBookTmp = null;
    if (typeof titlesBook == 'string') {
        titleBook = titlesBook;
    }
    else {
        titleBook = titlesBook;
        while ((typeof titleBook != 'string') && (typeof titleBook != 'undefined')) {
            titleBookTmp = titleBook[0];
            if (typeof titleBookTmp != 'undefined') {
                titleBook = titleBookTmp;
            }
            else {
                for (var x in titleBook) {
                    titleBookTmp = titleBook[x];
                }
                if (titleBookTmp)
                    titleBook = titleBookTmp[0];
                else
                    titleBook = null;
                break;
            }

        }
    }
    //}
    if (titleBook && (titleBook.length > 1)) {
        result += ' - <em>' + titleBook + '</em>';
    }

    var rawDate = JSON.stringify(dates);
    if (rawDate != null) {
        var ind1 = rawDate.indexOf('"');
        var ind2 = rawDate.indexOf('"', ind1 + 1);
        date = rawDate.substring(ind1, ind2 + 1);

        if (date && (date.length > 1)) {
            var year = date.substring(1, 5);
            var month = null;
            if (date.length > 6)
                month = date.substring(6, 8);
            if ((month) && (month.length > 1) && (month[0] == "0")) {
                month = month.substring(1, month.length)
            }
            var day = null;
            if (date.length > 9)
                day = date.substring(9, date.length - 1);
            if ((day != undefined) && (day.length > 1) && (day[0] == "0")) {
                day = day.substring(1, day.length)
            }
            result += ' - <em>';
            if ((day != undefined) && (day.length > 0))
                result += day + '.';
            if ((month != undefined) && (month.length > 0))
                result += month + '.';
            if (year != undefined)
                result += year + '</em>' + '<br />';
        }
    }

    var doi = null;
    doi = jsonObject["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$idno.$type_doi"];
    if (doi) {
        doi = doi[0];
        result += " <br />DOI: <a target='_blank' style='color: #0094DE;' href='http://dx.doi.org/" + doi + "'>" + doi + "</a><br/>";
    }
    result += '</strong>';
    // snippets 
    // Dominique Andlauer's strategy (sort of Google's one), at least one snippet per matched term, then 
    // per relevance, first we check the number of different matched terms
    if (options.snippet_style == "andlauer") {
        if (highlight) {
            var jsonObject2 = eval(highlight);
            var newSnippets = [];
            // we first list all term stems found in the full list of snippets
            var activeTerms = [];
            for (var n in jsonObject2) {
                var snippets = jsonObject2[n];
                for (var i = 0; i < snippets.length; i++) {
                    var indd = 0;
                    while (indd < snippets[i].length) {
                        var inddd = snippets[i].indexOf("<strong>", indd);
                        if (inddd != -1) {
                            var inddd2 = snippets[i].indexOf("</strong>", inddd);
                            if (inddd2 != -1) {
                                var term = stemmer(snippets[i].substring(inddd + 8, inddd2).toLowerCase());
                                if (activeTerms.length == 0) {
                                    activeTerms.push(term);
                                }
                                else {
                                    var present = false;
                                    for (var k in activeTerms) {
                                        if (activeTerms[k] == term) {
                                            present = true;
                                            break;
                                        }
                                    }
                                    if (!present) {
                                        activeTerms.push(term);
                                    }
                                }
                                indd = inddd2 + 1;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            break;
                            //indd = snippets[i].length;
                        }
                    }
                }
            }

            // we then re-rank to have all the terms present in the highest ranked snippets
            var passiveTerms = [];
            var localTerms = [];
            var remainingSnippets = [];
            for (var n in jsonObject2) {
                var snippets = jsonObject2[n];
                for (var i = 0; i < snippets.length; i++) {
                    if (passiveTerms.length == activeTerms.length) {
                        remainingSnippets.push(snippets[i]);
                    }
                    var indd = 0;
                    while (indd < snippets[i].length) {
                        var inddd = snippets[i].indexOf("<strong>", indd);
                        if (inddd != -1) {
                            var inddd2 = snippets[i].indexOf("</strong>", inddd);
                            if (inddd2 != -1) {
                                var term = stemmer(snippets[i].substring(inddd + 8, inddd2).toLowerCase());
                                if (localTerms.length == 0) {
                                    localTerms.push(term);
                                }
                                else {
                                    var present = false;
                                    for (var k in activeTerms) {
                                        if (localTerms[k] == term) {
                                            present = true;
                                            break;
                                        }
                                    }
                                    if (!present)
                                        localTerms.push(term);
                                }
                                indd = inddd2 + 1;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    // shall we include snippets[i] as next snippet?
                    if (passiveTerms.length == 0) {
                        newSnippets.push(snippets[i]);
                        for (var dumm in localTerms) {
                            passiveTerms.push(localTerms[dumm])
                        }
                    }
                    else {
                        var previousState = passiveTerms.length;
                        for (var dumm in localTerms) {
                            var present = false;
                            for (var k in passiveTerms) {
                                if (passiveTerms[k] == localTerms[dumm]) {
                                    present = true;
                                    break;
                                }
                            }

                            if (!present) {
                                newSnippets.push(snippets[i]);
                                for (var dumm2 in localTerms) {
                                    passiveTerms.push(localTerms[dumm2])
                                }
                            }
                        }
                        /*if (previousState == passiveTerms.length) {
                         // no new term
                         remainingSnippets.push(snippets[i]);
                         }*/
                    }
                }
            }
            // we complete the new snippet
            for (var dumm in remainingSnippets) {
                newSnippets.push(remainingSnippets[dumm]);
            }

            // we have the new snippets and can output them
            var totalDisplayed = 0;
            for (var dumm in newSnippets) {
                if (newSnippets[dumm].length > 200) {
                    // we have an issue with the snippet boundaries
                    var indd = newSnippets[dumm].indexOf("<strong>");
                    var max = indd + 100;
                    if (max > newSnippets[dumm].length) {
                        max = newSnippets[dumm].length;
                    }
                    result += '...<span style="font-size:12px"><em>' + newSnippets[dumm].substring(indd, max) + '</em></span>...<br />';
                }
                else {
                    result += '...<span style="font-size:12px"><em>' + newSnippets[dumm] + '</em></span>...<br />';
                }
                totalDisplayed++;
                if (totalDisplayed == 3) {
                    break;
                }
            }
        }
    }
    else {
        // here default strategy, snippet ranking per relevance
        if (highlight) {
            var jsonObject2 = eval(highlight);
            //var snippets = jsonObject2['_all'];
            //console.log(snippets);
            var totalDisplayed = 0;
            for (var n in jsonObject2) {
                var snippets = jsonObject2[n];
                for (var i = 0; i < snippets.length; i++) {
                    if (snippets[i].length > 200) {
                        // we have an issue with the snippet boundaries
                        var indd = snippets[i].indexOf("<strong>");
                        var max = indd + 100;
                        if (max > snippets[i].length) {
                            max = snippets[i].length;
                        }
                        result += '...<span style="font-size:12px"><em>' + snippets[i].substring(indd, max) + '</em></span>...<br />';
                    }
                    else {
                        result += '...<span style="font-size:12px"><em>' + snippets[i] + '</em></span>...<br />';
                    }
                    totalDisplayed++;
                    if (totalDisplayed == 3) {
                        break;
                    }
                }
                if (totalDisplayed == 3) {
                    break;
                }
            }
        }
    }
    

    //result += '</tr></table>';
    


    result += '<div id="myGroup">';

    var names =
            jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$author.$persName.$fullName'];

 
    result += '<div class="panel">';
    result += '<br/><a id="button_abs_collapse_' + index + '" role="button" data-parent="#myGroup" data-toggle="collapse" href="#abstract_' + index + '" style="color: #0094DE;"><span class="glyphicon glyphicon-chevron-down"></span>Abstract</a>';

    result += '<span style="display:inline-block; width: 250px;"></span>';
    result += '<a id="button_authors_collapse_' + index + '" role="button" data-parent="#myGroup" data-toggle="collapse" href="#authors_' + index + '" style="color: #0094DE;"><span class="glyphicon glyphicon-chevron-down"></span>Authors (' + names.length + ')</a>';
    result += '<span style="display:inline-block; width: 250px;"></span>';
    result += '<a id="button_keywords_collapse_' + index + '" role="button" data-parent="#myGroup" data-toggle="collapse" href="#keywords_' + index + '" style="color: #0094DE;"><span class="glyphicon glyphicon-chevron-down"></span>Keywords</a>';



    {
        var piece = "";
        piece += '<div id="abstract_' + index +
                '" class="row collapse " pos="' + index + '" rel="' + id + '"';
        if (index % 2) {
            piece += 'style="background-color:#f8f8f8; padding-right:0px;">';
        }
        else {
            piece += 'style="background-color:#ffffff;">';
        }
        piece += '<div class="col-md-12">';
        // abstract, if any
        var abstract = null;

        var abstractID = null;
        var abstractIDs = jsonObject['$teiCorpus.$teiHeader.$profileDesc.xml:id'];
        if (typeof abstractIDs == 'string') {
            abstractID = abstractIDs;
        }
        else {
            if (abstractIDs && (abstractIDs.length > 0)) {
                abstractID = abstractIDs[0];
                while ((typeof abstractID != 'string') && (typeof abstractID != 'undefined')) {
                    abstractID = abstractID[0];
                }
            }
        }

        var abstracts = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_en'];
        if (typeof abstracts == 'string') {
            abstract = abstracts;
        }
        else {
            if (abstracts && (abstracts.length > 0)) {
                abstract = abstracts[0];
                while ((typeof abstract != 'string') && (typeof abstract != 'undefined')) {
                    abstract = abstract[0];
                }
            }
        }

        if (!abstract || (abstract.length == 0)) {
            abstracts = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_fr'];

            if (typeof abstracts == 'string') {
                abstract = abstracts;
            }
            else {
                if (abstracts && (abstracts.length > 0)) {
                    abstract = abstracts[0];
                    while ((typeof abstract != 'string') && (typeof abstract != 'undefined')) {
                        abstract = abstract[0];
                    }
                }
            }
        }

        if (!abstract || (abstract.length == 0)) {
            abstracts = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_de'];

            if (typeof abstracts == 'string') {
                abstract = abstracts;
            }
            else {
                if (abstracts && (abstracts.length > 0)) {
                    abstract = abstracts[0];
                    while ((typeof abstract != 'string') && (typeof abstract != 'undefined')) {
                        abstract = abstract[0];
                    }
                }
            }
        }

        if (!abstract || (abstract.length == 0)) {
            abstracts = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_es'];

            if (typeof abstracts == 'string') {
                abstract = abstracts;
            }
            else {
                if (abstracts && (abstracts.length > 0)) {
                    abstract = abstracts[0];
                    while ((typeof abstract != 'string') && (typeof abstract != 'undefined')) {
                        abstract = abstract[0];
                    }
                }
            }
        }

        if (abstract && (abstract.length > 0) && (abstract.trim().indexOf(" ") != -1)) {
            piece += '<p id="abstractNaked" class="well" pos="' + index + '" rel="' + abstractID + '" >' + abstract + '</p>';
        }
        piece += '</div>';
        piece += '</div>';
    }
    result += piece;


    {
        var piece = "";
        piece += '<div id="authors_' + index +
                '" class="collapse" pos="' + index + '" rel="' + id + '"';
        if (index % 2) {
            piece += 'style="background-color:#f8f8f8; padding-right:0px;">';
        }
        else {
            piece += 'style="background-color:#ffffff;">';
        }

        piece += '<div class="col-md-12">';

        // authors and affiliation


        if (names) {
            var ids = jsonObject['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$author.$idno.$type_anhalyticsID'];
            piece += '<div class="well row">';
            for (var aut in names) {
                var id_ = ids[aut];
                var name_ = names[aut];
                piece += '<div class="col-md-3"><a target="_blank" href="profile.html?authorID=' + id_ + '" >' + name_ + '</a></div>';
            }
            piece += '</div>';
        }

        piece += '</div>';
        piece += '</div>';
    }
    result += piece;


    {

        var piece = "";
        piece += '<div id="keywords_' + index +
                '" class="row collapse" pos="' + index + '" rel="' + id + '"';
        if (index % 2) {
            piece += 'style="background-color:#f8f8f8; padding-right:0px;">';
        }
        else {
            piece += 'style="background-color:#ffffff;">';
        }

        piece += '<div class="col-md-8">';
        // keywords
        var keyword = null;
        var keywordIDs =
                jsonObject['$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.xml:id'];
        // we have a list of keyword IDs, each one corresponding to an independent annotation set
        var keywords =
                jsonObject['$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.$term'];

        if (typeof keywords == 'string') {
            keyword = keywords;
        }
        else {
            var keyArray = keywords;
            if (keyArray  && keywordIDs) {
                for (var p in keyArray) {
                    var keywordID = keywordIDs[p];
                    if (p == 0) {
                        keyword = '<span id="keywordsNaked"  pos="' + index + '" rel="' + keywordID + '">'
                                + keyArray[p] + '</span>';
                    }
                    else {
                        keyword += ', ' + '<span id="keywordsNaked"  pos="' + index + '" rel="' + keywordID + '">' +
                                keyArray[p] + '</span>';
                    }
                }
            }
        }

        if (keyword && (keyword.length > 0) && (keyword.trim().indexOf(" ") != -1)) {
            piece += ' <p class="well"><strong>Keywords: </strong> ' + keyword + '</p>';
        }

        piece += '</div>';

        // info box for the entities
        piece += '<div class="annotation_info">';
        piece += '<span  id="detailed_annot-' + index + '" />';
        piece += "</div>";

        piece += "</div>";

    }
    result += piece;
    result += '</div>';
    result += '</div>';
    result += '</div>';
result += '</div>';
    result += '</td></tr>';

    node.append(result);

    //we load now in background the additional record information requiring a user interaction for
    // visualisation
    $('.titleNaked', obj).each(function () {
        if (options.collection == "npl") {
            // annotations for the title
            var index = $(this).attr('pos');
            var titleID = $(this).attr('rel');
            var localQuery = {"query": {"filtered": {"query": {"term": {"_id": titleID}}}}};

            $.ajax({
                type: "get",
                url: options.search_url_annotations,
                contentType: 'application/json',
                dataType: 'jsonp',
                data: {source: JSON.stringify(localQuery)},
                success: function (data) {
                    displayAnnotations(data, index, titleID, 'title');
                }
            });
        }
    });
    $('#abstractNaked[rel="' + abstractID + '"]', obj).each(function () {
        // annotations for the abstract
        var index = $(this).attr('pos');
        var titleID = $(this).attr('rel');
        var localQuery = {"query": {"filtered": {"query": {"term": {"_id": abstractID}}}}};

        $.ajax({
            type: "get",
            url: options.search_url_annotations,
            contentType: 'application/json',
            dataType: 'jsonp',
            data: {source: JSON.stringify(localQuery)},
            success: function (data) {
                displayAnnotations(data, index, abstractID, 'abstract');
            }
        });
    });

    for (var p in keywordIDs) {
        $('#keywordsNaked[rel="' + keywordIDs[p] + '"]', obj).each(function () {
            // annotations for the keywords
            var index = $(this).attr('pos');
            var keywordID = $(this).attr('rel');
            var localQuery = {"query": {"filtered": {"query": {"term": {"_id": keywordID}}}}};

            $.ajax({
                type: "get",
                url: options.search_url_annotations,
                contentType: 'application/json',
                dataType: 'jsonp',
                data: {source: JSON.stringify(localQuery)},
                success: function (data) {
                    displayAnnotations(data, index, keywordID, 'keyword');
                }
            });
        });
    }
};