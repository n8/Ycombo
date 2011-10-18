(function() {
  var YCombo, ycombo;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  YCombo = (function() {
    function YCombo() {
      this.karma_diff = 0;
      this.hacker_news_id = null;
      chrome.browserAction.setBadgeBackgroundColor({
        'color': [0, 0, 0, 250]
      });
      chrome.browserAction.onClicked.addListener(__bind(function(tab) {
        return chrome.tabs.create({
          'url': "http://news.ycombinator.com/submitted?id=" + this.hacker_news_id
        });
      }, this));
    }
    YCombo.prototype.start = function() {
      return this.syncYCData();
    };
    YCombo.prototype.syncYCData = function() {
      var url;
      url = "http://news.ycombinator.com";
      return $.get(url, __bind(function(data) {
        var current_karma, date, day, name_section, pattern, returned, todays_karma, tops;
        returned = $(data);
        tops = $(".pagetop", returned);
        name_section = tops[1];
        pattern = /(?!.*\()\d*/;
        current_karma = $(name_section).text().match(pattern);
        date = new Date;
        day = date.getDay();
        todays_karma = store.get('todays_karma');
        if (todays_karma === void 0 || todays_karma['stored_at'] !== day) {
          store.set('todays_karma', {
            'karma': current_karma,
            'stored_at': day
          });
        } else {
          if (todays_karma['stored_at'] === day) {
            this.karma_diff = current_karma - todays_karma['karma'];
          }
        }
        if (this.karma_diff > 0) {
          chrome.browserAction.setBadgeText({
            'text': "" + this.karma_diff
          });
        }
        return this.hacker_news_id = $("a", name_section)[0].text;
      }, this));
    };
    return YCombo;
  })();
  ycombo = new YCombo();
  ycombo.start();
  setInterval(function() {
    return ycombo.syncYCData();
  }, 30000);
}).call(this);
