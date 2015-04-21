describe("CDNUssageModel Spec", function () {
    it("Create CDNUssageModel without data", function () {
        expect(function () {
            new CDNUssageModel()
        }).toThrowError("No/Empty data passed in!");
    });

    it("Create CDNUssageModel with short of data", function () {
        expect(function () {
            new CDNUssageModel(1)
        }).toThrowError("Only accept array!");

        expect(function () {
            new CDNUssageModel("ABC")
        }).toThrowError("Only accept array!");

        expect(function () {
            new CDNUssageModel({"id": 1})
        }).toThrowError("Only accept array!");

        expect(function () {
            new CDNUssageModel([1,2,4])
        }).toThrowError("Only accept 7 element array!");

        expect(function () {
            new CDNUssageModel([1,2,3,4,5,"A",7])
        }).toThrowError("Found pass-in data(5) is not integer!");
        
    });

    it("Create CDNUssageModel with proper data", function () {
	var model = new CDNUssageModel([63789283, 957505314, 7690037, 1501776752, 612004274, 5783, 2711]);
	expect(model.resourceId).toEqual(63789283);
	expect(model.publisherId).toEqual(957505314);
	expect(model.edgeId).toEqual(7690037);
	expect(model.bytesCached).toEqual(1501776752);
	expect(model.bytesNotCached).toEqual(612004274);
	expect(model.requestsCached).toEqual(5783);
	expect(model.requestsNotCached).toEqual(2711);
    });

    it("Make sure cache in bytes calculation correct and no error", function () {
	var resourceId = 63789283;
	var publisherId = 957505314;
	var edgeId = 7690037;
	var bytesCached = 1501776752;
	var bytesNotCached = 612004274;
	var requestsCached = 5783;
	var requestsNotCached = 2711;
	var rowArray = [resourceId, publisherId, edgeId, bytesCached, bytesNotCached, requestsCached, requestsNotCached];
	var model = new CDNUssageModel(rowArray);
	expect(model.getCachedPercentage()).toEqual(model.bytesCached / (model.bytesCached + model.bytesNotCached) * 100);
	expect(model.isFullyCached()).toBeFalsy();
	model.bytesNotCached = 0;
	expect(model.isFullyCached()).toBeTruthy();
	model.bytesCached = 0;
	expect(model.isFullyCached()).toBeTruthy();
    });

    it("Make sure request caching calculation correct and no error", function () {
	var resourceId = 63789283;
	var publisherId = 957505314;
	var edgeId = 7690037;
	var bytesCached = 1501776752;
	var bytesNotCached = 612004274;
	var requestsCached = 5783;
	var requestsNotCached = 2711;
	var rowArray = [resourceId, publisherId, edgeId, bytesCached, bytesNotCached, requestsCached, requestsNotCached];
	var model = new CDNUssageModel(rowArray);
	expect(model.getRequestCachePercentage()).toEqual(model.requestsCached / (model.requestsCached + model.requestsNotCached) * 100);
	expect(model.isRequestFullyCached()).toBeFalsy();
	model.requestsNotCached = 0;
	expect(model.isRequestFullyCached()).toBeTruthy();
	model.requestsCached = 0;
	expect(model.isRequestFullyCached()).toBeTruthy();
    });

});
