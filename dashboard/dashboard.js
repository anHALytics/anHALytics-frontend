var iso3 = {"BD": "BGD", "BE": "BEL", "BF": "BFA", "BG": "BGR", "BA": "BIH", "BB": "BRB", "WF": "WLF", "BL": "BLM", "BM": "BMU", "BN": "BRN", "BO": "BOL", "BH": "BHR", "BI": "BDI", "BJ": "BEN", "BT": "BTN", "JM": "JAM", "BV": "BVT", "BW": "BWA", "WS": "WSM", "BQ": "BES", "BR": "BRA", "BS": "BHS", "JE": "JEY", "BY": "BLR", "BZ": "BLZ", "RU": "RUS", "RW": "RWA", "RS": "SRB", "TL": "TLS", "RE": "REU", "TM": "TKM", "TJ": "TJK", "RO": "ROU", "TK": "TKL", "GW": "GNB", "GU": "GUM", "GT": "GTM", "GS": "SGS", "GR": "GRC", "GQ": "GNQ", "GP": "GLP", "JP": "JPN", "GY": "GUY", "GG": "GGY", "GF": "GUF", "GE": "GEO", "GD": "GRD", "GB": "GBR", "GA": "GAB", "SV": "SLV", "GN": "GIN", "GM": "GMB", "GL": "GRL", "GI": "GIB", "GH": "GHA", "OM": "OMN", "TN": "TUN", "JO": "JOR", "HR": "HRV", "HT": "HTI", "HU": "HUN", "HK": "HKG", "HN": "HND", "HM": "HMD", "VE": "VEN", "PR": "PRI", "PS": "PSE", "PW": "PLW", "PT": "PRT", "SJ": "SJM", "PY": "PRY", "IQ": "IRQ", "PA": "PAN", "PF": "PYF", "PG": "PNG", "PE": "PER", "PK": "PAK", "PH": "PHL", "PN": "PCN", "PL": "POL", "PM": "SPM", "ZM": "ZMB", "EH": "ESH", "EE": "EST", "EG": "EGY", "ZA": "ZAF", "EC": "ECU", "IT": "ITA", "VN": "VNM", "SB": "SLB", "ET": "ETH", "SO": "SOM", "ZW": "ZWE", "SA": "SAU", "ES": "ESP", "ER": "ERI", "ME": "MNE", "MD": "MDA", "MG": "MDG", "MF": "MAF", "MA": "MAR", "MC": "MCO", "UZ": "UZB", "MM": "MMR", "ML": "MLI", "MO": "MAC", "MN": "MNG", "MH": "MHL", "MK": "MKD", "MU": "MUS", "MT": "MLT", "MW": "MWI", "MV": "MDV", "MQ": "MTQ", "MP": "MNP", "MS": "MSR", "MR": "MRT", "IM": "IMN", "UG": "UGA", "TZ": "TZA", "MY": "MYS", "MX": "MEX", "IL": "ISR", "FR": "FRA", "IO": "IOT", "SH": "SHN", "FI": "FIN", "FJ": "FJI", "FK": "FLK", "FM": "FSM", "FO": "FRO", "NI": "NIC", "NL": "NLD", "NO": "NOR", "NA": "NAM", "VU": "VUT", "NC": "NCL", "NE": "NER", "NF": "NFK", "NG": "NGA", "NZ": "NZL", "NP": "NPL", "NR": "NRU", "NU": "NIU", "CK": "COK", "XK": "XKX", "CI": "CIV", "CH": "CHE", "CO": "COL", "CN": "CHN", "CM": "CMR", "CL": "CHL", "CC": "CCK", "CA": "CAN", "CG": "COG", "CF": "CAF", "CD": "COD", "CZ": "CZE", "CY": "CYP", "CX": "CXR", "CR": "CRI", "CW": "CUW", "CV": "CPV", "CU": "CUB", "SZ": "SWZ", "SY": "SYR", "SX": "SXM", "KG": "KGZ", "KE": "KEN", "SS": "SSD", "SR": "SUR", "KI": "KIR", "KH": "KHM", "KN": "KNA", "KM": "COM", "ST": "STP", "SK": "SVK", "KR": "KOR", "SI": "SVN", "KP": "PRK", "KW": "KWT", "SN": "SEN", "SM": "SMR", "SL": "SLE", "SC": "SYC", "KZ": "KAZ", "KY": "CYM", "SG": "SGP", "SE": "SWE", "SD": "SDN", "DO": "DOM", "DM": "DMA", "DJ": "DJI", "DK": "DNK", "VG": "VGB", "DE": "DEU", "YE": "YEM", "DZ": "DZA", "US": "USA", "UY": "URY", "YT": "MYT", "UM": "UMI", "LB": "LBN", "LC": "LCA", "LA": "LAO", "TV": "TUV", "TW": "TWN", "TT": "TTO", "TR": "TUR", "LK": "LKA", "LI": "LIE", "LV": "LVA", "TO": "TON", "LT": "LTU", "LU": "LUX", "LR": "LBR", "LS": "LSO", "TH": "THA", "TF": "ATF", "TG": "TGO", "TD": "TCD", "TC": "TCA", "LY": "LBY", "VA": "VAT", "VC": "VCT", "AE": "ARE", "AD": "AND", "AG": "ATG", "AF": "AFG", "AI": "AIA", "VI": "VIR", "IS": "ISL", "IR": "IRN", "AM": "ARM", "AL": "ALB", "AO": "AGO", "AQ": "ATA", "AS": "ASM", "AR": "ARG", "AU": "AUS", "AT": "AUT", "AW": "ABW", "IN": "IND", "AX": "ALA", "AZ": "AZE", "IE": "IRL", "ID": "IDN", "UA": "UKR", "QA": "QAT", "MZ": "MOZ"}
function InitPublicationsPerCountry() {
$.ajax({
type: "get",
        url: "http://localhost:9200/anhalytics_fulltextteis/_search",
        data: {source: elasticSearchAggQuery3()},
        //processData: true, 
        dataType: "jsonp",
        success: function (data) {

        var touchdowns = data.aggregations.country.buckets;
                var margin = {top: 10, right: 20, bottom: 10, left: 20},
                width = 800 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;
                // We need to colorize every country based on "numberOfWhatever"
                // colors should be uniq for every value.
                // For this purpose we create palette(using min/max series-value)
                var onlyValues = touchdowns.map(function(obj){ return obj.doc_count; });
                var minValue = Math.min.apply(null, onlyValues),
                maxValue = Math.max.apply(null, onlyValues);
                // create color palette function
                // color can be whatever you wish
                var paletteScale = d3.scaleLinear()
                .domain([minValue, maxValue])
                .range(["#EFEFFF", "#02386F"]); // blue color


                var arrayLength = touchdowns.length;
                var dataset = {};
                var entry = {};
                for (var i = 0; i < arrayLength; i++) {
        dataset[iso3[touchdowns[i].key]] = {numberOfThings : touchdowns[i].doc_count, fillColor: paletteScale(touchdowns[i].doc_count)};
        }
        var margin = {top: 10, right: 10, bottom: 20, left: 30},
                width = 370 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom;
                var map = new Datamap({
                element: document.getElementById('chart-01'),
                        projection: 'mercator',
                        height: null,
                        width: null,
                        fills: { defaultFill: '#F5F5F5' },
                        data: dataset,
                        geographyConfig: {
                        borderColor: '#DEDEDE',
                                highlightBorderWidth: 2,
                                // don't change color on mouse hover
                                highlightFillColor: function(geo) {
                                return geo['fillColor'] || '#F5F5F5';
                                },
                                // only change border
                                highlightBorderColor: '#B7B7B7',
                                // show desired information in tooltip
                                popupTemplate: function(geo, data) {
                                // don't show tooltip if country don't present in dataset
                                if (!data) { return ['<div class="hoverinfo">',
                                        '<strong>', geo.properties.name, '</strong>',
                                        '</div>'].join(''); }
                                // tooltip content
                                return ['<div class="hoverinfo">',
                                        '<strong>', geo.properties.name, '</strong>',
                                        '<br>Count: <strong>', data.numberOfThings, '</strong>',
                                        '</div>'].join('');
                                }
                        }
                })

        }});
//
//                var projection = d3.geo.kavrayskiy7()
//                .scale(150)
//                .translate([width / 2, height / 2])
//                .precision(.1);
//                var path = d3.geo.path()
//                .projection(projection);
//                var graticule = d3.geo.graticule();
//                var svg = d3.select("#chart-01").append("svg")
//                .attr("width", width)
//                .attr("height", height);
//                svg.append("defs").append("path")
//                .datum({type: "Sphere"})
//                .attr("id", "sphere")
//                .attr("d", path);
//                svg.append("use")
//                .attr("class", "stroke")
//                .attr("xlink:href", "#sphere");
//                svg.append("use")
//                .attr("class", "fill")
//                .attr("xlink:href", "#sphere");
//                svg.append("path")
//                .datum(graticule)
//                .attr("class", "graticule")
//                .attr("d", path);
//                d3.json("data/world-50m.json", function(error, world) {
//                if (error) throw error;
//                        var countries = topojson.feature(world, world.objects.countries).features,
//                        neighbors = topojson.neighbors(world.objects.countries.geometries);
//                        svg.selectAll(".country")
//                        .data(countries)
//                        .enter().insert("path", ".graticule")
//                        .attr("class", "country")
//                        .attr("d", path)
//                        .style("fill",
//                                //function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); }
//                                //
//                                "#ABDDA4")
//                            .on("click", function(d) {
//			   		console.log(d);
//			   })    
//                    
//                    ;
//                        svg.insert("path", ".graticule")
//                        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
//                        .attr("class", "boundary")
//                        .attr("d", path);
//                        });
//                d3.select(self.frameElement).style("height", height + "px");

//}
//});
        }


function arrayUnique(array) {
var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
for (var j = i + 1; j < a.length; ++j) {
if (a[i] === a[j])
        a.splice(j--, 1);
}
}

return a;
        }

function InitPublicationsPerAffiliation() {
$.ajax({
type: "get",
        url: "http://localhost:9200/anhalytics_fulltextteis_in/_search",
        data: {source: elasticSearchAggQuery2()},
        //processData: true, 
        dataType: "jsonp",
        success: function (data) {

        var touchdowns = data.aggregations.Organisation.buckets;
                var dataentry = new Array(touchdowns.length);
                var authors = [];
                for (var i = 0; i < touchdowns.length; ++i){
                    for(var o = 0 ;o < touchdowns[i].authors.buckets.length; ++o){
                    
        authors = arrayUnique(authors.concat(touchdowns[i].authors.buckets[o].key));
                }
                dataentry[i] = {"x" : i, "name" : touchdowns[i].key, "y": 0, "key" : ""};
        }

//console.log(authors);

var dataset = new Array(touchdowns.length);
for (var i = 0; i < touchdowns.length; i++){
    var entry = {"aff" : touchdowns[i].key , "doc_count":touchdowns[i].doc_count};
    
    for(var j=0;j < authors.length; j++){
        entry[authors[j]] = 0;
    }
    
    for(var j=0;j < touchdowns[i].authors.buckets.length; j++){
        entry[touchdowns[i].authors.buckets[j].key] = touchdowns[i].authors.buckets[j].doc_count;
    }
    dataset[i] = entry;
}

//        var dataset = new Array(authors.length);
//                var dataentry1 = [];
//                for (var i = 0; i < authors.length; i++){
//        var dataentry1 = JSON.parse(JSON.stringify(dataentry));
//                for (var j = 0; j < dataentry1.length; j++){
//        dataentry1[j].key = authors[i].key;
//        }
//        dataset[i] = dataentry1
//        }
//        for (var i = 0; i < dataset.length; ++i){
//
//        for (var j = 0; j < dataset[i].length; ++j){
//        var result = touchdowns.filter(function(obj) {
//        return obj.key == dataset[i][j].name;
//        });
//                for (var o = 0; o < result[0].authors.buckets.length; ++o){
//        var key = result[0].authors.buckets[o].key;
//                var count = result[0].authors.buckets[o].doc_count;
//                var result1 = dataset.filter(function(obj) {
//                return obj[0].key == key;
//                });
//                var result2 = result1[0].filter(function(obj) {
//        return obj.name == dataset[i][j].name;
//        });
//                result2[0].y = count;
//        }
//        }
//        }


//console.log(dataset);

        var margin = {top: 10, right: 10, bottom: 20, left: 30},
                w = 500 - margin.left - margin.right,
                h = 800 - margin.top - margin.bottom,
                svg = d3.select("#chart-04").append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom),
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//                var stack = d3.layout.stack();
//                stack(dataset);
                
                var x = d3.scaleBand().domain(d3.range(dataset.length))
    .rangeRound([0, w], 0.05);
        
                
    var yScale = d3.scaleLinear()
                    .domain([0,
                        d3.max(touchdowns, function (d) {
                            return d3.max(d.authors.buckets, function (d) {
                                return d.doc_count0 + d.doc_count;
                            });
                        })
                    ])
                    .range([0, h]);            
                
var y = d3.scaleLinear()
    .rangeRound([h, 0]);
    
    var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
     
            
            var stack = d3.stack();
            dataset.sort(function(a, b) { return b.doc_count - a.doc_count; });
            
            x.domain(dataset.map(function(d) { return d.aff; }));
            y.domain([0, d3.max(dataset, function(d) { return d.doc_count; })]).nice();
            z.domain(authors);
            var dataset = stack.keys(authors)(dataset);          
            
            g.selectAll(".serie")
    .data(dataset)
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
      
      
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.aff); })
      .attr("y", function(d) { return y(d[1]);})
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());
            
            
            g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(2, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text("doc_count");
      
var legend = g.selectAll(".legend")
    .data(authors.reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .style("font", "10px sans-serif");

  legend.append("rect")
      .attr("x", w - 18)
      .attr("width", 8)
      .attr("height", 9)
      .attr("fill", z);

  legend.append("text")
      .attr("x", w - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d; });
        
//    });
        }
});
        }

function type(d) {
d.frequency = + d.frequency;
        return d;
        }


function InitPublicationsPerYear() {


$.ajax({
type: "get",
        url: "http://localhost:9200/anhalytics_fulltextteis/_search",
        data: {source: elasticSearchAggQuery1()},
        //processData: true, 
        dataType: "jsonp",
        success: function (data) {
        var margin = {top: 10, right: 10, bottom: 50, left: 30},
                width = 370 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom;
                var touchdowns = data.aggregations.publication_date.buckets;
                var parseDate = d3.timeParse("%Y-%m-%d");
                touchdowns.forEach(function (d) {
                d.key_as_string = parseDate(d.key_as_string);
                        d.doc_count = + d.doc_count;
                });
                //console.log(touchdowns);

                var x = d3.scaleTime()

                x.domain(d3.extent(touchdowns, function (d) {
                return d.key_as_string;
                })).range([0, width], .3);
                var y = d3.scaleLinear()


                y.domain(d3.extent(touchdowns, function (d) {
                return d.doc_count;
                })).range([height, 0], .3);
                var xAxis = d3.axisBottom(x);
                var yAxis = d3.axisLeft(y);
                var line = d3.line()
                .x(function (d) {
                return x(d.key_as_string);
                })
                .y(function (d) {
                return y(d.doc_count);
                });
                var svg = d3.select("#chart-03").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                var xGuide = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height + 5) + ")")
                //.attr('transform', 'rotate(90)')
                .call(xAxis)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                //.attr('opacity', 0)
                .style("text-anchor", "start");
                var yGuide = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");
                var animateLine = svg.append("path")
                .datum(touchdowns)
                .attr("class", "line")
                .attr("d", line)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        }
});
        }


function InitPublicationsPerTopic() {
$.ajax({
type: "get",
        url: "http://localhost:9200/anhalytics_fulltextteis/_search",
        data: {source: elasticSearchAggQuery4()},
        //processData: true, 
        dataType: "jsonp",
        success: function (data) {

        var touchdowns = data.aggregations.country.buckets;
                var margin = {top: 10, right: 10, bottom: 20, left: 30},
                width = 370 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom;
//                var bubbleChart = new d3.svg.BubbleChart({
//                supportResponsive: true,
//                        //container: => use @default
//                        size: 600,
//                        //viewBoxSize: => use @default
//                        innerRadius: 600 / 3.5,
//                        //outerRadius: => use @default
//                        radiusMin: 50,
//                        //radiusMax: use @default
//                        //intersectDelta: use @default
//                        //intersectInc: use @default
//                        //circleColor: use @default
//                        });

        }});
}


InitPublicationsPerAffiliation();
        InitPublicationsPerYear();
        InitPublicationsPerCountry();



