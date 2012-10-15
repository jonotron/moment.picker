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

  describe('when rendering a picker', function() {
    var picker;
    beforeEach(function() {
      picker = new MomentPicker({date: moment('Jan 1, 2000')}); 
      picker.render();
    });

    it('should set the active month in the header', function() {
      expect(picker.$('thead th.month')).toHaveText('Jan 2000');
    });

    it('should render days in the correct cell', function() {
      // Jan 1, 2000 is a saturday
      expect(picker.$('tbody td[data-date="2000-01-01"]')).toHaveClass('day-6');
    });

    it('should render the selected day as selected', function() {
      expect(picker.$('tbody td[data-date="2000-01-01"]')).toHaveClass('selected');
      expect(picker.$('tbody td[data-date="2000-01-02"]')).not.toHaveClass('selected');

    });
  });
});
