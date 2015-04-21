describe("CDNUssageModel", function () {
    it("Create CDNUssageModel without data", function () {

        expect(function () {
            new CDNUssageModel()
        }).toThrowError("No/Empty data passed in!");
    });
});