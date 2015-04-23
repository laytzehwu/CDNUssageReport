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
}

CDNUsageReport.showAllCases = function () {
    var me = this;
    me.cache.displayList = me.cache.source;
    var $grids = CDNUsageReport.Views.UssageView.renderList(me.cache.displayList, {href: "#allcase"});
    me.cache.$content.empty();
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


