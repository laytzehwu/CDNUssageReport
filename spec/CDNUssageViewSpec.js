describe("UssageView Spec", function () {
	var UseCaseModel = CDNUssageReport.Models.UseCaseModel;
	it("Render full columns header", function () {
		var $row = CDNUssageReport.Views.UssageView.renderGridHeader();
		expect($row.hasClass("grid-header")).toBeTruthy();
		var $cells = $row.find(".grid-cell");
		var labels = CDNUssageReport.Views.UssageView.getLabels();
		var labelKeys = Object.keys(labels);
		expect($cells.length).toEqual(labelKeys.length);

		for(var i=0;i<labelKeys.length;i++) {
			var $cell = $($cells[i]);
	 		expect($cell.text()).toEqual(labels[labelKeys[i]]);		
		}

	});

	it("Render custom columns header", function () {
		// Only show 1 column
		var $row = CDNUssageReport.Views.UssageView.renderGridHeader({columns: {publisher: true}});
		expect($row.hasClass("grid-header")).toBeTruthy();
		var $cells = $row.find(".grid-cell");
		var labels = CDNUssageReport.Views.UssageView.getLabels();
		var labelKeys = Object.keys(labels);
		expect($cells.length).toEqual(1);
		expect($cells.text()).toEqual(labels.publisher);

		// Show 2 columns
		var $row = CDNUssageReport.Views.UssageView.renderGridHeader({columns: {publisher: true, bytesCached: true, requestCached: true}});
		expect($row.hasClass("grid-header")).toBeTruthy();
		var $cells = $row.find(".grid-cell");
		var labels = CDNUssageReport.Views.UssageView.getLabels();
		var labelKeys = Object.keys(labels);
		expect($cells.length).toEqual(3);
		expect($cells.text()).toEqual(labels.publisher+labels.bytesCached+labels.requestCached);

	});

	it("Render ussage row by single use case properly", function () {
		var useCase = new UseCaseModel([1,1,1,50,50,50,50]);
		var $row = CDNUssageReport.Views.UssageView.renderRow(useCase);
		expect($row.hasClass("grid-row")).toBeTruthy();
		expect($row.find(".grid-cell").length).toEqual(5);

	});

	it("Render ussage full detail", function () {
		var useCase = new UseCaseModel([1,1,1,50,50,50,50]);
		var $table = CDNUssageReport.Views.UssageView.renderDetailDialog(useCase);
		expect($table.hasClass("grid")).toBeTruthy();
		var labels = CDNUssageReport.Views.UssageView.getLabels();
		var labelKeys = Object.keys(labels);
		var $rows = $table.find(".grid-row");
		expect($rows.length).toEqual(labelKeys.length);
		var detailHTML = $table.html();
		for(var i=0;i<labelKeys.length;i++) {
			var label = labels[labelKeys[i]]
	 		expect(detailHTML).toMatch(label);		
		}
	});

	it("Render ussage list with full columns", function () {
		var cases = [
			new UseCaseModel([1,1,1,50,50,50,50]),
			new UseCaseModel([1,2,1,50,50,50,50]),
			new UseCaseModel([1,3,1,50,50,50,50]),
		];
		var $list = CDNUssageReport.Views.UssageView.renderList(cases);
		expect($list.hasClass("grid")).toBeTruthy();
		var $header = $list.find(".grid-header");
		expect($header.length).toEqual(1);
		var $header = $list.find(".grid-row");
		expect($header.length).toEqual(cases.length);
	});
});
