var feature = require ('../dist/build.js')

describe("A Feature", function() {
  var a;

  it("should not return null or an empty object when I get the feature-element", function() {
    a = true;

    expect(feature).toBeDefined();
    expect(feature.visbility).toBeDefined();
  });
});