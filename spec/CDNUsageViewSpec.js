describe("Menu Spec", function () {
    var Menu = CDNUssageReport.Views.Menu;
    var mockObj = null;
    beforeEach(function () {
        mockObj = {
            clickEvent: function () {}
        }
        spyOn(mockObj, 'clickEvent');
    });

    afterEach(function() {
        Menu.clear();
        $("nav").remove();
        $(".mobile-menu-toggle").remove();
    });

    it("Menu bar will be created when it is not existed", function () {
        expect($("nav").length).toEqual(0);
        Menu.init();
        expect($("nav").length).toEqual(1);
    });

    it("Menu bar will not be created when we pass one to it", function () {
        var $bar = $("<div></div>");
        Menu.init($bar);
        expect($("nav").length).toEqual(0);
        expect($bar.find(".mobile-menu-toggle").length).toEqual(1);
    });

    it("Error raise when add item without info", function () {
        var $bar = $("<div></div>");
        Menu.init($bar);
        expect(function () {
            Menu.addItem();
        }).toThrowError("Nothing pass-in when create menu item.");

    });

    it("Create menu item with only label", function () {
        var $bar = $("<div></div>");
        Menu.init($bar);
        Menu.addItem({label: "Home"});
        var $items = $bar.find("li");
        expect($items.length).toEqual(1);
        expect($items.find('a').length).toEqual(0);
        expect($bar.find("li").text()).toEqual("Home");
    });

    it("Create menu item with link", function () {
        var $bar = $("<div></div>");
        Menu.init($bar);
        Menu.addItem({label: "Home", href: "#"});
        var $items = $bar.find("li");
        expect($items.length).toEqual(1);
        expect($items.find('a').length).toEqual(1);
        var $link = $items.find('a');
        expect($link.attr("href")).toEqual("#");
        expect($bar.find("li").text()).toEqual("Home");
    });
    
    it("Create menu item with link", function () {
        var $bar = $("<div></div>");
        Menu.init($bar);
        Menu.addItem({label: "Home", href: "#", click: mockObj.clickEvent});
        var $items = $bar.find("li");
        expect($items.length).toEqual(1);
        expect($items.find('a').length).toEqual(1);
        var $link = $items.find('a');
        expect($link.attr("href")).toEqual("#");
        expect($bar.find("li").text()).toEqual("Home");
        $link.click();
        expect(mockObj.clickEvent).toHaveBeenCalled();
    })


});
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
