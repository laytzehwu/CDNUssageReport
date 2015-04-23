describe("URL parser spec",function () {
    var URLParser = CDNUsageReport.util.URLParser;
    afterEach(function() {
	URLParser.clear();
    }); 
   
    it("No # in URL, must has empty virtual path and param", function () {
	URLParser.parseURL("http://www.abc.com/abc");
        expect(URLParser.getVirtualPath()).toEqual("");
        expect(URLParser.getParam().length).toEqual(0);
    });

    it("Has # at then end in URL, must has empty virtual path and param", function () {
	URLParser.parseURL("http://www.google.com/abc#");
        expect(URLParser.getVirtualPath()).toEqual("");
        expect(URLParser.getParam().length).toEqual(0);
    });

    it("Has # but no / in URL, only 1 param tracked", function () {
	URLParser.parseURL("http://www.yahoo.com/abc#halo");
        expect(URLParser.getVirtualPath()).toEqual("halo");
        expect(URLParser.getParam().length).toEqual(1);
    });

    it("Has # and / in URL, multiple param tracked", function () {
	URLParser.parseURL("http://www.sinchew.com/abc#halo/1223/page123/sortResourceASC");
        expect(URLParser.getVirtualPath()).toEqual("halo/1223/page123/sortResourceASC");
        expect(URLParser.getParam().length).toEqual(4);

	CDNUsageReport.util.URLParser.parseURL("http://www.onapp.com/abc#halo/1223/page123//sortResourceASC");
        expect(URLParser.getVirtualPath()).toEqual("halo/1223/page123/sortResourceASC");
        expect(URLParser.getParam().length).toEqual(4);
    });
    
    it("Track section name in the first parameter", function () {
	URLParser.parseURL("http://www.sinchew.com/abc#halo/1223/page123/sortResourceASC");
        expect(URLParser.getSection()).toEqual("halo");
    });

    it("Track page number when the first param match page/d", function () {

	URLParser.parseURL("http://www.sinchew.com/abc#halo/1223/page123/sortResourceASC");
        expect(URLParser.getSection()).toEqual("halo");
        expect(URLParser.getPage()).toEqual(123);

	URLParser.parseURL("http://www.sinchew.com/abc#page123/halo/1223/page456/sortResourceASC");
        expect(URLParser.getSection()).toEqual("halo");
        expect(URLParser.getPage()).toEqual(123);
    });

    it("Track sort info when the first param match sort/s", function () {

	URLParser.parseURL("http://www.sinchew.com/abc#halo/1223/page123/sortResourceASC");
        expect(URLParser.getSort().field).toEqual("Resource");
        expect(URLParser.getSort().desc).toBeFalsy();

	URLParser.parseURL("http://www.sinchew.com/abc#sortpublisher/halo/1223/page123");
        expect(URLParser.getSort().field).toEqual("publisher");
        expect(URLParser.getSort().desc).toBeTruthy();

	URLParser.parseURL("http://www.sinchew.com/abc#halo/sortpublisher/1223/page123");
        expect(URLParser.getSort().field).toEqual("publisher");
        expect(URLParser.getSort().desc).toBeTruthy();

    })
});
