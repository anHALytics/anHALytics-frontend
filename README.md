# AnHALytics Frontends

[![License](http://img.shields.io/:license-apache-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

AnHALytics is a project aiming at creating an analytic platform for the [HAL research archive](https://hal.archives-ouvertes.fr) or other scientific Open Access repositories, exploring various analytic aspects such as search/discovery, activity and collaboration statistics, trend/technology maps, knowledge graph and data visualization. The project is supported by an [ADT Inria](http://www.inria.fr/en/research/research-teams/technological-development-at-inria) grant and good will :). 

This module is dedicated to the frontends of the system. 

![View of anHALytics search and discovery front end](doc/screen1.png)

*Above: View of anHALytics search and discovery front end*

![Example of query disambiguation in the anHALytics search and discovery front end](doc/screen2.png)

*Above: Example of query disambiguation in the anHALytics search and discovery front end*

## License

This code is distributed under [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0). 

## Warning

AnHALytics is a work at early stage and a work in progress. It is evolving rapidly and is certainly not production ready! 

## People

- Achraf Azhar
- [Patrice Lopez](https://github.com/kermitt2) 

If you are interested in contributing to the project, please contact <patrice.lopez@inria.fr>. 


## Frontends

The front-end javascript web application will call ElasticSearch service. In addition, the front-end can also call the (N)ERD service for performing query disambiguation. Update the file ```js/resource/config.js``` with the elasticsearch server host/port (exposing the different indexes built by the module ```anhalytics-core```) and the (N)ERD server host/port.

Some elements of the search frontend have been inspired by [FacetView 1](https://github.com/okfn/facetview) from Open Knowledge Foundation and Cottage Labs, thanks to them!

