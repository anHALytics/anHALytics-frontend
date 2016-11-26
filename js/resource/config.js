var defaults = {
    api_key: "AIzaSyBLNMpXpWZxcR9rbjjFQHn_ULbU-w1EZ5U", // this is a google key for freebase image service
    host_nerd: "traces1.saclay.inria.fr",
    port_nerd: "",
    service: "local", // access to service can be local or proxy, depending on security requirements
    proxy_host: "",
    es_host : 'http://localhost:9200',
    fulltext_index: 'anhalytics_fulltextteis', // the URL against which to submit searches
    nerd_annotation_index: 'annotations_nerd',
    kb_index: 'anhalytics_kb',
    authors_type: 'authors',
    publications_type: 'publications',
    organisations_type: 'organisations',
    search_index: 'elasticsearch',
    query_parameter: "q", // the query parameter if required for setting to the search URL
    collection: 'npl',
    subcollection: 'hal',
    snippet_style: 'andlauer',
    freetext_submit_delay: "400", // delay for auto-update of search results in ms
    use_delay: false, // if true, searches are triggered by keyup events with the above delay
                     // otherwise search is triggered by pressing enter
    display_images: true, // whether or not to display images found in links in search results    
    config_file: false, // a remote config file URL
    addremovefacets: false, // false if no facets can be added at front en
    visualise_filters: true, // whether or not to allow filter vis via d3
    //description: "", // a description of the current search to embed in the display
    default_url_params: {}, // any params that the search URL needs by default
    q: "", // default query value
    //query_field: "",
    predefined_filters: {}, // predefined filters to apply to all searches
    paging: {
        from: 0, // where to start the results from
        size: 12                   // how many results to get
    },
    mode_query: "simple", // query input, possible values: simple, complex, nl, semantic, analytics
    complex_fields: 0, // number of fields introduced in the complex query form
    wikimediaURL_EN: 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=200&pageids=',
    wikimediaURL_FR: 'https://fr.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=200&pageids=',
    wikimediaURL_DE: 'https://de.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=200&pageids=',
    imgCache: {}
};


