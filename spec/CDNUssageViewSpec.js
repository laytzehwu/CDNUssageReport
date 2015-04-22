describe("CDNUssageView Spec", function () {
	it("Render ussage row properly", function () {
		CDNUssageReport.Views.UssageView.renderRow();
	})
	it("Render ussage detail", function () {
		CDNUssageReport.Views.UssageView.renderDetailDialog();
	})
	it("Render ussage list", function () {
		CDNUssageReport.Views.UssageView.renderList();
	})
});
