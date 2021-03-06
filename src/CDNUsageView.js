/**
 * View for CDN ussage report
 * By right it should take place of the presentation but dual to limited time. It only some templating function
*/
var CDNUsageReport = CDNUsageReport || {};
CDNUsageReport.Views = CDNUsageReport.Views || {};
CDNUsageReport.Views.Menu = (function () {
    var cache = {};    
    var methods = {};
    methods.clear = function () {
        cache.$mobileToggleSwitch.remove();
        cache.$itemHolder.remove();
        cache.$menuBar.empty();
        cache = {};
    }
    
    methods.isMobileMenuOn = function () {
        return cache.$itemHolder.hasClass("mobile-on");
    }

    methods.hideMobileMenu = function () {
        cache.$mobileToggleSwitch.text(">");
        cache.$itemHolder.removeClass("mobile-on");
    }
    
    methods.showMobileMenu = function () {
        cache.$mobileToggleSwitch.text("X");
        cache.$itemHolder.addClass("mobile-on");
    }

    methods.createMobileToggleSwitch = function () {
        if(cache.mobileToggleSwitch) {
            return;
        }
        cache.$mobileToggleSwitch = $("<div class='mobile-menu-toggle'> > </div>");
        cache.$menuBar.append(cache.$mobileToggleSwitch);
        cache.$mobileToggleSwitch.on("click", function () {
             if(methods.isMobileMenuOn()) {
                  methods.hideMobileMenu();
             } else {
                  methods.showMobileMenu();
             }
        });
    }

    methods.initMenu = function () {
        cache.$menuBar.empty();
        cache.$itemHolder = $("<ul class='menu'></ul>");
        cache.$menuBar.append(cache.$itemHolder);
        methods.createMobileToggleSwitch();
    }
    methods.setMenuPlace = function (menu) {
       cache.$menuBar = $(menu);
       methods.initMenu();
    }

    methods.buildMenuBar = function () {
        if(cache.$menuBar) {
            return;
        }
        var $bar = $("<nav></nav>");
        $("body").prepend($bar);
        methods.setMenuPlace($bar);
    }
    
    methods.setActive = function (section) {
        cache.$itemHolder.find(".active").removeClass("active");
        var $item = cache.$itemHolder.find("a[href='#" + section + "']").parent();
        $item.addClass("active");
    }

    methods.addItem = function (info) {
        if(!info) {
            throw new Error("Nothing pass-in when create menu item.");
        }
        var $item = $("<span></span>");
        $item.text(info.label);
        if(info.href) {
            $item = $("<a></a>").append($item);
            $item.attr("href", info.href);
        }
        var $item = $("<li></li>").append($item);
        $item.on("click", function (evt) {
            methods.hideMobileMenu();
            cache.$itemHolder.find(".active").removeClass("active");
            $item.addClass("active");
            if(info.click) {
                info.click(evt);
            }
            
        });
        cache.$itemHolder.append($item);
    }

    return {
       init: function (menu) {
           if(menu) {
               methods.setMenuPlace(menu);
           } else {
               methods.buildMenuBar();
           }
       },
       clear: methods.clear,
       addItem: methods.addItem,
       setActive: methods.setActive
    };
})();

CDNUsageReport.Views.settings = {
    pieChartHeight: 250,
    pieChartWidth: 250,
    cachedColor: "#46BFBD",
    notCachedColor: "#F7464A",
    cachedHilightColor: "#5AD3D1",
    notCachedHilightColor: "#FF5A5E"
};


CDNUsageReport.Views.UssageView = (function () {
        var settings = CDNUsageReport.Views.settings;
	var defaultColumnsSetting = {	resource: true,
					publisher: true,
					edge: true,
					bytesCached: true,
					requestCached: true
				};

	var labels = {
		resource: "Website",
		publisher: "User",
		edge: "Edge Server",
		bytesCached: "Bytes Cached",
		requestCached: "Request Cached"
	}

	return {
		getLabels: function () {
			return labels;
		},
		renderGridHeader: function (option) {
			var option = option || {};
			if(!option.columns) {
				option.columns = defaultColumnsSetting;
			}
			var $row = $("<div class='grid-header'></div>");
			if(option.columns.resource) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.resource);
				$row.append($cell);
			}
			if(option.columns.publisher) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.publisher);
				$row.append($cell);
			}
			if(option.columns.edge) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.edge);
				$row.append($cell);
			}
			if(option.columns.bytesCached) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.bytesCached);
				$row.append($cell);
			}
			if(option.columns.requestCached) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.requestCached);
				$row.append($cell);
			}
			return $row;
		},
		renderRow: function (useCase, option) {
			var option = option || {};
			if(!option.columns) {
				option.columns = defaultColumnsSetting;
			}
			var $row = $("<div class='grid-row'></div>");
			if(option.columns.resource) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.resourceId);
				$row.append($cell);
			}
			if(option.columns.publisher) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.publisherId);
				$row.append($cell);
			}
			if(option.columns.edge) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.edgeId);
				$row.append($cell);
			}
			if(option.columns.bytesCached) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.getCachedPercentage().toLocaleString() + "%");
				$row.append($cell);
			}
			if(option.columns.requestCached) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.getRequestCachePercentage().toLocaleString() + "%");
				$row.append($cell);
			}

                        if(option.detail) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.html(option.detail.label);
                                if(option.detail.click) {
                                    $cell.on("click", function (evt) {
                                          option.detail.click(evt,useCase);
                                    });
                                }
				$row.append($cell);
                        }


			return $row;
		},
		renderDetailDialog: function (useCase, option) {
			var option = option || {};
			if(!option.columns) {
				option.columns = defaultColumnsSetting;
			}
			var $table = $("<div class='grid'></div>");
			if(option.columns.resource && useCase.resourceId) {
				var $row = $("<div class='grid-row'></div>");
				$row.append("<div class='grid-cell'></div>");
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.resource);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.resourceId);
				$row.append($cell);
				$table.append($row);
			}

			if(option.columns.publisher && useCase.publisherId) {
				var $row = $("<div class='grid-row'></div>");
				$row.append("<div class='grid-cell'></div>");
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.publisher);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.publisherId);
				$row.append($cell);
				$table.append($row);
			}

			if(option.columns.edge && useCase.edgeId) {
				var $row = $("<div class='grid-row'></div>");
				$row.append("<div class='grid-cell'></div>");
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.edge);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.edgeId);
				$row.append($cell);
				$table.append($row);
			}

			if(option.columns.bytesCached) {
				var $row = $("<div class='grid-row'></div>");
				var $cell = $("<div class='grid-cell'></div>");
                                var $canvas = $("<canvas width='" + settings.pieChartWidth + "' height='" + settings.pieChartHeight + "' />");
                                $cell.append($canvas);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.bytesCached);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.getCachedPercentage().toLocaleString() + "%");
				$row.append($cell);
				$table.append($row);
			}

			if(option.columns.requestCached) {
				var $row = $("<div class='grid-row'></div>");
				var $cell = $("<div class='grid-cell'></div>");
                                var $canvas = $("<canvas width='" + settings.pieChartWidth + "' height='" + settings.pieChartHeight + "' />");
                                $cell.append($canvas);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.requestCached);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.getRequestCachePercentage().toLocaleString() + "%");
				$row.append($cell);
				$table.append($row);
			}
			return $table;
		},
		renderList: function (useCases, option) {

			var option = option || {};
			if(!option.columns) {
				option.columns = defaultColumnsSetting;
			}

			var $grid = $("<div class='grid'></div>");
			var $header = this.renderGridHeader(option);
			$grid.append($header);
			
			var iLen = useCases.length;
			for(var i=0;i<iLen;i++) {
				var $row = this.renderRow(useCases[i], option);
				$grid.append($row);
			}
			return $grid;
		}
	};
})();

CDNUsageReport.Views.ChartsMaker = (function () {
     var settings = CDNUsageReport.Views.settings;
     var methods = {};
     return {
         createBytesCachedPie: function (canvas, statistic) {
              var chartData = [
                 {
		    value: statistic.bytesCached,
                    color: settings.cachedColor,
                    highlight: settings.cachedHilightColor,
                    label: "Bytes in cached"
                 },
                 {
		    value: statistic.bytesNotCached,
                    color: settings.notCachedColor,
                    highlight: settings.notCachedHilightColor,
                    label: "Bytes not in cached"
                 }
              ];
              var cachedPie = new Chart(canvas.getContext("2d")).Pie(chartData);
              return cachedPie
         },
         createRequestCachedPie: function (canvas, statistic) {
              var chartData = [
                 {
		    value: statistic.requestsCached,
                    color: settings.cachedColor,
                    highlight: settings.cachedHilightColor,
                    label: "Bytes in cached"
                 },
                 {
		    value: statistic.requestsNotCached,
                    color: settings.notCachedColor,
                    highlight: settings.notCachedHilightColor,
                    label: "Bytes not in cached"
                 }
              ];
              var cachedPie = new Chart(canvas.getContext("2d")).Pie(chartData);
              return cachedPie
         },
         createBarChart: function ($canvas, useCases, option) {
              var option = option || {};
              if(!option.labelAs) {
                  option.labelAs = "resourceId";
              }
              var labels = [];
              var bytesCached = [];
              var reqCached = [];
              var iLen = useCases.length;
              for(var i=0;i<iLen; i++) {
                  var useCase = useCases[i];
                  var label = useCase.resourceId;
                  switch(option.labelAs) {
                      case "publisherId":
                          label = useCase.publisherId;
                          break;
                      case "publisherId":
                          label = useCase.edgeId;
                          break;
                  }
                  labels.push(label);
 	          bytesCached.push(useCase.getCachedPercentage());
 	          reqCached.push(useCase.getRequestCachePercentage());
              }
              var data = {
	          labels: labels,
                  datasets: [
                      {
                          labels: "Bytes in cached",
	                  fillColor: "rgba(220,220,220,0.5)",
	                  strokeColor: "rgba(220,220,220,0.8)",
	                  highlightFill: "rgba(220,220,220,0.75)",
	                  highlightStroke: "rgba(220,220,220,1)",
	                  data: bytesCached
                      },
                      {
                          labels: "Bytes in cached",
	                  fillColor: "rgba(151,187,205,0.5)",
	                  strokeColor: "rgba(151,187,205,0.8)",
	                  highlightFill: "rgba(151,187,205,0.75)",
	                  highlightStroke: "rgba(151,187,205,1)",
	                  data: reqCached
                      }
                  ]
              };
              $canvas.attr("height", 400);
              $canvas.attr("width", 400);
              return new Chart($canvas[0].getContext("2d")).Bar(data);
         }
     };
})();

