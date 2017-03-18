// ===============================================
// everything for quantities
// ===============================================

// map mesurement types and units
var quantitiesTypesUnits = new Object();

// the quantity search object built from the user input
var quantitySearch = {};

var mode = 'form'; // one of form, free or text

var quantitiesPanel = function () {
    initUnitMap();
    var piece = '<div class="well col-md-11" style="background-color:#F7EDDC;">';
    piece += '<div style="width:50%;margin-top:-5px;margin-bottom:10px;"><b>Quantity search</b> - <a style="font-weight:bold;" id="quantities-form" href="#">form</a> - ' + 
        '<a id="quantities-free" href="#">free query</a> - <a id="quantities-text" href="#">text</a></div>'
    piece += '<div id="bar1"/>';
    piece += '<div id="parse-result1"/>';
    piece += '</div>';
    piece += '<div class="col-md-1"><a id="close-quantities-panel" onclick=\'$("#quantities_panel").hide()\'>'+
        '<span class="glyphicon glyphicon-remove" style="color:black;"></span></a></div>';
    $('#quantities_panel').html(piece);
    initFormDisplay(1);
    $('#quantities_panel').show();
    $('#close-quantitiesbar1').hide();

    // bind form, free and text input selection
    $('#quantities-form').on('click', function(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	initFormDisplay(1);
    	$('#close-quantitiesbar1').hide();
    	$('#quantities-form').css("font-weight", "bold");
    	$('#quantities-free').css("font-weight", "normal");
    	$('#quantities-text').css("font-weight", "normal");
    	mode = 'form';
    	return false;
    });
    $('#quantities-free').on('click', function(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	initFreeFieldDisplay(1);
    	$('#close-freebar1').hide();
    	$('#quantities-form').css("font-weight", "normal");
    	$('#quantities-free').css("font-weight", "bold");
    	$('#quantities-text').css("font-weight", "normal");
    	mode = 'free';
    	return false;
    });
    $('#quantities-text').on('click', function(e) {
    	e.stopPropagation();
    	e.preventDefault();
    	$('#bar1').html(quantitiesSearchFreeText);
    	$('#quantities-form').css("font-weight", "normal");
    	$('#quantities-free').css("font-weight", "normal");
    	$('#quantities-text').css("font-weight", "bold");
    	mode = 'text';
    	return false;
    });
}

var initFormDisplay = function(ind) {
	$('#bar'+ind).html(quantitiesSearchForm.replace(/{{NUMBER}}/gi, ind));
    //$('#close-quantitiesbar'+ind).hide();
    $('#quantities_fieldbuttons'+ind).click(addQuantitiesSearchBar);

    // inject multi-choice selector information
    Object.keys(quantitiesTypesUnits).forEach(function(key) {
    	$('.measurement-fields'+ind).append('<li><a href="#" id="measurement-fields'+ind+'-'+key+'">'+key.toLowerCase().replace(/_/g," ")+'</a></li>');
    	$('#measurement-fields'+ind+'-'+key).on("click", function(e) {
    		//console.log($(this).text());
    		$('#selected-measurement-type'+ind).html($(this).text()+' <span class="caret"></span>');
    		var units = quantitiesTypesUnits[$(this).text().toUpperCase().replace(/ /g,"_")];
    		$('.unit-fields'+ind).empty();
    		for(var i in units) {
    			$('.unit-fields'+ind).append('<li><a href="#" id="unit-fields'+ind+'-'+i+'">'+units[i].replace(/_/g," ")+'</a></li>');
    			$('.unit-fields'+ind+' li > a').on("click", function(e) {
    				$('#selected-unit'+ind).html($(this).text()+' <span class="caret"></span>');
    				return false;
    			});
    		}
    		return false;
    	});
    });

    $('#parse'+ind).on('click', function() { 
    	var num = $(this).attr("id").match(/\d+/)[0];
    	parseQuantities(num);
    });
    $('#quantities_freetext_from'+ind).bind('keyup', checkParseButton);
    $('#quantities_freetext_to'+ind).bind('keyup', checkParseButton);

    // bind disambiguate button for substance
    $('disambiguate_substance'+ind).click(disambiguateSubstance);
    $('#quantities_freetext_substance'+ind).bind('keyup', checkDisambiguateSubstanceButton);
    return false;
}

var initFreeFieldDisplay = function(ind) {
	$('#bar'+ind).html(quantitiesSearchFreeField.replace(/{{NUMBER}}/gi, ind));
	$('#quantities_fieldbuttons'+ind).click(addQuantitiesSearchBar);

	$('#parse'+ind).on('click', function() { 
		var num = $(this).attr("id").match(/\d+/)[0];
    	parseQuantities(num);
    });
    $('#quantities_freetext'+ind).bind('keyup', checkParseButton);
}

var checkParseButton = function(e) {
	e.stopPropagation();
    e.preventDefault();
	var num = $(this).attr("id").match(/\d+/)[0];
	if (!num)
		num = '';
    if ($('#quantities_freetext_from'+num).val()) {
        $('#parse' + num).attr("disabled", false);
    } else if ($('#quantities_freetext_to'+num).val()) {
        $('#parse' + num).attr("disabled", false);
    } else if ($('#quantities_freetext'+num).val()) {
        $('#parse' + num).attr("disabled", false);
    } 
    else {
        $('#parse' + num).attr("disabled", true);
    }
    return false;
}

var checkDisambiguateSubstanceButton = function () {
    var num = $(this).attr("id").match(/\d+/)[0];
    if ($('#quantities_freetext_substance'+num).val()) {
        $('#disambiguate_substance' + num).attr("disabled", false);
    }
    else {
        $('#disambiguate_substance' + num).attr("disabled", true);
    }
};

// introduce additional quantity search bar (all search input are of the same type in the panel) 
var addQuantitiesSearchBar = function() {

}

// call grobid quantities to parse currently inputed quantity query
var parseQuantities = function(ind) {
	// create structure to be sent to grobid-quantities
	var queryString;
	var service = {};
	if (mode == 'text') {
		queryString = '{ "text" : "' + $('#quantities_text').val() + '" }';
		service = 'processQuantityText';
	}
	else if (mode == 'free') {
		queryString = { 'text' : $('#quantities_freetext'+ind).val() };
		service = 'processQuantityText';
	}
	else if (mode == 'form') {
		// case type and unit are specified with the form

		queryString = '{ "from" : "' + $('#quantities_freetext_from'+ind).val() + 
					'", "to" : "' + $('#quantities_freetext_to'+ind).val() + 
					'", "type" : "'+ $('#selected-measurement-type'+ind).text() +
					'", "unit": "' + $('#selected-unit'+ind).text()+ '" }';

		// case unit unspecified with the form


		service = 'parseMeasure';
	}

    var urlQuantities = "http://" + options.host_quantities;
    if (urlQuantities.endsWith("/"))
        urlQuantities = urlQuantities.substring(0,urlQuantities.length()-1);
    if ((!options.port_quantities) || (options.port_quantities.length == 0))
        urlQuantities += options.port_quantities + "/" + service;
    else
        urlQuantities += ":" + options.port_quantities + "/" + service;
    $.ajax({
        type: "POST",
        url: urlQuantities,
//              contentType: 'application/json',
//              contentType: 'charset=UTF-8',
        dataType: 'json',
//        dataType: "text",
//              data: { text : encodeURIComponent(queryText) },
        data: queryString,
//              data: JSON.stringify( { text : encodeURIComponent(queryText) } ),
        success: showexpandQuantities
    });
}

var showexpandQuantities = function(sdata) {
	if (!sdata) {
        return;
    }

    console.log(sdata);
}

// disambiguate substance by calling NERD
var disambiguateSubstance = function() {

}


// search bar for quantities as a form
var quantitiesSearchForm = '<div id="quantitiesbar{{NUMBER}}" style="width:100%;padding-right:0px;" class="row input-group clonedDiv">\
<div class="btn-group">\
<button id="selected-measurement-type{{NUMBER}}" class="btn btn-default dropdown-toggle" style="width:80px" data-toggle="dropdown" >\
type <span class="caret"></span>\
</button>\
<ul class="dropdown-menu measurement-fields{{NUMBER}}"></ul>\
</div>\
<div class="btn-group">\
<button id="selected-unit{{NUMBER}}" class=" selected-lang-field btn btn-default dropdown-toggle" style="width:75px" data-toggle="dropdown">\
unit <span class="caret"></span>\
</button>\
<ul class="dropdown-menu unit-fields{{NUMBER}}"></ul>\
</div>\
<div class="btn-group">\
<div style="width: 95px;" class="btn-group">\
<input type="text" class="form-control" id="quantities_freetext_from{{NUMBER}}" name="q1" aria-describedby="sizing-addon1" placeholder="from" autofocus />\
</div>\
<div style="width: 95px;" class="btn-group">\
<input type="text" class="form-control" id="quantities_freetext_to{{NUMBER}}" name="q2" aria-describedby="sizing-addon1" placeholder="to"/>\
</div>\
<div style="min-width: 180px;" class="btn-group">\
<input type="text" class="form-control" id="quantities_freetext_substance{{NUMBER}}" name="q3" aria-describedby="sizing-addon1" placeholder="substance"/>\
</div>\
<div class="btn-group">\
<button type="button" id="disambiguate_substance{{NUMBER}}" class="btn btn-default" disabled="true">Disambiguate</button>\
</div>\
<div class="btn-group">\
<button type="button" id="parse{{NUMBER}}" class="btn btn-default" disabled="true">Parse</button>\
</div>\
<div class="btn-group" style="margin-left:15px;">\
<button class="btn btn-default" id="quantities_fieldbuttons{{NUMBER}}" href="" type="button"><i class="glyphicon glyphicon-plus" style="vertical-align:middle;margin-right:0px;margin-bottom:2px;"></i></button>\
</div>\
<div class="btn-group">\
<button class="btn btn-default" id="close-quantitiesbar{{NUMBER}}" href="" type="button"><i class="glyphicon glyphicon-minus" style="vertical-align:middle;margin-right:0px;margin-bottom:4px;"></i></button>\
</div>\
</div>\
</div>';

// search bar for quantities as a single free field to express the query
var quantitiesSearchFreeField = '<div id="quantitiesbar{{NUMBER}}" style="width:100%;padding-right:0px;" class="row input-group clonedDiv">\
<div style="width:100%;" class="btn-group">\
<div style="width:85%;" class="btn-group">\
<input type="text" class="form-control" id="quantities_freetext{{NUMBER}}" name="q" placeholder="query"/>\
</div>\
<div class="btn-group">\
<button type="button" id="parse{{NUMBER}}" class="btn btn-default" disabled="true">Parse</button>\
</div>\
<div class="btn-group" style="margin-left:15px;">\
<button class="btn btn-default" id="quantities_freebuttons{{NUMBER}}" href="" type="button"><i class="glyphicon glyphicon-plus" style="vertical-align:middle;margin-right:0px;margin-bottom:2px;"></i></button>\
</div>\
<div class="btn-group">\
<button class="btn btn-default" id="close-freebar{{NUMBER}}" href="" type="button"><i class="glyphicon glyphicon-minus" style="vertical-align:middle;margin-right:0px;margin-bottom:4px;"></i></button>\
</div>\
</div>\
</div>';

// text area to express the quantity search with a piece of text (NL)
var quantitiesSearchFreeText = '';

// init the measurement types / units map, this is necessary to fill the multi-choice selectors in the search form 
var initUnitMap = function() {
	if (Object.keys(quantitiesTypesUnits).length == 0) {
		for(var i in allUnits) {
			var type = allUnits[i].type;
			var names = allUnits[i].names;
			for(var j in names) {
				console.log(names[j]);
				var unit = names[j].lemma;
				if (quantitiesTypesUnits[type] == null) {
					quantitiesTypesUnits[type] = [];
					quantitiesTypesUnits[type].push(unit);
				} else {
					quantitiesTypesUnits[type].push(unit);
				}
			}
		}
	}
}