( function() {
  var tmplHead = '<thead>'
    + '<tr>'
    + '<th colspan="2" class="nav prev-month"><i class="icon-arrow-left"></i></th>'
    + '<th colspan="3" class="month"><%= month %> <%= year %></th>'
    + '<th colspan="2" class="nav next-month"><i class="icon-arrow-right"></i></th>'
    + '</tr>'
    + '<tr>'
    + '<th>' + moment.weekdaysShort[0].substring(0,2) + '</th>'
    + '<th>' + moment.weekdaysShort[1].substring(0,2) + '</th>'
    + '<th>' + moment.weekdaysShort[2].substring(0,2) + '</th>'
    + '<th>' + moment.weekdaysShort[3].substring(0,2) + '</th>'
    + '<th>' + moment.weekdaysShort[4].substring(0,2) + '</th>'
    + '<th>' + moment.weekdaysShort[5].substring(0,2) + '</th>'
    + '<th>' + moment.weekdaysShort[6].substring(0,2) + '</th>'
    + '</tr>'
    + '</thead>'
    ;
  var tmplRow = '<tr>'
    + '<td class="day day-0 <%= week.day0.date ? "clickable" : "empty" %><%= week.day0.full == selected ? " selected": "" %>" data-date="<%= week.day0.full %>"><%= week.day0.date %></td>'
    + '<td class="day day-1 <%= week.day1.date ? "clickable" : "empty" %><%= week.day1.full == selected ? " selected": "" %>" data-date="<%= week.day1.full %>"><%= week.day1.date %></td>'
    + '<td class="day day-2 <%= week.day2.date ? "clickable" : "empty" %><%= week.day2.full == selected ? " selected": "" %>" data-date="<%= week.day2.full %>"><%= week.day2.date %></td>'
    + '<td class="day day-3 <%= week.day3.date ? "clickable" : "empty" %><%= week.day3.full == selected ? " selected": "" %>" data-date="<%= week.day3.full %>"><%= week.day3.date %></td>'
    + '<td class="day day-4 <%= week.day4.date ? "clickable" : "empty" %><%= week.day4.full == selected ? " selected": "" %>" data-date="<%= week.day4.full %>"><%= week.day4.date %></td>'
    + '<td class="day day-5 <%= week.day5.date ? "clickable" : "empty" %><%= week.day5.full == selected ? " selected": "" %>" data-date="<%= week.day5.full %>"><%= week.day5.date %></td>'
    + '<td class="day day-6 <%= week.day6.date ? "clickable" : "empty" %><%= week.day6.full == selected ? " selected": "" %>" data-date="<%= week.day6.full %>"><%= week.day6.date %></td>'
    + '</tr>'
    ;

  var MomentPicker = Backbone.View.extend({
    _tmplHead:    tmplHead,
    _tmplRow:     tmplRow,
    tagName:      'table',
    className:    'datepicker',

    constructor: function(options) {
      Backbone.View.prototype.constructor.call(this, options);

      this._initialize(options);
    },

    /**
     * Private initializer
     */
    _initialize: function(options) {
      if (options && _.has(options, 'date')) {
        this.updateSelectedMoment(options.date);
      } else {
        this.updateSelectedMoment(moment().startOf('day'));
      }
    },

    render: function() {
      this.$el.html(_.template(this._tmplHead, {
        month: moment((this._activeMoment.month()+1).toString(), 'M').format('MMM'),
        year: this._activeMoment.format("YYYY")
      }));

      var self = this;
      _.each(this.getActiveWeeks(this._activeMoment), function(week) {
        self.$el.append(_.template(self._tmplRow, {
          week: week,
          selected: self._selectedMoment.format('YYYY-MM-DD')
        }));
      });

      return this;
    },

    getActiveWeeks: function(date) {
      var daysInActiveMonth = _.range(1, date.clone().date(1).daysInMonth() + 1); // daysInMonth is buggy in current Moment version and returns wrong number when using end of certain months (e.g. May 31, 2012). TODO: reeval when fixed upstream

      var y = date.year();
      var m = date.month();
      var weeksInActiveMonth = _.chain(daysInActiveMonth)
        .map(function(d) { // group by the week of the year
          var mom = moment([y, m, d]);
          return {
            date: d,
            day: mom.day(),
            yearweek: mom.format('YYYY') + '-' + mom.format('w'), // year-week to deal with january
            month: m,
            year: y,
            full: mom.format('YYYY-MM-DD')
          };
        })
        .groupBy('yearweek')
        .map(function(w) { // rekey each date in the week to day
          var reKeyed = {};
          // create an empty object with a dayX property for each day of the week
          _.each(_.range(7), function(d) {
            reKeyed['day' + d] = {};
          });
          _.each(w, function(d) {
            reKeyed['day' + d.day] = d;
          });

          return reKeyed;
        })
        .value();

      return weeksInActiveMonth;
    },

    events: {
      'click td.day.clickable': 'clickDay',
      'click th.prev-month': 'prevMonth',
      'click th.next-month': 'nextMonth'
    },

    clickDay: function(e) {
      e.preventDefault();

      this._setSelectedMoment(moment($(e.target).data('date')));
    },

    prevMonth: function(e) {
      this._activeMoment.subtract('months', 1);
      this.render();
    },

    nextMonth: function(e) {
      this._activeMoment.add('months', 1);
      this.render();
    },

    _setSelectedMoment: function(mom, silent) {
      silent = ( silent !== undefined ) ? silent : false; // default silent false

      this._selectedMoment = mom;
      this.$('td.day.selected').removeClass('selected');
      this.$('td.day[data-date="' + mom.format('YYYY-MM-DD') + '"]').addClass('selected');
      if (!silent)
        this.trigger('selected', { moment: mom, date: mom.format('MMM D, YYYY')});
    },

    updateSelectedMoment: function(date) {
      var mom = moment(date);
      if (!isNaN(mom._d.getTime())) { // check for valid date. TODO: Use upcoming moment.js isValid function
        mom.startOf('day');
        this._setSelectedMoment(mom);
        this._activeMoment = mom.clone();
        this.render();
        return mom;
      } else {
        return false;
      }
    },

    getSelectedMoment: function() {
      return this._selectedMoment;
    }

  });

  // attach to global object
  this.MomentPicker = MomentPicker;

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'moment'], function(Backbone, moment) {
      return MomentPicker; 
    }); 
  }
}).call(this);
