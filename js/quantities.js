// ===============================================
// everything for quantities
// ===============================================

// map mesurement types and units
var quantitiesTypesUnits = new Object();

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