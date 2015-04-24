var CDNUsageReport = CDNUsageReport || {};

CDNUsageReport.util =(function () {
    
    var cache = {
        urlParsing: {
        }
    };

    var URLParser = {
        clear: function () {
            cache.urlParsing = {
	        originURL: "",
	        virtualPath: "",
	        section: "",
	        page: null,
                sort: {},
                parameters: []
            };
        },
        getSection: function () {
            return cache.urlParsing.section;
        },
        getPage: function () {
	    return cache.urlParsing.page;
        },
        getSort: function () {
	    return cache.urlParsing.sort;
        },
        trackSpecifyInfo: function (param) {
            var ref = param.toLowerCase();
	    if(cache.urlParsing.page === null && /^page[0-9]*$/.test(ref)) {
		cache.urlParsing.page = parseInt(param.substr(4));
                return;
            }

            if($.isEmptyObject(cache.urlParsing.sort) &&/^sort[a-zA-Z]+$/.test(ref)) {
                var field = param.substr(4);
		cache.urlParsing.sort.desc = true;
                if(/[a-zA-Z]+desc$/.test(ref)) {
		    field = field.substr(0, field.length -4);
                } else if(/[a-zA-Z]+asc$/.test(ref)) {
		    cache.urlParsing.sort.desc = false;
		    field = field.substr(0, field.length -3);
                }
	        cache.urlParsing.sort.field = field;
                return;
            }
        
	    if(!cache.urlParsing.section && /^[a-zA-Z]*$/.test(param)) {
                cache.urlParsing.section = param;
            }
        },
	parseURL: function (url) {
            this.clear();
	    cache.urlParsing.originURL = url;
            if(url.indexOf("#") > 0) {
                 cache.urlParsing.virtualPath = url.substr(url.indexOf("#") + 1);
                 var arr = cache.urlParsing.virtualPath.split("/");
                 for(var i=0; i<arr.length; i ++) {
                     var param = arr[i].trim();
                     if(!param) {
                         continue;
                     }
                     cache.urlParsing.parameters.push(param);
                     this.trackSpecifyInfo(param);
                 }
            }
        },
        getVirtualPath: function () {
            var path = cache.urlParsing.parameters.join("/");
            return path;
        },
        getParam: function () {
            return cache.urlParsing.parameters;
        }
    };
    
    return {
        logError: function (err) {
            if(console && console.log) {
                 console.log(err);
            }
        },
        URLParser: URLParser
    };
})();
CDNUsageReport.cache = {};
CDNUsageReport.showAbout = function () {
    var me = this;
    $.ajax({
       url: "README.md",
       dataType: "html"
    }).done(function (data) {
       me.cache.$content.html(data);
    });
}

CDNUsageReport.showOverAll = function () {
    var me = this;
    me.cache.displayList = me.cache.source;
    var statistic = new CDNUsageReport.Models.Statistic(me.cache.displayList);
    var $statistic = CDNUsageReport.Views.UssageView.renderDetailDialog(statistic);
    me.cache.$content.empty();
    me.cache.$content.append($statistic);
    var $canvas = me.cache.$content.find("canvas");
    CDNUsageReport.Views.ChartsMaker.createBytesCachedPie($canvas[0], statistic);
    CDNUsageReport.Views.ChartsMaker.createRequestCachedPie($canvas[1], statistic);
}

CDNUsageReport.showAllCases = function () {
    var me = this;
    me.cache.displayList = me.cache.source;
    var $grids = CDNUsageReport.Views.UssageView.renderList(me.cache.displayList, {href: "#allcase"});
    me.cache.$content.empty();
    me.cache.$content.append($grids);
}

CDNUsageReport.showWebsites = function () {
    var me = this;
    var websites = {};
    var iLen = me.cache.source.length;
    for(var i=0;i<iLen;i++) {
        var useCase = me.cache.source[i];
        var resourceId = useCase.resourceId;
        if(!websites.hasOwnProperty(useCase.resourceId)) {
             websites[resourceId] = [];
        }
        websites[resourceId].push(useCase);
    }

    me.cache.displayList = [];
    for(var resourceId in websites) {
        me.cache.displayList.push(new CDNUsageReport.Models.Statistic(websites[resourceId]));
    }
    me.cache.$content.empty();

    var $canvas = $("<canvas></canvas>");
    me.cache.$content.append($canvas);
    var option = {labelAs: "resourceId"};
    CDNUsageReport.Views.ChartsMaker.createBarChart($canvas, me.cache.displayList, option);
    var option = {
        href: "#website",
        columns: {
	    resource: true,
	    publisher: true,
	    edge: false,
	    bytesCached: true,
	    requestCached: true
        }
    };
    
    var $grids = CDNUsageReport.Views.UssageView.renderList(me.cache.displayList, option);
    me.cache.$content.append($grids);
}

CDNUsageReport.showEdgeSevers = function () {
    var me = this;
    var edgeServers = {};
    var iLen = me.cache.source.length;
    for(var i=0;i<iLen;i++) {
        var useCase = me.cache.source[i];
        var edgeId = useCase.edgeId;
        if(!edgeServers.hasOwnProperty(useCase.edgeId)) {
             edgeServers[edgeId] = [];
        }
        edgeServers[edgeId].push(useCase);
    }

    me.cache.displayList = [];
    for(var edgeId in edgeServers) {
        me.cache.displayList.push(new CDNUsageReport.Models.Statistic(edgeServers[edgeId]));
    }
    me.cache.$content.empty();

    var option = {
        href: "#edge",
        columns: {
	    resource: false,
	    publisher: false,
	    edge: true,
	    bytesCached: true,
	    requestCached: true
        },
        detail: {
            label: "<button>Detail</button>",
            click: function (evt, useCase) {
                var $messageBlock = $("<div></div>");
                $messageBlock.css({
                    height: "80%",
                    width: "90%",
                    position: "fixed",
                    top: "10%",
                    left: "5%",
                    "text-align": "center",
                    "background-color": "#fff",
                    "z-index": 2
                });

                var $useCase = CDNUsageReport.Views.UssageView.renderDetailDialog(useCase);
                var $canvas = $useCase.find("canvas");
                $canvas.attr("width", 200);
                $canvas.attr("height",200);
                $messageBlock.append($useCase);
                var $closeButton = $("<button>Close</button>");
                $closeButton.on("click", function() {
                    $messageBlock.hide();
                    $messageBlock.remove();
		    overlay.hide();
                });
                $messageBlock.append($closeButton);
                $("body").append($messageBlock);
                CDNUsageReport.Views.ChartsMaker.createBytesCachedPie($canvas[0], useCase);
                CDNUsageReport.Views.ChartsMaker.createRequestCachedPie($canvas[1], useCase);
                var overlay = new Overlay({
                css: {
                 "z-index": 1
                },
                click: function () {
                    $messageBlock.hide();
                    $messageBlock.remove();
                }
                });
                overlay.show();
            }
        }
        
    };
    
    var $grids = CDNUsageReport.Views.UssageView.renderList(me.cache.displayList, option);
    me.cache.$content.append($grids);
}

CDNUsageReport.init = function (option) {
    var option = option || {};
    var methods = {};
    var me = this;
    var settings = {
       paths: {
          about: "README.md",
          api: "assets/sample.json"
       },
       menuItems: [
           {label: "Sumary", href: "#", click: function (evt) {
                me.showOverAll();
           }},
           {label: "Website", href: "#website", click: function (evt) {
                me.showWebsites();
           }},
           {label: "Edge Servers", href: "#edge", click: function (evt) {
                me.showEdgeSevers();
           }},
           {label: "All Cases", href: "#allcase", click: function (evt) {
                me.showAllCases();
           }},
           {label: "About", href:"#about", click: function (evt) {
                me.showAbout();
           }}
       ]
    };

    if(option.api) {
        settings.paths.api = option.api;
    }

    if(option.content) {
         me.cache.$content = $(option.content);
    }

    CDNUsageReport.Views.Menu.init(option.menu);
    $(settings.menuItems).each(function (index, item) {
        var $item = $({}).extend(item);// Clone the object
	CDNUsageReport.Views.Menu.addItem($item);
    });

    $(document).ready(function () {
        me.start(settings.paths.api);
    });

}

CDNUsageReport.parseURL = function () {
     CDNUsageReport.util.URLParser.parseURL(window.location.href);
     switch(CDNUsageReport.util.URLParser.getSection()) {
        case "allcase":
            CDNUsageReport.Views.Menu.setActive("allcase");
            this.showAllCases();
            break;
        case "website":
            CDNUsageReport.Views.Menu.setActive("website");
            this.showWebsites();
            break;
        case "edge":
            CDNUsageReport.Views.Menu.setActive("edge");
            this.showEdgeSevers();
            break;
        case "about":
            CDNUsageReport.Views.Menu.setActive("about");
            this.showAbout();
            break;
	default:
            CDNUsageReport.Views.Menu.setActive("");
            this.showOverAll();
            break;
     }
}

CDNUsageReport.start = function (api) {
    var me = this;
    $.ajax({
        url: api,
        dataType: "json"
    }).done(function (data) {
        me.cache.source = [];
        $(data).each(function (index, useCase) {
             try {
                 var caseModel = new me.Models.UseCaseModel(useCase);
                 me.cache.source.push(caseModel);
             }
             catch(err) {
                 me.util.logError("Error occur while parsing " + index + " data from the source");
		 me.util.logError(err);
             }
        });
        me.parseURL();
    });
}


