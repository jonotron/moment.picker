beforeEach(function() {
  this.addMatchers({
    // Determine if moment is the same day as another moment
    toNearlyEqualMoment: function(expected) {
      var actual = this.actual;
      var notText = this.isNot ? ' not' : ''; 
      var diff = expected.diff(actual, 'seconds');

      this.message = function() {
        return "Expected " + actual.format() + notText + " to be nearly the same moment as " + expected.format(); 
      };

      return diff <= 10 && diff >= -10;
    }

  });
});
