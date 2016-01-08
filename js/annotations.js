var displayAnnotations = function (data, index, id, origin) {
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

    // origin is title, abstract or keywords
    if (!options.data['' + origin]) {
        options.data['' + origin] = [];
    }
    if (origin == 'keyword') {
        if (!options.data['' + origin][index]) {
            options.data['' + origin][index] = [];
        }
        options.data['' + origin][index][id] = jsonObject['_source']['annotation']['nerd'];
    }
    else
        options.data['' + origin][index] = jsonObject['_source']['annotation']['nerd'];
    //console.log('annotation for ' + id);
    //console.log(jsonObject);

    //var text = jsonObject['_source']['annotation']['nerd']['text'];		
    var text = $('[rel="' + id + '"]').text();
    var entities = jsonObject['_source']['annotation']['nerd']['entities'];
    var m = 0;
    var lastMaxIndex = text.length;
    //for(var m in entities) {
    for (var m = entities.length - 1; m >= 0; m--) {
        //var entity = entities[entities.length - m - 1];
        var entity = entities[m];
        var chunk = entity.rawName;
        var domains = entity.domains;
        var domain = null;
        if (domains && domains.length > 0) {
            domain = domains[0].toLowerCase();
        }
        var label = null;
        if (entity.type)
            label = NERTypeMapping(entity.type, entity.chunk);
        else if (domain)
            label = domain;
        else
            label = chunk;
        var start = parseInt(entity.offsetStart, 10);
        var end = parseInt(entity.offsetEnd, 10);

        // keeping track of the lastMaxIndex allows to handle nbest results, e.g. possible
        // overlapping annotations to display as infobox, but with only one annotation
        // tagging the text
        if (start > lastMaxIndex) {
            // we have a problem in the initial sort of the entities
            // the server response is not compatible with the client 
            console.log("Sorting of entities as present in the server's response not valid for this client.");
        }
        else if ((start == lastMaxIndex) || (end > lastMaxIndex)) {
            // overlap
            end = lastMaxIndex;
        }
        else {
            // we produce the annotation on the string
            if (origin == "abstract") {
                text = text.substring(0, start) +
                        '<span id="annot-abs-' + index + '-' + (entities.length - m - 1) +
                        '" rel="popover" data-color="' + label + '">' +
                        '<span class="label ' + label +
                        '" style="cursor:hand;cursor:pointer;white-space: normal;" >'
                        + text.substring(start, end) + '</span></span>'
                        + text.substring(end, text.length + 1);
            }
            else if (origin == "keyword") {
                text = text.substring(0, start) +
                        '<span id="annot-key-' + index + '-' + (entities.length - m - 1) + '-' + id
                        + '" rel="popover" data-color="' + label + '">' +
                        '<span class="label ' + label + '" style="cursor:hand;cursor:pointer;" >'
                        + text.substring(start, end) + '</span></span>'
                        + text.substring(end, text.length + 1);
            }
            else {
                text = text.substring(0, start) +
                        '<span id="annot-' + index + '-' + (entities.length - m - 1) +
                        '" rel="popover" data-color="' + label + '">' +
                        '<span class="label ' + label + '" style="cursor:hand;cursor:pointer;" >'
                        + text.substring(start, end) + '</span></span>'
                        + text.substring(end, text.length + 1);
            }
            lastMaxIndex = start;
        }
    }

    //var result = '<strong><span style="font-size:13px">' + text + '<span></strong>';
    if (origin == "abstract")
        $('[rel="' + id + '"]').html('<strong>Abstract: </strong>' + text);
    else
        $('[rel="' + id + '"]').html(text);

    // now set the popovers/view event 
    var m = 0;
    for (var m in entities) {
        // set the info box
        if (origin == "abstract")
            $('#annot-abs-' + index + '-' + m).hover(viewEntity);
        else if (origin == "keyword")
            $('#annot-key-' + index + '-' + m + '-' + id).hover(viewEntity);
        else
            $('#annot-' + index + '-' + m).hover(viewEntity);
    }
}

/** 
 * View the full entity information in the infobox 
 */
function viewEntity(event) {
    event.preventDefault();
    // currently entity can appear in the title, abstract or keywords
    // the origin is visible in the event origin id, as well as the "coordinates" of the entity 

    var localID = $(this).attr('id');
    console.log(localID);

    var resultIndex = -1;
    var abstractSentenceNumber = -1;
    var entityNumber = -1;
    var idNumber = null;

    var inAbstract = false;
    var inKeyword = false;
    if (localID.indexOf("-abs-") != -1) {
        // the entity is located in the abstract
        inAbstract = true;
        var ind1 = localID.indexOf('-');
        ind1 = localID.indexOf('-', ind1 + 1);
        //var ind2 = localID.indexOf('-', ind1+1);
        var ind3 = localID.lastIndexOf('-');
        resultIndex = parseInt(localID.substring(ind1 + 1, ind3));
        //abstractSentenceNumber = parseInt(localID.substring(ind2+1,ind3));
        entityNumber = parseInt(localID.substring(ind3 + 1, localID.length));
    }
    else if (localID.indexOf("-key-") != -1) {
        // the entity is located in the keywords
        inKeyword = true;
        var ind1 = localID.indexOf('-');
        ind1 = localID.indexOf('-', ind1 + 1);
        var ind2 = localID.indexOf('-', ind1 + 1);
        var ind3 = localID.lastIndexOf('-');
        resultIndex = parseInt(localID.substring(ind1 + 1, ind3));
        entityNumber = parseInt(localID.substring(ind2 + 1, ind3));
        idNumber = localID.substring(ind3 + 1, localID.length);
    }
    else {
        // the entity is located in the title
        var ind1 = localID.indexOf('-');
        var ind2 = localID.lastIndexOf('-');
        resultIndex = parseInt(localID.substring(ind1 + 1, ind2));
        entityNumber = parseInt(localID.substring(ind2 + 1, localID.length));

        // and, if not expended, we need to expend the record collapsable to show the info box
        //('#myCollapsible_'+resultIndex).collapse('show');
    }

    var entity = null;
    var localSize = -1;

    if (inAbstract) {
        //console.log(resultIndex + " " + entityNumber);
        //console.log(options.data['abstract'][resultIndex]['entities']);

        if ((options.data['abstract'][resultIndex])
                && (options.data['abstract'][resultIndex])
                && (options.data['abstract'][resultIndex]['entities'])
                ) {
            localSize = options.data['abstract'][resultIndex]
                    ['entities'].length;
            entity = options.data['abstract'][resultIndex]
                    ['entities'][localSize - entityNumber - 1];
        }
    }
    else if (inKeyword) {
        //console.log(resultIndex + " " + entityNumber + " " + idNumber);
        //console.log(options.data['keyword'][resultIndex][idNumber]['entities']);

        if ((options.data['keyword'][resultIndex])
                && (options.data['keyword'][resultIndex][idNumber])
                && (options.data['keyword'][resultIndex][idNumber]['entities'])
                ) {
            localSize = options.data['keyword'][resultIndex][idNumber]
                    ['entities'].length;
            entity = options.data['keyword'][resultIndex][idNumber]
                    ['entities'][localSize - entityNumber - 1];
        }
    }
    else {
        //console.log(resultIndex + " " + " " + entityNumber);
        //console.log(options.data['title'][resultIndex]['entities']);

        if ((options.data['title'])
                && (options.data['title'][resultIndex])
                && (options.data['title'][resultIndex]['entities'])
                ) {
            localSize = options.data['title'][resultIndex]['entities'].length;
            entity = options.data['title'][resultIndex]['entities'][localSize - entityNumber - 1];
        }
    }

    var string = "";
    if (entity != null) {
        //console.log(entity);
        var domains = entity.domains;
        if (domains && domains.length > 0) {
            domain = domains[0].toLowerCase();
        }
        var type = entity.type;

        var colorLabel = null;
        if (type)
            colorLabel = type;
        else if (domains && domains.length > 0) {
            colorLabel = domain;
        }
        else
            colorLabel = entity.rawName;

        var start = parseInt(entity.offsetStart, 10);
        var end = parseInt(entity.offsetEnd, 10);

        var subType = entity.subtype;
        var conf = entity.nerd_score;
        if (conf && conf.length > 4)
            conf = conf.substring(0, 4);
        var definitions = entity.definitions;
        var wikipedia = entity.wikipediaExternalRef;
        var freebase = entity.freeBaseExternalRef;
        var content = entity.rawName; //$(this).text();
        var preferredTerm = entity.preferredTerm;

        var sense = null;
        if (entity.sense)
            sense = entity.sense.fineSense;

        string += "<div class='info-sense-box " + colorLabel +
                "'><h3 style='color:#FFF;padding-left:10px;'>" + content.toUpperCase() +
                "</h3>";
        string += "<div class='container-fluid' style='background-color:#F9F9F9;color:#70695C;border:padding:5px;margin-top:5px;'>" +
                "<table style='width:100%;background-color:#fff;border:0px'><tr style='background-color:#fff;border:0px;'><td style='background-color:#fff;border:0px;'>";

        if (type)
            string += "<p>Type: <b>" + type + "</b></p>";

        if (sense)
            string += "<p>Sense: <b>" + sense + "</b></p>";

        if (domains && domains.length > 0) {
            string += "<p>Domains: <b>";
            for (var i = 0; i < domains.length; i++) {
                if (i != 0)
                    string += ", ";
                string += domains[i].replace("_", " ");
            }
            string += "</b></p>";
        }

        if (preferredTerm) {
            string += "<p>Preferred: <b>" + preferredTerm + "</b></p>";
        }

        string += "<p>conf: <i>" + conf + "</i></p>";

        string += "</td><td style='align:right;background-color:#fff'>";

        if (freebase != null) {
            var urlImage = 'https://usercontent.googleapis.com/freebase/v1/image' + freebase;
            urlImage += '?maxwidth=150';
            urlImage += '&maxheight=150';
            urlImage += '&key=' + options.api_key;
            string += '<img src="' + urlImage + '" alt="' + freebase + '"/>';
        }

        string += "</td></tr></table>";

        if ((definitions != null) && (definitions.length > 0)) {
            string += "<p>" + definitions[0].definition + "</p>";
        }
        if ((wikipedia != null) || (freebase != null)) {
            string += '<p>Reference: '
            if (wikipedia != null) {
                string += '<a href="http://en.wikipedia.org/wiki?curid=' +
                        wikipedia +
                        '" target="_blank"><img style="max-width:28px;max-height:22px;margin-top:5px;" src="data/images/wikipedia.png"/></a>';
            }
            if (freebase != null) {
                string += '<a href="http://www.freebase.com' +
                        freebase +
                        '" target="_blank"><img style="max-width:28px;max-height:22px;margin-top:5px;" src="data/images/freebase_icon.png"/></a>';

            }
            string += '</p>';
        }

        string += "</div></div>";
        $('#detailed_annot-' + resultIndex).html(string);
        $('#detailed_annot-' + resultIndex).show();
    }
}