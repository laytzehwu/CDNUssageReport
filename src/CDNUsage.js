var CDNUsageReport = CDNUsageReport || {};

CDNUsageReport.util =(function () {
    
    var cache = {};

    
    return {
        logError: function (err) {
            if(console && console.log) {
                 console.log(err);
            }
        }
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
    var $grids = CDNUsageReport.Views.UssageView.renderList(me.cache.displayList);
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
        me.showOverAll();
    });
}


