jQuery(document).ready(function ($) {
    var url_options = $.getUrlVars();
    var query = '{"fields": ["$teiCorpus.repositoryDocId",\
            "$teiCorpus.$teiHeader.$titleStmt.$title.$title-first",\
    "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_en",\
    "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_fr",\
    "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_de",\
    "$teiCorpus.$teiHeader.$profileDesc.$abstract.$lang_es",\
    "$teiCorpus.$TEI.$text.$back.$div.$listBibl.$biblStruct.$analytic.$title.$title-first",\
    "$teiCorpus.$TEI.$text.$back.$div.$listBibl.$biblStruct.$analytic.$title.$lang_en",\
    "$teiCorpus.$TEI.$text.$back.$div.$listBibl.$biblStruct.$analytic.$title.$lang_fr",\
    "$teiCorpus.$TEI.$text.$back.$div.$listBibl.$biblStruct.$analytic.$title.$lang_de",\
    "$teiCorpus.$teiHeader.$profileDesc.$textClass.$keywords.$type_author.$term",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$date.$type_datePub",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$date.$type_dateDefended",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$biblScope.$unit_pp",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$biblScope.$unit_volume",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$biblScope.$unit_serie",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$biblScope.$unit_issue",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$idno.$type_doi",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$publisher",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$title.$title-first",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$date.$type_start",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$date.$type_end",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$settlement",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$country",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$title.$title-first",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.level",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$author.$persName.$fullName",\
    "$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$author.$idno.$type_anhalyticsID",\
    "$teiCorpus.$TEI.$text.$back.$div.$type_references.$listBibl.$biblStruct.$analytic.$title.$title-first",\
    "$teiCorpus.$TEI.$text.$back.$div.$type_references.$listBibl.$biblStruct.$monogr.$title.$title-first"],\
      "query": {\
        "filtered": {\
          "query": {\
            "match_all": {}\
          },\
          "filter": {\
            "term": {\
              "_id": "' + url_options.pubID + '"\
            }\
          }\
        }\
      }\
    }"';
    parseresults = function(sdata) {
        var resultobj = new Object();
        var fields = sdata.hits.hits[0].fields;
        resultobj["repoId"] = fields['$teiCorpus.repositoryDocId'];
        resultobj["overview"] = getOverview(fields);
        resultobj["authors"] = getAuthors(fields);
        resultobj["references"] = setReferences(fields['$teiCorpus.repositoryDocId']);
        resultobj["citedby"] = "";
        resultobj["keywords"] = getKeywords(fields);
        resultobj["title"] = getTitle(fields);
        resultobj["abstract"] = getAbstract(fields);
        return resultobj;
    };

    showresults = function(sdata) {
        console.log(sdata)
        if (sdata.hits.total) {
            sdata = parseresults(sdata);
            $('#fulltext').html(sdata.repoId);
            $('#title').html(sdata.title);
            $('#Overview').html(sdata.overview);
            $('#Abstract').html(sdata.abstract);
            $('#Authors').html(sdata.authors);
            //
            $('#CitedBy').html(sdata.citedby);
            $('#Keywords').html(sdata.keywords);
        } else
            alert("author not found!");
    };

    showerror = function(xhr, status) {
        alert("Sorry, there was a problem!");
    };

    $.ajax({
        type: "get",
        url: "http://localhost:9200/anhalytics_teis/_search",
        data: {
            source: query
        },
        // processData: false,
        dataType: "jsonp",
        success: showresults,
        error: showerror
    });
    
    setReferences = function(repoId) {
        var queryRef = '{"query": {\
        "filtered": {\
          "query": {\
            "match_all": {}\
          },\
          "filter": {\
            "term": {\
              "publications.uri": "' + repoId + '"\
            }\
          }\
        }\
      }\}';
        $.ajax({
            type: "get",
            url: "http://localhost:9200/anhalytics/references/_search",
            data: {
                source: queryRef
            },
            dataType: "jsonp",
            success: function(data) {
                var piece = '<div class="row">';
                if (data.hits.total) {
                    var i = 1;
                    for (var ref in data.hits.hits) {
                        console.log(data.hits.hits[ref]._source.publications.publication.title);
                        piece += '<div class="col-md-12" style="margin-bottom: 1em;"><a target="_blank"  >' +
                            i + ". " +
                            data.hits.hits[ref]._source.publications.publication.title + ", " +
                            "<i>" + data.hits.hits[ref]._source.publications.publication.monogr_title + "</i>" + ", " +
                            "pp." + data.hits.hits[ref]._source.publications.publication.start_page + "-" +
                            data.hits.hits[ref]._source.publications.publication.end_page + " ," +
                            data.hits.hits[ref]._source.publications.publication.publisher + ", " +
                            data.hits.hits[ref]._source.publications.publication.date + '</a></div>';
                        i++;
                    }

                }
                piece += '</div>';
                $('#References').html(piece);
            },
            error: showerror
        });
    }
    
    getTitle = function(fields) {
        var title = null;
        var titles = null;
        titles = fields['$teiCorpus.$teiHeader.$titleStmt.$title.$title-first'];
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

        if (!title || (title.length === 0)) {

            titles = fields['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$title.$lang_en'];
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
        }

        if (!title || (title.length === 0)) {

            titles = fields['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$title.$lang_fr'];
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
        }
        if (!title || (title.length === 0)) {

            titles = fields['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$title.$lang_de'];
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
        }

        return title;
    }
    getAbstract = function(fields) {
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
        return abstract;
    }
    getOverview = function(fields) {
        var overview = "";
        // date
        var date;
        var datePiece;
        var dates = null;
        dates = fields['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$date.$type_datePub'];
        var dateType = "Publication date :";
        if (!dates) {
            dates = fields['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$date.$type_dateDefended'];
            dateType = "Defense date :";
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
                datePiece = ' <em>';
                if ((day != undefined) && (day.length > 0))
                    datePiece += day + '.';
                if ((month != undefined) && (month.length > 0))
                    datePiece += month + '.';
                if (year != undefined)
                    datePiece += year + '</em>' + '<br />';
            }
        }
        if (datePiece && (datePiece.length > 0)) {
            overview += dateType + datePiece;
        }
        var titleBook = null;
        var titlesBook = null;
        titlesBook = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$title.$title-first"];
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
        var typeBook = null;
        var typesBook = null;
        typesBook = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.level"];
        var typeBookTmp = null;
        if (typeof typesBook == 'string') {
            typeBook = typesBook;
        } else {
            typeBook = typesBook;
            while ((typeof typeBook != 'string') && (typeof typeBook != 'undefined')) {
                typeBookTmp = typeBook[0];
                if (typeof typeBookTmp != 'undefined') {
                    typeBook = typeBookTmp;
                } else {
                    for (var x in typeBook) {
                        typeBookTmp = typeBook[x];
                    }
                    if (typeBookTmp)
                        typeBook = typeBookTmp[0];
                    else
                        typeBook = null;
                    break;
                }

            }
        }

        if (titleBook && (titleBook.length > 1)) {
            overview += ' Published in : <em>' + titleBook + '</em>[' + typeBook + ']' + '<br />';
        }

        var conference = null;
        var conferences = null;
        conferences = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$title.$title-first"];
        var conferenceTmp = null;
        if (typeof conferences == 'string') {
            conference = conferences;
        } else {
            conference = conferences;
            while ((typeof conference != 'string') && (typeof conference != 'undefined')) {
                conferenceTmp = conference[0];
                if (typeof conferenceTmp != 'undefined') {
                    conference = conferenceTmp;
                } else {
                    for (var x in conference) {
                        conferenceTmp = conference[x];
                    }
                    if (conferenceTmp)
                        conference = conferenceTmp[0];
                    else
                        conference = null;
                    break;
                }

            }
        }
        if (conference && (conference.length > 1)) {
            overview += ' Conference : <em>' + conference + '</em>' + '<br />';
        }


        var conferenceStartDates = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$date.$type_start"];
        var conferenceStartDate = "";
        if (conferenceStartDates)
            conferenceStartDate = conferenceStartDates[0];
        var conferenceEndDates = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$date.$type_end"];
        var conferenceEndDate = "";
        if (conferenceEndDates)
            conferenceEndDate = conferenceEndDates[0];
        if ((conferenceStartDate && (conferenceStartDate.length > 1)) || (conferenceEndDate && (conferenceEndDate.length > 1))) {
            overview += ' Meeting Date : <em>' + conferenceStartDate + '-' + conferenceEndDate + '</em>' + '<br />';
        }

        var settlements = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$settlement"];
        var settlement = null;
        if (settlements)
            settlement = settlements[0];
        var countrys = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$meeting.$country"];
        var country = null;
        if (countrys)
            country = countrys[0];
        if ((country && (country.length > 1)) || (settlement && (settlement.length > 1))) {
            overview += ' Conference Location : <em>' + settlement + ', ' + country + '</em>' + '<br />';
        }



        var pages = null;
        var pagess = null;
        pagess = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$biblScope.$unit_pp"];
        var pagesTmp = null;
        if (typeof pagess == 'string') {
            pages = pagess;
        } else {
            pages = pagess;
            while ((typeof pages != 'string') && (typeof pages != 'undefined')) {
                pagesTmp = pages[0];
                if (typeof pagesTmp != 'undefined') {
                    pages = pagesTmp;
                } else {
                    for (var x in pages) {
                        pagesTmp = pages[x];
                    }
                    if (pagesTmp)
                        pages = pagesTmp[0];
                    else
                        pages = null;
                    break;
                }

            }
        }
        if (pages && (pages.length > 1)) {
            overview += ' Page(s) : <em>' + pages + '</em>' + '<br />';
        }


        var volume = null;
        var volumes = null;
        volumes = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$biblScope.$unit_volume"];
        var volumeTmp = null;
        if (typeof volumes == 'string') {
            volume = volumes;
        } else {
            volume = volumes;
            while ((typeof volume != 'string') && (typeof volume != 'undefined')) {
                volumeTmp = volume[0];
                if (typeof volumeTmp != 'undefined') {
                    volume = volumeTmp;
                } else {
                    for (var x in volume) {
                        volumeTmp = volume[x];
                    }
                    if (volumeTmp)
                        volume = volumeTmp[0];
                    else
                        volume = null;
                    break;
                }

            }
        }
        if (volume && (volume.length > 1)) {
            overview += ' Volume : <em>' + volume + '</em>' + '<br />';
        }

        var serie = null;
        var series = null;
        series = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$biblScope.$unit_serie"];
        var serieTmp = null;
        if (typeof series == 'string') {
            serie = series;
        } else {
            serie = series;
            while ((typeof serie != 'string') && (typeof serie != 'undefined')) {
                serieTmp = serie[0];
                if (typeof serieTmp != 'undefined') {
                    serie = serieTmp;
                } else {
                    for (var x in serie) {
                        serieTmp = serie[x];
                    }
                    if (serieTmp)
                        serie = serieTmp[0];
                    else
                        serie = null;
                    break;
                }

            }
        }
        if (serie && (serie.length > 1)) {
            overview += ' Serie : <em>' + serie + '</em>' + '<br />';
        }



        var doi = null;
        var dois = null;
        dois = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$idno.$type_doi"];
        var doiTmp = null;
        if (typeof dois == 'string') {
            doi = dois;
        } else {
            doi = dois;
            while ((typeof doi != 'string') && (typeof doi != 'undefined')) {
                doiTmp = doi[0];
                if (typeof doiTmp != 'undefined') {
                    doi = doiTmp;
                } else {
                    for (var x in doi) {
                        doiTmp = doi[x];
                    }
                    if (doiTmp)
                        doi = doiTmp[0];
                    else
                        doi = null;
                    break;
                }

            }
        }
        if (doi && (doi.length > 1)) {
            overview += ' DOI : <em>' + doi + '</em>' + '<br />';
        }

        var publisher = null;
        var publishers = null;
        publishers = fields["$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$monogr.$imprint.$publisher"];
        var publisherTmp = null;
        if (typeof dois == 'string') {
            publisher = publishers;
        } else {
            publisher = publishers;
            while ((typeof publisher != 'string') && (typeof publisher != 'undefined')) {
                publisherTmp = publisher[0];
                if (typeof publisherTmp != 'undefined') {
                    publisher = publisherTmp;
                } else {
                    for (var x in publisher) {
                        publisherTmp = publisher[x];
                    }
                    if (publisherTmp)
                        publisher = publisherTmp[0];
                    else
                        publisher = null;
                    break;
                }

            }
        }
        if (publisher && (publisher.length > 1)) {
            overview += ' Publisher : <em>' + publisher + '</em>' + '<br />';
        }

        return overview;
    }

    getKeywords = function(fields) {
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
                        keyword += ', ' + keyArray[p];
                    }
                }
            }
        }

        if (keyword && (keyword.length > 0) && (keyword.trim().indexOf(" ") != -1)) {
            keywordsPiece = ' <p><strong>Keywords: </strong> ' + keyword + '</p>';
        }
        return keywordsPiece;
    }

    getAuthors = function(fields) {
        var names =
            fields['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$author.$persName.$fullName'];
        if (names) {
            var ids = fields['$teiCorpus.$teiHeader.$sourceDesc.$biblStruct.$author.$idno.$type_anhalyticsID'];
            var piece = '<div class="row">';
            for (var aut in names) {
                var id_ = ids[aut];
                var name_ = names[aut];
                piece += '<div class="col-md-3"><a target="_blank" href="indexprofile.html?authorID=' + id_ + '" >' + name_ + '</a></div>';
            }
            piece += '</div>';
        }

        return piece;
    }
        
});