var defaults = {
    // disambiguation
    host_nerd: "traces1.inria.fr/nerd",
    // host_nerd: "cloud.science-miner.com",
    port_nerd: "",

     // grobid-quantities
    host_quantities: "traces2.saclay.inria.fr",
    port_quantities: "8090",

    // proxy
    service: "local", // access to service can be local or proxy, depending on security requirements
    proxy_host: "",

    // elasticsearch
    anhalytics_rest : 'http://localhost:8090/pdf',

    // elasticsearch
    es_host : 'http://localhost:9200',
//    es_host : 'http://traces2.saclay.inria.fr',
    fulltext_index: 'anhalytics_hal_teis', // the URL against which to submit searches
//    fulltext_index: 'quantities', // the URL against which to submit searches
    quantities_annotation_index: 'annotations_quantities',
    quantities_annotation_type: 'quantities',
    nerd_annotation_index: 'annotations_nerd',
    kb_index: 'anhalytics_kb',
    authors_type: 'authors',
    publications_type: 'publications',
    organisations_type: 'organisations',
    search_index: 'elasticsearch',

    // a query parameter added to each query to the search engine
    query_parameter: "q", // the query parameter if required for setting to the search URL

    // the type of collection, value can be one of {npl, patent}
    collection: 'npl',

    // the name of the sub-collection to be searched, for instance hal or istex for npl, epodoc for patent
    subcollection: 'hal',

    // snippet ranking
    snippet_style: 'andlauer',

    // in case search is triggered automatically
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

    // wikipedia image service
    wikimediaURL_EN: 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=200&pageids=',
    wikimediaURL_FR: 'https://fr.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=200&pageids=',
    wikimediaURL_DE: 'https://de.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=200&pageids=',

    imgCache: {}
};
