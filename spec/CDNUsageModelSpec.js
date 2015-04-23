describe("CDNUssageModel Spec", function () {
    var UseCaseModel = CDNUssageReport.Models.UseCaseModel; 
    it("Create CDNUssageModel without data", function () {
        expect(function () {
            new UseCaseModel()
        }).toThrowError("No/Empty data passed in!");
    });

    it("Create CDNUssageModel with short of data", function () {
        expect(function () {
            new UseCaseModel(1)
        }).toThrowError("Only accept array!");

        expect(function () {
            new UseCaseModel("ABC")
        }).toThrowError("Only accept array!");

        expect(function () {
            new UseCaseModel({"id": 1})
        }).toThrowError("Only accept array!");

        expect(function () {
            new UseCaseModel([1,2,4])
        }).toThrowError("Only accept 7 element array!");

        expect(function () {
            new UseCaseModel([1,2,3,4,5,"A",7])
        }).toThrowError("Found pass-in data(5) is not integer!");
        
    });

    it("Create CDNUssageModel with proper data", function () {
	var model = new UseCaseModel([63789283, 957505314, 7690037, 1501776752, 612004274, 5783, 2711]);
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
	var model = new UseCaseModel(rowArray);
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
	var model = new UseCaseModel(rowArray);
	expect(model.getRequestCachePercentage()).toEqual(model.requestsCached / (model.requestsCached + model.requestsNotCached) * 100);
	expect(model.isRequestFullyCached()).toBeFalsy();
	model.requestsNotCached = 0;
	expect(model.isRequestFullyCached()).toBeTruthy();
	model.requestsCached = 0;
	expect(model.isRequestFullyCached()).toBeTruthy();
    });

});

describe("Statistic spec", function () {
    var Statistic = CDNUssageReport.Models.Statistic; 
    it("Pass in nothing is allowed!", function () {
	var sample = new Statistic();
	expect(sample.resourceId).toBeNull();	
	expect(sample.publisherId).toBeNull();	
	expect(sample.edgeId).toBeNull();	

	expect(sample.bytesCached).toEqual(0);	
	expect(sample.bytesNotCached).toEqual(0);	
	expect(sample.requestsCached).toEqual(0);	
	expect(sample.requestsNotCached).toEqual(0);	
	expect(sample.length).toEqual(0);	
    });

    it("Pass in only 1 use case", function () {
        var useCase = new CDNUssageReport.Models.UseCaseModel([1,2,3,4,5,6,7]);
	var sample = new Statistic([useCase]);
	
	expect(sample.resourceId).toEqual(useCase.resourceId);
	expect(sample.publisherId).toEqual(useCase.publisherId);
	expect(sample.edgeId).toEqual(useCase.edgeId);

	expect(sample.bytesCached).toEqual(useCase.bytesCached);
	expect(sample.bytesNotCached).toEqual(useCase.bytesNotCached);
	expect(sample.requestsNotCached).toEqual(useCase.requestsNotCached);
	expect(sample.requestsCached).toEqual(useCase.requestsCached);
	
    });

    var getRandomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    it("Some use cases", function () {
        var iLen = getRandomInt(1, 20);
        var useCases = [];
        var bytesCached = 0;
        var bytesNotCached = 0;
        var requestsNotCached = 0;
        var requestsCached = 0;
        for(var i=0;i<iLen;i++) {
	    var resourceId = getRandomInt(1000,9000);
	    var publisherId = getRandomInt(1000,9000);
	    var edgeId = getRandomInt(1000,9000);
            var useCase = new CDNUssageReport.Models.UseCaseModel([resourceId, publisherId, edgeId, getRandomInt(0,100), getRandomInt(0,100), getRandomInt(0,100), getRandomInt(0,100)]);
            bytesCached += useCase.bytesCached;
            bytesNotCached += useCase.bytesNotCached;
            requestsNotCached += useCase.requestsNotCached;
            requestsCached += useCase.requestsCached;
            useCases.push(useCase);
        }
        var sample = new Statistic(useCases);
        expect(sample.length).toEqual(iLen);
        if(sample.bytesCached != bytesCached) {
            fail("bytesCached calculation fail");
        }
        if(sample.bytesNotCached != bytesNotCached) {
            fail("bytesNotCached calculation fail");
        }
        if(sample.requestsNotCached != requestsNotCached) {
            fail("requestsNotCached calculation fail");
        }
        if(sample.requestsCached != requestsCached) {
            fail("requestsCached calculation fail");
        }
       
    });

    it("Same resource cases",function () {
        var iLen = getRandomInt(2, 20);
        var useCases = [];
        var resourceId = getRandomInt(1000,9000);
        for(var i=0;i<iLen;i++) {
	    var publisherId = 1000 + i;
	    var edgeId = 2000 + i;
            var useCase = new CDNUssageReport.Models.UseCaseModel([resourceId, publisherId, edgeId, getRandomInt(0,100), getRandomInt(0,100), getRandomInt(0,100), getRandomInt(0,100)]);
            useCases.push(useCase);
        }        
        var sample = new Statistic(useCases);
        expect(sample.length).toEqual(iLen);
        expect(sample.resourceId).toEqual(resourceId);
        expect(sample.publisherId).toBeNull();
        expect(sample.edgeId).toBeNull();
    });

    it("Same publisher cases",function () {
        var iLen = getRandomInt(2, 20);
        var useCases = [];
        var publisherId = getRandomInt(1000,9000);
        for(var i=0;i<iLen;i++) {
	    var resourceId = 1000 + i;
	    var edgeId = 2000 + i;
            var useCase = new CDNUssageReport.Models.UseCaseModel([resourceId, publisherId, edgeId, getRandomInt(0,100), getRandomInt(0,100), getRandomInt(0,100), getRandomInt(0,100)]);
            useCases.push(useCase);
        }        
        var sample = new Statistic(useCases);
        expect(sample.length).toEqual(iLen);
        expect(sample.publisherId).toEqual(publisherId);
        expect(sample.resourceId).toBeNull();
        expect(sample.edgeId).toBeNull();
    });

    it("Same edge cases",function () {
        var iLen = getRandomInt(2, 20);
        var useCases = [];
        var edgeId = getRandomInt(1000,9000);
        for(var i=0;i<iLen;i++) {
	    var resourceId = 1000 + i;
	    var publisherId = 2000 + i;
            var useCase = new CDNUssageReport.Models.UseCaseModel([resourceId, publisherId, edgeId, getRandomInt(0,100), getRandomInt(0,100), getRandomInt(0,100), getRandomInt(0,100)]);
            useCases.push(useCase);
        }        
        var sample = new Statistic(useCases);
        expect(sample.length).toEqual(iLen);
        expect(sample.edgeId).toEqual(edgeId);
        expect(sample.resourceId).toBeNull();
        expect(sample.publisherId).toBeNull();
    });

});
