/**
 * Model for CDN ussage report. 
 * It receives sequential data of a case and organize to its properties
 * Provides bytes and request cache calculation for convenience. It sound like digressing from a simple model. But it do help in next module.
 * Dual to the bad data structure [resource, publisher, edge, bytesCached, bytesNotCached, requestsCached, requestsNotCached]. The models constructor is coded with hard limited.
 * New models with be introduced if the backend api change its data structure
*/
var CDNUssageReport = CDNUssageReport || {};
CDNUssageReport.Models = CDNUssageReport.Models || {};
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

    this.getCachedPercentage = function () {
	if((this.bytesCached === 0) && (this.bytesNotCached)) {
		return 100;
	}
	return this.bytesCached / (this.bytesCached + this.bytesNotCached) * 100;
    }

    this.isFullyCached = function () {
	return !(this.bytesNotCached > 0);
    }

   this.getRequestCachePercentage = function () {
	if((this.requestsCached === 0) && (this.requestsNotCached)) {
		return 100;
	}
	return this.requestsCached / (this.requestsCached + this.requestsNotCached) * 100;
   }

   this.isRequestFullyCached = function () {
	return !(this.requestsNotCached > 0);
   }
}
