// the facet view object to be appended to the page
var thefacetview_simple = ' \
           <div id="facetview"> \
             <div class="row"> \
               <div class="col-md-3 nopadding"> \
                 <div id="facetview_filters"></div> \
               </div> \
               <div class="col-md-9 nopadding" id="facetview_rightcol" > \
                    <div id="facetview_searchbar" class="input-group"> \
                    <span class="input-group-addon" id="sizing-addon1"> <span class="glyphicon glyphicon-search"  aria-hidden="true"></span></span> \
                    <input type="text" class="form-control" id="facetview_freetext" name="q" value="" aria-describedby="sizing-addon1" placeholder="search term" autofocus /> \
                    <div class="input-group-btn">\
                     <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-cog"></span>\
                     <span class="caret"></span></button>\
                     <ul class="dropdown-menu">\
                     <li><a id="facetview_partial_match" href="">partial match</a></li> \
                     <li><a id="facetview_exact_match" href="">exact match</a></li> \
                     <li><a id="facetview_fuzzy_match" href="">fuzzy match</a></li> \
                     <li><a id="facetview_match_all" href="">match all</a></li> \
                     <li><a id="facetview_match_any" href="">match any</a></li> \
                     <li><a href="#">clear all</a></li> \
                     <li class="divider"></li> \
                     <li><a target="_blank" href="http://lucene.apache.org/java/2_9_1/queryparsersyntax.html">query syntax doc.</a></li> \
                     <li class="divider"></li> \
                     <li><a id="facetview_howmany" href="#">results per page ({{HOW_MANY}})</a></li> \
                     </ul> \
                    </ul>\
                    <button type="button" id="disambiguate" class="btn" disabled="true" data-toggle="button">Disamb./Expand</button> \
                    </div> \
                    </div> \
                   <div style="clear:both;" id="facetview_selectedfilters"></div> \
                   <div class="col-md-5" id="results_summary"></div> \
		   <div class="col-md-12" id="disambiguation_panel"></div> \
                 <table class="table table-striped" id="facetview_results"></table> \
                 <div id="facetview_metadata"></div> \
               </div> \
             </div> \
           </div> \
           ';