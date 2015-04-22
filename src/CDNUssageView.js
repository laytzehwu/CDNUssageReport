/**
 * View for CDN ussage report
 * By right it should take place of the presentation but dual to limited time. It only some templating function
*/
var CDNUssageReport = CDNUssageReport || {};
CDNUssageReport.Views = CDNUssageReport.Views || {};
CDNUssageReport.Views.UssageView = (function () {
	var defaultColumnsSetting = {	resource: true,
					publisher: true,
					edge: true,
					bytesCached: true,
					requestCached: true
				};
	var labels = {
		resource: "Resource",
		publisher: "Website",
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
				$cell.text(useCase.getCachedPercentage() + "%");
				$row.append($cell);
			}
			if(option.columns.requestCached) {
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.getRequestCachePercentage() + "%");
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
			if(option.columns.resource) {
				var $row = $("<div class='grid-row'></div>");
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.resource);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.resourceId);
				$row.append($cell);
				$table.append($row);
			}

			if(option.columns.publisher) {
				var $row = $("<div class='grid-row'></div>");
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.publisher);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.publisherId);
				$row.append($cell);
				$table.append($row);
			}

			if(option.columns.edge) {
				var $row = $("<div class='grid-row'></div>");
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
				$cell.text(labels.bytesCached);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.getCachedPercentage() + "%");
				$row.append($cell);
				$table.append($row);
			}

			if(option.columns.requestCached) {
				var $row = $("<div class='grid-row'></div>");
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(labels.requestCached);
				$row.append($cell);
				var $cell = $("<div class='grid-cell'></div>");
				$cell.text(useCase.getRequestCachePercentage() + "%");
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
				var $row = this.renderRow(useCases[i]);
				$grid.append($row);
			}
			return $grid;
		}
	};
})();

