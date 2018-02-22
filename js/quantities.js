// ===============================================
// everything for quantities
// ===============================================

// map mesurement types and units
var quantitiesTypesUnits = new Object();

var initFreeFieldDisplay = function (ind) {
    $('#bar' + ind).html(quantitiesSearchFreeField.replace(/{{NUMBER}}/gi, ind));

    if(ind === 1 ){
      $('#quantities_freebuttons' + ind).click(addQuantitiesPanel);
      $('#close-freebar'+ind).hide();
    }
    if(ind > 1 ) {
      $('#quantities_freebuttons'+ind).hide();
      $('#close-freebar'+ind).show();
      $('#close-freebar'+ind).click(function () {
          // grab the index number
          var theIndex = $(this).attr("id").match(/\d+/)[0];

          // remove searchbar
          $("panel"+theIndex).remove();
          console.log('removedpanel'+"panel"+theIndex);
          dosearch();
      });
    }


    $('#parse' + ind).on('click', function () {
        var num = $(this).attr("id").match(/\d+/)[0];
        parseQuantities(num);
    });
    $('#quantities_freetext' + ind).bind('keyup', checkParseButton);
}

var checkParseButton = function (e) {
    e.stopPropagation();
    e.preventDefault();
    var num = $(this).attr("id").match(/\d+/)[0];
    if (!num)
        num = '';
    if ($('#quantities_freetext_from' + num).val()) {
        $('#parse' + num).attr("disabled", false);
    } else if ($('#quantities_freetext_to' + num).val()) {
        $('#parse' + num).attr("disabled", false);
    } else if ($('#quantities_freetext' + num).val()) {
        $('#parse' + num).attr("disabled", false);
    } else {
        $('#parse' + num).attr("disabled", true);
    }
    return false;
}

var checkDisambiguateSubstanceButton = function () {
    var num = $(this).attr("id").match(/\d+/)[0];
    if ($('#quantities_freetext_substance' + num).val()) {
        $('#disambiguate_substance' + num).attr("disabled", false);
    } else {
        $('#disambiguate_substance' + num).attr("disabled", true);
    }
};


// search bar for quantities as a form
var quantitiesSearchForm = '<div id="quantitiesbar{{NUMBER}}" style="width:100%;padding-right:0px;" class="row input-group">\
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
<div class="btn-group" style="margin-left:15px;">\
<button class="btn btn-default" id="quantities_fieldbuttons{{NUMBER}}" href="" type="button"><i class="glyphicon glyphicon-plus" style="vertical-align:middle;margin-right:0px;margin-bottom:2px;"></i></button>\
</div>\
<div class="btn-group" style="margin-left:15px;">\
<button class="btn btn-default" id="close-quantitiesbar{{NUMBER}}" href="" type="button"><i class="glyphicon glyphicon-minus" style="vertical-align:middle;margin-right:0px;margin-bottom:4px;"></i></button>\
</div>\
</div>\
</div>';

// search bar for quantities as a single free field to express the query
var quantitiesSearchFreeField = '<div id="quantitiesbar{{NUMBER}}" style="width:100%;padding-right:0px;" class="row input-group">\
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
var initUnitMap = function () {
    if (Object.keys(quantitiesTypesUnits).length == 0) {
        for (var i in allUnits) {
            if (allUnits[i].support_uom) {
                var type = allUnits[i].type;
                var names = allUnits[i].names;
                for (var j in names) {
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
}
var mapColor = {'area': '#87A1A8',
    'volume': '#c43c35',
    'velocity': '#c43c35',
    'fraction': '#c43c35',
    'length': '#01A9DB',
    'time': '#f89406',
    'mass': '#c43c35',
    'temperature': '#398739',
    'frequency': '#8904B1;',
    'concentration': '#31B404'};

/* return a color based on the quantity type */
function getColor(type) {
    return mapColor[type];
}
var measurementMap = new Array();

function setupAnnotations(response) {
    var json = response;
    var pageInfo = json._source.annotation.pages;

    var page_height = 0.0;
    var page_width = 0.0;
    console.log(pageInfo);
    var measurements = json._source.annotation.measurements;
    console.log(measurements);
    if (measurements) {
        // hey bro, this must be asynchronous to avoid blocking the brother ;)
        measurements.forEach(function (measurement, n) {
            var measurementType = measurement.type;
            var quantities = [];
            var substance = measurement.quantified;

            if (measurementType == "value") {
                var quantity = measurement.quantity;
                if (quantity)
                    quantities.push(quantity)
            } else if (measurementType == "interval") {
                var quantityLeast = measurement.quantityLeast;
                if (quantityLeast)
                    quantities.push(quantityLeast);
                var quantityMost = measurement.quantityMost;
                if (quantityMost)
                    quantities.push(quantityMost);

                if (!quantityLeast && !quantityMost) {
                    var quantityBase = measurement.quantityBase;
                    if (quantityBase)
                        quantities.push(quantityBase);
                    var quantityRange = measurement.quantityRange;
                    if (quantityRange)
                        quantities.push(quantityRange);
                }
            } else {
                quantities = measurement.quantities;
            }

            var quantityType = null;
            if (quantities) {
                var quantityMap = new Array();
                for (var currentQuantityIndex = 0; currentQuantityIndex < quantities.length; currentQuantityIndex++) {
                    var quantity = quantities[currentQuantityIndex];
                    quantity['quantified'] = substance;
                    quantityMap[currentQuantityIndex] = quantity;
                    if (quantityType == null)
                        quantityType = quantity.type;
                }
            }

            measurementMap[n] = quantities;

            //var theId = measurement.type;
            var theUrl = null;
            //var theUrl = annotation.url;
            var pos = measurement.boundingBoxes;
            if ((pos != null) && (pos.length > 0)) {
                pos.forEach(function (thePos, m) {
                    // get page information for the annotation
                    var pageNumber = thePos.p;
                    if (pageInfo[pageNumber - 1]) {
                        page_height = pageInfo[pageNumber - 1].page_height;
                        page_width = pageInfo[pageNumber - 1].page_width;
                    }
                    annotateEntity(quantityType, thePos, theUrl, page_height, page_width, n, m);
                });
            }
        });
    }
}

function annotateEntity(theId, thePos, theUrl, page_height, page_width, measurementIndex, positionIndex) {
    var page = thePos.p;
    var pageDiv = $('#page-' + page);
    var canvas = pageDiv.children('canvas').eq(0);
    //var canvas = pageDiv.find('canvas').eq(0);;

    var canvasHeight = canvas.height();
    var canvasWidth = canvas.width();
    var scale_x = canvasHeight / page_height;
    var scale_y = canvasWidth / page_width;

    var x = thePos.x * scale_x - 1;
    var y = thePos.y * scale_y - 1;
    var width = thePos.w * scale_x + 1;
    var height = thePos.h * scale_y + 1;

    //make clickable the area
    theId = "" + theId;
    if (theId)
        theId = theId.replace(" ", "_");
    var element = document.createElement("a");
    var attributes = "display:block; width:" + width + "px; height:" + height + "px; position:absolute; top:" +
            y + "px; left:" + x + "px;";
    element.setAttribute("style", attributes + "border:2px solid; border-color: " + getColor(theId) + ";");
    //element.setAttribute("style", attributes + "border:2px solid;");
    element.setAttribute("class", theId);
    element.setAttribute("id", 'annot-' + measurementIndex + '-' + positionIndex);
    element.setAttribute("page", page);
    /*element.setAttribute("data-toggle", "popover");
     element.setAttribute("data-placement", "top");
     element.setAttribute("data-content", "content");
     element.setAttribute("data-trigger", "hover");
     $(element).popover({
     content: "<p>Mesurement Object</p><p>" +theId+"<p>",
     html: true,
     container: 'body'
     });*/

    pageDiv.append(element);
    pageDiv.on("hover", '#annot-' + measurementIndex + '-' + positionIndex, viewQuantityPDF);
    pageDiv.on("click", '#annot-' + measurementIndex + '-' + positionIndex, viewQuantityPDF);
}


function viewQuantityPDF() {
    var pageIndex = $(this).attr('page');
    var localID = $(this).attr('id');

    console.log('viewQuanityPDF ' + pageIndex + ' / ' + localID);

    var ind1 = localID.indexOf('-');
    var ind2 = localID.indexOf('-', ind1 + 1);
    var localMeasurementNumber = parseInt(localID.substring(ind1 + 1, ind2));
    //var localMeasurementNumber = parseInt(localID.substring(ind1 + 1, localID.length));
    if ((measurementMap[localMeasurementNumber] == null) || (measurementMap[localMeasurementNumber].length == 0)) {
        // this should never be the case
        console.log("Error for visualising annotation measurement with id " + localMeasurementNumber
                + ", empty list of measurement");
    }

    var quantityMap = measurementMap[localMeasurementNumber];
    console.log(quantityMap);
    var measurementType = null;
    var string = "";
    if (quantityMap.length == 1) {
        measurementType = "Atomic value";
        string = toHtml(quantityMap, measurementType, $(this).position().top);
    } else if (quantityMap.length == 2) {
        measurementType = "Interval";
        string = intervalToHtml(quantityMap, measurementType, $(this).position().top);
    } else {
        measurementType = "List";
        string = toHtml(quantityMap, measurementType, $(this).position().top);
    }
//console.log(string);
    $('#detailed_quantity-' + pageIndex).html(string);
    $('#detailed_quantity-' + pageIndex).show();
}

function intervalToHtml(quantityMap, measurementType, topPos) {
        var string = "";
        var rawUnitName = null;

        // LEAST value
        var quantityLeast = quantityMap[0];
        var type = quantityLeast.type;

        var colorLabel = null;
        if (type) {
            colorLabel = type;
        } else {
            colorLabel = quantityLeast.rawName;
        }
        if (colorLabel)
            colorLabel = colorLabel.replace(" ", "_");
        var leastValue = quantityLeast.rawValue;
        var startUniLeast = -1;
        var endUnitLeast = -1;

        var unitLeast = quantityLeast.rawUnit;
        if (unitLeast) {
            rawUnitName = unitLeast.name;
            startUniLeast = parseInt(quantityLeast.offsetStart, 10);
            endUnitLeast = parseInt(quantityLeast.offsetEnd, 10);
        }
        var normalizedQuantityLeast = quantityLeast.normalizedQuantity;
        var normalizedUnit = quantityLeast.normalizedUnit;

        var substance = quantityLeast.quantified;

        // MOST value
        var quantityMost = quantityMap[1];
        var mostValue = quantityMost.rawValue;
        var startUniMost = -1;
        var endUnitMost = -1;

        var unitMost = quantityMost.rawUnit;
        if (unitMost) {
            startUniMost = parseInt(quantityMost.offsetStart, 10);
            endUnitMost = parseInt(quantityMost.offsetEnd, 10);
        }
        var normalizedQuantityMost = quantityMost.normalizedQuantity;

        if (!substance)
            substance = quantityMost.quantified;

        string += "<div class='info-sense-box " + colorLabel + "'";
        if (topPos != -1)
            string += " style='vertical-align:top; position:relative; top:" + topPos + "'";
        string += "><h2 style='color:#FFF;padding-left:10px;font-size:16;'>" + measurementType;
        string += "</h2>";
        string += "<div class='container-fluid' style='background-color:#FFF;color:#70695C;border:padding:5px;margin-top:5px;'>" +
            "<table style='width:100%;display:inline-table;'><tr style='display:inline-table;'><td>";

        if (type) {
            string += "<p>quantity type: <b>" + type + "</b></p>";
        }

        if (leastValue || mostValue) {
            string += "<p>raw: from <b>" + leastValue + "</b> to <b>" + mostValue + "</b></p>";
        }

        if (rawUnitName) {
            string += "<p>raw unit name: <b>" + rawUnitName + "</b></p>";
        }

        if (normalizedQuantityLeast || normalizedQuantityMost) {
            string += "<p>normalized: from <b>" + normalizedQuantityLeast + "</b> to <b>"
                + normalizedQuantityMost + "</b></p>";
        }

        if (normalizedUnit) {
            string += "<p>normalized unit: <b>" + normalizedUnit.name + "</b></p>";
        }

        if (substance) {
            string += "</td></tr><tr style='width:100%;display:inline-table;'><td style='border-top-width:1px;width:100%;border-top:1px solid #ddd;display:inline-table;'>";
            string += "<p style='display:inline-table;'>quantified (experimental):"
            string += "<table style='width:100%;display:inline-table;'><tr><td>";
            string += "<p>raw: <b>" + substance.rawName;
            string += "</b></p>";
            string += "<p>normalized: <b>" + substance.normalizedName;
            string += "</b></p></td></tr></table>";
            string += "</p>";
        }

        string += "</td><td style='align:right;bgcolor:#fff'></td></tr>";
        string += "</table></div>";

        return string;

    }

    function toHtml(quantityMap, measurementType, topPos) {
        var string = "";
        var first = true;
        for (var quantityListIndex = 0; quantityListIndex < quantityMap.length; quantityListIndex++) {

            var quantity = quantityMap[quantityListIndex];
            var type = quantity.type;

            var colorLabel = null;
            if (type) {
                colorLabel = type;
            } else {
                colorLabel = quantity.rawName;
            }

            var rawValue = quantity.rawValue;
            var unit = quantity.rawUnit;

            var parsedValue = quantity.parsedValue;
            // var parsedUnit = quantity.parsedUnit;

            var normalizedQuantity = quantity.normalizedQuantity;
            var normalizedUnit = quantity.normalizedUnit;

            var substance = quantity.quantified;

            var rawUnitName = null;
            var startUnit = -1;
            var endUnit = -1;
            if (unit) {
                rawUnitName = unit.name;
                startUnit = parseInt(unit.offsetStart, 10);
                endUnit = parseInt(unit.offsetEnd, 10);
            }

            if (first) {
                string += "<div class='info-sense-box " + colorLabel + "'";
                if (topPos != -1)
                     string += " style='vertical-align:top; position:relative; top:" + topPos + "'";
                string += "><h2 style='color:#FFF;padding-left:10px;font-size:16;'>" + measurementType;
                string += "</h2>";
                first = false;
            }

            string += "<div class='container-fluid' style='background-color:#FFF;color:#70695C;border:padding:5px;margin-top:5px;'>" +
                "<table style='width:100%;display:inline-table;'><tr style='display:inline-table;'><td>";

            if (type) {
                string += "<p>quantity type: <b>" + type + "</b></p>";
            }

            if (rawValue) {
                string += "<p>raw value: <b>" + rawValue + "</b></p>";
            }

            if (parsedValue && (parsedValue != rawValue)) {
                string += "<p>parsed value: <b>" + parsedValue + "</b></p>";
            }

            if (rawUnitName) {
                string += "<p>raw unit name: <b>" + rawUnitName + "</b></p>";
            }

            if (normalizedQuantity) {
                string += "<p>normalized value: <b>" + normalizedQuantity + "</b></p>";
            }

            if (normalizedUnit) {
                string += "<p>normalized unit name: <b>" + normalizedUnit.name + "</b></p>";
            }

            if (substance) {
                string += "</td></tr><tr style='width:100%;display:inline-table;'><td style='border-top-width:1px;width:100%;border-top:1px solid #ddd;display:inline-table;'>";
                string += "<p style='display:inline-table;'>quantified (experimental):"
                string += "<table style='width:100%;display:inline-table;'><tr><td>";
                string += "<p>raw: <b>" + substance.rawName;
                string += "</b></p>";
                string += "<p>normalized: <b>" + substance.normalizedName;
                string += "</b></p></td></tr></table>";
                string += "</p>";
            }

            string += "</td></tr>";
            string += "</table></div>";
        }
        string += "</div>";

        return string;
    }
