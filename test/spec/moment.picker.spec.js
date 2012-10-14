describe('moment.picker', function() {
  
  describe('when instantiating a new picker', function() {
    var picker; // full suite available momentpicker
    beforeEach(function() {
      picker = new MomentPicker(); 
    });

    it('should have a default selected day of today', function() {
      expect(picker.getSelectedMoment()).toEqual(moment().sod()); 
    });

    it('should select a different day, if a moment is provided in the options', function() {
      var picker = new MomentPicker({date: moment('Jan 1, 2000')});
      expect(picker.getSelectedMoment()).toEqual(moment('Jan 1, 2000').sod()); 
    });

  });
});
