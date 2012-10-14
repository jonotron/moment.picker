describe('moment.picker', function() {
  
  describe('when instantiating a new picker', function() {
    var picker; // full suite available momentpicker
    beforeEach(function() {
      picker = new MomentPicker(); 
    });

    it('should have a default selected day of today', function() {
      expect(picker.getSelectedMoment()).toEqual(moment().startOf('day')); 
    });

    describe('when providing a date', function() {
      it('should select the provided date', function() {
        var picker = new MomentPicker({date: moment('Jan 1, 2000')});
        expect(picker.getSelectedMoment()).toEqual(moment('Jan 1, 2000').startOf('day')); 
      });

      it('should reset set the selected date to the start of the day', function() {
        var picker = new MomentPicker({date: moment('2000-01-01T12:34:00')});
        expect(picker.getSelectedMoment()).toEqual(moment('Jan 1, 2000').startOf('day'));
      });
    
    });

  });
});
