const conf = {}
conf.api      = "http://localhost/tracker/index.php/api/";
conf.prot     = "http://";
conf.base_url = conf.prot+"localhost/tracker_client/" ;
conf.js       = conf.base_url + "js/";
conf.css      = conf.base_url + "css/";
conf.pages    = conf.base_url + "pages/";
conf.debug    = true;
$.ajaxSetup({ cache: false });
