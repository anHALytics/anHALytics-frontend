jQuery(document).ready(function($) {
            var url_options = $.getUrlVars();
            var query = '{\
  "query": {\
    "filtered": {\
      "query": {\
        "match_all": {}\
      },\
      "filter": {\
        "term": {\
          "_id": "'+url_options.authorID+'"\
        }\
      }\
    }\
  }\
}"'
    showresults = function (sdata) {console.log(sdata)
        if (sdata.hits.total) {
            $('#fullname').html(sdata.hits.hits[0]._source.fullname);
            $('#title').html(sdata.hits.hits[0]._source.title);
            $('#phone').html(sdata.hits.hits[0]._source.phone);
            $('#email').html(sdata.hits.hits[0]._source.email);
            $('#url').html(sdata.hits.hits[0]._source.url);
            $('#url').attr("href",sdata.hits.hits[0]._source.url);
            if(sdata.hits.hits[0]._source.photo)
                $("#profile-avatar").attr("src",sdata.hits.hits[0]._source.photo);
        }else
            alert("author not found!");
    
    };
    showerror = function( xhr, status ) {
            alert( "Sorry, there was a problem!" );
            };
    $.ajax({
                    type: "get",
                    url: "http://localhost:9200/anhalytics/_search",
                    data: {source: query},
                    // processData: false,
                    dataType: "jsonp",
                    success: showresults,
                    error: showerror
                });
            });