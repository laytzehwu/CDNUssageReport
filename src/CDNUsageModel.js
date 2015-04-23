/**
 * Model for CDN ussage report. 
 * It receives sequential data of a case and organize to its properties
 * Provides bytes and request cache calculation for convenience. It sound like digressing from a simple model. But it do help in next module.
 * Dual to the bad data structure [resource, publisher, edge, bytesCached, bytesNotCached, requestsCached, requestsNotCached]. The models constructor is coded with hard limited.
 * New models with be introduced if the backend api change its data structure
*/
var CDNUssageReport = CDNUssageReport || {};
CDNUssageReport.Models = CDNUssageReport.Models || {};
CDNUssageReport.Models.Abstract = CDNUssageReport.Models.Abstract || {};
CDNUssageReport.Models.Abstract.getCachedPercentage = function () {
    if((this.bytesCached === 0) && (this.bytesNotCached)) {
	return 100;
    }
    return this.bytesCached / (this.bytesCached + this.bytesNotCached) * 100;
}

CDNUssageReport.Models.Abstract.isFullyCached = function () {
    return !(this.bytesNotCached > 0);
}

CDNUssageReport.Models.Abstract.getRequestCachePercentage = function () {
    if((this.requestsCached === 0) && (this.requestsNotCached)) {
	return 100;
    }
    return this.requestsCached / (this.requestsCached + this.requestsNotCached) * 100;
}

CDNUssageReport.Models.Abstract.isRequestFullyCached = function () {
    return !(this.requestsNotCached > 0);
}

CDNUssageReport.Models.UseCaseModel = function (data) {
    if(!data) {
        throw new Error("No/Empty data passed in!");
    }
    
    if(!Array.isArray(data)) {
        throw new Error("Only accept array!");
    }

    if(data.length != 7) {
        throw new Error("Only accept 7 element array!");
    }

    isInt = /^-?[0-9]+$/;

    var iLen = data.length;
    for(var i=0;i<iLen;i++) {
         if(!isInt.test(data[i])) {
	     throw new Error("Found pass-in data(" + i + ") is not integer!");
         }
    }

    this.resourceId = parseInt(data[0]);
    this.publisherId = parseInt(data[1]);
    this.edgeId = parseInt(data[2]);

    this.bytesCached = parseInt(data[3]);
    this.bytesNotCached = parseInt(data[4]);
    this.requestsCached = parseInt(data[5]);
    this.requestsNotCached = parseInt(data[6]); 

    this.getCachedPercentage = CDNUssageReport.Models.Abstract.getCachedPercentage;

    this.isFullyCached = CDNUssageReport.Models.Abstract.isFullyCached;

    this.getRequestCachePercentage = CDNUssageReport.Models.Abstract.getRequestCachePercentage;

    this.isRequestFullyCached = CDNUssageReport.Models.Abstract.isRequestFullyCached;
}

CDNUssageReport.Models.Statistic = function (list) {
    this.resourceId = null;
    this.publisherId = null;
    this.edgeId = null;

    this.bytesCached = 0;
    this.bytesNotCached = 0;
    this.requestsCached = 0;
    this.requestsNotCached = 0; 

    this.list = [];

    if(list && !Array.isArray(list)) {
        throw new Error("Please pass-in an array");
    }

    var list = list || [];

    this.length = list.length;
    var resourceId = null;
    var publisherId = null;
    var edgeId = null;

    for(var i=0;i<this.length; i++) {
	var useCase = list[i];
	if(resourceId === null) {
            resourceId = useCase.resourceId;
	} else if(resourceId > 0) {
		if(resourceId != useCase.resourceId) {
			resourceId = -1;
		}
	}

	if(publisherId === null) {
            publisherId = useCase.publisherId;
	} else if(publisherId > 0) {
		if(publisherId != useCase.publisherId) {
			publisherId = -1;
		}
	}

	if(edgeId === null) {
            edgeId = useCase.edgeId;
	} else if(edgeId > 0) {
		if(edgeId != useCase.edgeId) {
			edgeId = -1;
		}
	}

	this.bytesCached += useCase.bytesCached;
	this.bytesNotCached += useCase.bytesNotCached;
	this.requestsCached += useCase.requestsCached;
	this.requestsNotCached += useCase.requestsNotCached; 

	this.list.push(useCase);
    }
    
    if(resourceId > 0) {
        this.resourceId = resourceId;
    }
    if(publisherId > 0) {
        this.publisherId = publisherId;
    }
    if(edgeId > 0) {
        this.edgeId = edgeId;
    }

    this.getCachedPercentage = CDNUssageReport.Models.Abstract.getCachedPercentage;

    this.isFullyCached = CDNUssageReport.Models.Abstract.isFullyCached;

    this.getRequestCachePercentage = CDNUssageReport.Models.Abstract.getRequestCachePercentage;

    this.isRequestFullyCached = CDNUssageReport.Models.Abstract.isRequestFullyCached;

}
