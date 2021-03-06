var abstract_metadata = {
    the_id: "$teiCorpus.$teiHeader.$profileDesc.$abstract.xml:id",
    repositoryDocId: "repositoryDocId",
    abstract: "$teiCorpus.$teiHeader.$profileDesc.$abstract.*",
    abstract_en: "$teiCorpus.$teiHeader.$profileDesc.$abstract.$p.$lang_en",
    abstract_fr: "$teiCorpus.$teiHeader.$profileDesc.$abstract.$p.$lang_fr",
    abstract_de: "$teiCorpus.$teiHeader.$profileDesc.$abstract.$p.$lang_de",
    typology: "$teiCorpus.$teiHeader.$profileDesc.$textClass.$classCode.$scheme_typology", // should be call in background
    keywordsid: "$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.xml:id", // should be call in background
    keywords: "$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.$term.analyzed" // should be call in background
};

// given a result record, build how it should look on the page
var buildrecord = function (index, node) {
    var record = options.data['records'][index];
    var highlight = options.data['highlights'][index];
    //var score = options.data['scores'][index];

    var result = '';

    var jsonObject = eval(record);
    result += '<tr style="border:1px solid #ccc;"><td style="border-top:1px solid #ccc;">';

    result += '<div class="row">';

    var type = null;
    var id = options.data['ids'][index];

    result += '<div class="col-md-2" style="padding-right:0px;">';
    // add image where available
    var repositoryDocId = jsonObject[record_metadata.repositoryDocId];

    if (options.display_images) {

        if (options.subcollection == "hal") {
            // try to avoid resizing when possible - useless in this case, and fix height
            // to avoid all records moving while images are downloaded
            result += '<a id="pdf'+index+'" class="fa fa-file-pdf-o fa-5x" rel="'+id+'" href="https://hal.archives-ouvertes.fr/' + repositoryDocId +
                    '/document" target="_blank" style="color:firebrick;"></a>';
        }if (options.subcollection == "istex") {
            result += '<a id="pdf'+index+'" class="fa fa-file-pdf-o fa-5x" rel="'+id+'" href="https://api.istex.fr/document/' + repositoryDocId +
                    '/fulltext/pdf" target="_blank" style="color:firebrick;"></a>';

        }
    }
    result += '</div>';

    result += '<div class="col-md-10" class="height:100%;" id="myCollapsible_' + index + '" style="white-space:normal;left:-10px;">';


    // date
    var date;
    var dates = null;
    dates = jsonObject[record_metadata.datepub];

    var title;
    var titles = null;
    var titleID = null;
    var titleIDs = null;
    var titleAnnotated = null;

    // NPL
    titles = jsonObject[record_metadata.title];
    titleIDs = jsonObject[record_metadata.titleid];

    if (typeof titles == 'string') {
        title = titles;
    } else {
        if (titles) {
            title = titles[0];
            while ((typeof title != 'string') && (typeof title != 'undefined')) {
                title = title[0];
            }
        }
    }
    if (typeof titleIDs == 'string') {
        titleID = titleIDs;
    } else {
        if (titleIDs) {
            titleID = titleIDs[0];
            while ((typeof title != 'string') && (typeof title != 'undefined')) {
                titleID = titleID[0];
            }
        }
    }
    /*
     if (!title || (title.length === 0)) {

     titles = jsonObject[record_metadata.titleen];

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

     titles = jsonObject[record_metadata.titlefr];

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

     titles = jsonObject[record_metadata.titlede];

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
     */
    if (title && (title.length > 1) && !titleAnnotated) {
        if (options['collection'] == 'npl') {
            var docid = id;
            result += ' <div class="row" style="margin-bottom: 10px"><strong><span id="titleNaked" pos="' + index + '" ';
            if (titleID) {
                result += 'rel="' + titleID + '" ';
            }
            result += ' style="font-size:13px; color:black; white-space:normal;">' + title + '</span></strong></div>';



        } else {
            result += '<strong><span style="font-size:13px">' + title + '</span></strong>';

        }
    }


    result += '<div class="row " style="margin-bottom: 10px" ><strong style="font-size:11px">';
//    var authorsLast = null;
//    var authorsFirst = null;
//
//    authorsLast = jsonObject[record_metadata.author_surname];
//    var tempStr = "" + authorsLast;
//    authorsLast = tempStr.split(",");
//    authorsFirst = jsonObject[record_metadata.author_forename];
//    tempStr = "" + authorsFirst;
//    authorsFirst = tempStr.split(",");
//
//    if (authorsLast.length < 4) {
//        for (var author in authorsLast) {
//            if (author === 0) {
//                if (authorsFirst.length > 0) {
//                    result += authorsFirst[0][0] + ". ";
//                }
//                result += authorsLast[0];
//            } else {
//                if (authorsFirst.length > author) {
//                    result += authorsFirst[author][0] + ". ";
//                }
//                result += authorsLast[author];
//
//                if (author < authorsLast.length - 1)
//                    result += ", ";
//            }
//        }
//    } else {
//        if (authorsFirst.length > 0) {
//            result += authorsFirst[0][0] + ". ";
//        }
//        result += authorsLast[0] + ' et al.';
//    }

    var names =
            jsonObject[record_metadata.author_fullname];
    if (names) {
        var ids = jsonObject[record_metadata.anhalyticsid];
        for (var aut in names) {
            if (ids)
                var id_ = ids[aut];
            var name_ = "";
            if (aut == names.length - 1)
                name_ = names[aut];
            else
                name_ = names[aut] + ', ';
            result += '<a target="_blank" style="color:#D42C2C" href="profile.html?authorID=' + id_ + '" >' + name_ + '</a>';
        }
    }

    // book, proceedings or journal title
    var titleBook = null;
    var titlesBook = null;
    //if (options['collection'] == 'npl') {
    titlesBook = jsonObject[record_metadata.monogr_title];
    var titleBookTmp = null;
    if (typeof titlesBook == 'string') {
        titleBook = titlesBook;
    } else {
        titleBook = titlesBook;
        while ((typeof titleBook != 'string') && (typeof titleBook != 'undefined')) {
            titleBookTmp = titleBook[0];
            if (typeof titleBookTmp != 'undefined') {
                titleBook = titleBookTmp;
            } else {
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

    var publisher = jsonObject[record_metadata.publisher];
    if (publisher && (typeof publisher != 'string')) {
        result += ' - <em>' + publisher[0] + '</em>';
    }


    var unit_volume = jsonObject[record_metadata.unit_volume];
    if (unit_volume && (typeof unit_volume != 'string')) {
        result += ' - volume : ' + unit_volume;
    }

    var unit_issue = jsonObject[record_metadata.unit_issue];
    if (unit_issue && (typeof unit_issue != 'string')) {
        result += ' - issue : ' + unit_issue;
    }

    var page;
    var unit_pages = jsonObject[record_metadata.unit_page];
    if (unit_pages && (typeof unit_pages != 'string')) {
        result += ' - pages : ' + unit_pages[0] + " - " + unit_pages[1];
    }


    var rawDate = JSON.stringify(dates);
    if (rawDate != null) {
        var ind1 = rawDate.indexOf('"');
        var ind2 = rawDate.indexOf('"', ind1 + 1);
        date = rawDate.substring(ind1, ind2 + 1);

        if (date && (date.length > 1)) {
            var year = date.substring(1, 5);
//            var month = null;
//            if (date.length > 6)
//                month = date.substring(6, 8);
//            if ((month) && (month.length > 1) && (month[0] == "0")) {
//                month = month.substring(1, month.length)
//            }
//            var day = null;
//            if (date.length > 9)
//                day = date.substring(9, date.length - 1);
//            if ((day != undefined) && (day.length > 1) && (day[0] == "0")) {
//                day = day.substring(1, day.length)
//            }
            result += ' - <em>';
//            if ((day != undefined) && (day.length > 0))
//                result += day + '.';
//            if ((month != undefined) && (month.length > 0))
//                result += month + '.';
            if (year != undefined)
                result += year + '</em>';
        }
    }

    var doi = null;
    doi = jsonObject[record_metadata.doi];
    if (doi) {
        doi = doi[0];
        result += " - <a target='_blank' style='color: #0094DE;' href='http://dx.doi.org/" + doi + "'>" + doi + "</a>";
    }
    result += '</strong></div>';
    //result += '<br/>';
    //result += '<div class="row"><div class="col-md-6"><a id="button_abstract_keywords_collapse_' + index +

    result += '<div class="row"><a id="button_abstract_keywords_collapse_' + index +
        '" role="button" data-parent="#myGroup" data-toggle="collapse" href="#abstract_keywords_' + index +
        '" style="color: #585858;"> Abstract/Keywords <span class="glyphicon glyphicon-chevron-down" style="font-size:11px"/></a></div><div class="col-md-6"><a target="_blank" href="publication.html?pubID=' + id +
        //'" style="color: #585858;">More details...</a></div></div>';
        '" style="color: #585858;"></a></div>';

    result += '</div>';
    result += '</div>';

    result += '<div class="panel" style="margin-bottom:0!important;">';

    {
        var piece = "";
        piece += '<div id="abstract_keywords_' + index +
                '" class="row result collapse "';
        //if (index % 2) {
            piece += 'style="background-color:#f8f8f8;">';
        /*} else {
            piece += 'style="background-color:#ffffff;">';
        }*/
        piece += '<div class="col-md-7" id="innen_abstract_'+id+'" style="margin-left:10px;">';

        piece += '</div>';

        // info box for the entities
        piece += '<div class="col-md-5" style="margin-right:-10px;">';
        piece += '<span  id="detailed_annot-' + index + '" />';
        piece += "</div>";
        piece += '</div>';
    }
    result += piece;

    result += '</div>';

    result += '<div class="row">';
    result += '<div class="col-md-12">';

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
                                } else {
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
                            } else {
                                break;
                            }
                        } else {
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
                                } else {
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
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    // shall we include snippets[i] as next snippet?
                    if (passiveTerms.length == 0) {
                        newSnippets.push(snippets[i]);
                        for (var dumm in localTerms) {
                            passiveTerms.push(localTerms[dumm])
                        }
                    } else {
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
                } else {
                    result += '...<span style="font-size:12px"><em>' + newSnippets[dumm] + '</em></span>...<br />';
                }
                totalDisplayed++;
                if (totalDisplayed == 3) {
                    break;
                }
            }
        }
    } else {
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
                    } else {
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
    result += '</div>';
    result += '</div>';

    result += '</div>';
    result += '</td></tr>';
    result +=  '<tr><td style="background-color:#f2f2f2; border-top:#ccc;"/></tr>';

    node.append(result);

    // load biblio and abstract info.
    // pos attribute gives the result index, rel attribute gives the document ID
    // abstract and further informations
    var localQuery = {"stored_fields": [abstract_metadata.the_id,
            abstract_metadata.repositoryDocId,
            abstract_metadata.abstract_en,
            abstract_metadata.abstract_fr,
            abstract_metadata.abstract_de,
            abstract_metadata.abstract,
            abstract_metadata.typology,
            abstract_metadata.keywordsid,
            abstract_metadata.keywords
        ],
        //"query": {"filtered": {"query": {"term": {"_id": id}}}}};
        "query": {"bool": {"must": {"term": {"_id": id}}}}};
    $.ajax({
        //type: "get",
        type: "POST",
        url: options.es_host+"/"+options.fulltext_index+"/_search?",
        contentType: 'application/json',
        dataType: 'json',
        //data: {source: JSON.stringify(localQuery)},
        data: JSON.stringify(localQuery),
        success: function (data) {
            displayAbstractPanel(data, index);
        }
    });
    displayTitleAnnotation(titleID);

};

var displayAbstractPanel = function (data, index) {
    var jsonObject = null;
    if (!data) {
        return;
    }
    if (data.hits) {
        if (data.hits.hits) {
            jsonObject = eval(data.hits.hits[0]);
        }
    }
    if (!jsonObject) {
        return;
    }

    if (options.collection == "npl") {
        var docid = jsonObject._id;
        var piece = "";

        jsonObject = jsonObject.fields;
        if (!jsonObject) {
            return;
        }

        var repositoryDocId = jsonObject[abstract_metadata.repositoryDocId];

        if (options.subcollection == "hal") {

            piece += '<p><strong> <a href="https://hal.archives-ouvertes.fr/'
                    + repositoryDocId + '" target="_blank" style="margin-right:10px; color:#D42C2C;" alt="see resource on HAL">' + repositoryDocId + '</a></strong>';
            // document type
            var type = jsonObject[abstract_metadata.typology];
            if (type) {
                // PL: pubtype click should add a filter of typology = pubtype
                // in addition not displaying it as a label, because it is visually confusing with the annotations which are aslo labels
                //piece += '<a href="publication.html?pubID=' + id + '"><span class="label pubtype" style="white-space:normal;">' + type + '</span></a></p>';
                piece += '<span class="pubtype" style="white-space:normal;color:black;">' + type + '</span></p>';
                //piece += '<p><strong>' + type + '</strong></p>';
            }
        }
        if (options.subcollection == "istex") {
          piece += '<p><strong> <a href="https://api.istex.fr/document/' + repositoryDocId +
                  '/fulltext/pdf" target="_blank" style="margin-right:10px; color:#D42C2C;" alt="see resource on ISTEX">' + repositoryDocId + '</a></strong>';

        }
        piece += '<p style="align:justify;text-align:justify; text-justify:inter-word; width:100%;"></p>';

        var abstractp = null;

        var abstractpID = null;
        var abstractpIDs = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.xml:id'];
        if (typeof abstractpIDs == 'string') {
            abstractpIDs[0] = abstractpIDs;
        }

        var abstractps = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$p.$lang_en'];
        if (typeof abstractps == 'string') {
            abstractps[0] = abstractps;
        }

        if (!abstractps || (abstractps.length == 0)) {
            abstractps = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$p.$lang_fr'];

            if (typeof abstractps == 'string') {
                abstractps[0] = abstractps;
            }
        }

        if (!abstractps || (abstractps.length == 0)) {
            abstractps = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$p.$lang_de'];

            if (typeof abstractps == 'string') {
                abstractps[0] = abstractps;
            }
        }

        if (!abstractps || (abstractps.length == 0)) {
            abstractps = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$p.$lang_es'];

            if (typeof abstractps == 'string') {
                abstractps[0] = abstractps;
            }
        }

        if (!abstractps || (abstractps.length == 0)) {
            abstractps = jsonObject['$teiCorpus.$teiHeader.$profileDesc.$abstract.$p.$lang_unknown'];

            if (typeof abstractps == 'string') {
                abstractps[0] = abstractps;
            }
        }

        if(typeof abstractps != 'undefined'){
            for (var n in abstractps) {
                abstractp = abstractps[n];
                abstractpID = abstractpIDs[n];
                  if (abstractp && (abstractp.length > 0) && (abstractp.trim().indexOf(" ") != -1)) {
                      piece += '<p style="align:justify;text-align:justify; text-justify:inter-word; width:100%;">';
                      piece += '<strong>Abstract: </strong><span id="abstractNaked'+abstractpID+'" pos="' + index + '" rel="' + abstractpID + '" >' + abstractp + '</span></p>';
                  }
            }
        }

        // keywords
        var keyword = null;
        var keywordIDs =
                jsonObject[abstract_metadata.keywordsid];
        // we have a list of keyword IDs, each one corresponding to an independent annotation set
        var keywords =
                jsonObject[abstract_metadata.keywords];

        if (typeof keywords == 'string') {
            keyword = keywords;
        } else {
            var keyArray = keywords;
            if (keyArray && keywordIDs) {
                for (var p in keyArray) {
                    var keywordID = keywordIDs[p];
                    if (p == 0) {
                        keyword = '<span id="keywordsNaked"  pos="' + index + '" rel="' + keywordID + '">'
                                + keyArray[p] + '</span>';
                    } else {
                        keyword += ', ' + '<span id="keywordsNaked"  pos="' + index + '" rel="' + keywordID + '">' +
                                keyArray[p] + '</span>';
                    }
                }
            }
        }

        if (keyword && (keyword.length > 0) && (keyword.trim().indexOf(" ") != -1)) {
            piece += ' <p ><strong>Keywords: </strong> ' + keyword + '</p>';
        }

        $('#innen_abstract_' + docid).append(piece);

        displayAbstractAnnotation(abstractpIDs);
        displayKeywordAnnotation(keywordIDs);
    }
};
