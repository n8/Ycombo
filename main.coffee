
class YCombo
  
  constructor: () ->
    @karma_diff = 0
    @hacker_news_id = null
    chrome.browserAction.setBadgeBackgroundColor {'color': [0, 0, 0, 250]}
    
    chrome.browserAction.onClicked.addListener (tab) => 
      chrome.tabs.create {'url':"http://news.ycombinator.com/submitted?id=#{@hacker_news_id}"}
     
  start: ->
    @syncYCData()
  
  
  syncYCData: ->
    url = "http://news.ycombinator.com"
    $.get url, (data) => 
      returned = $(data)
      tops = $(".pagetop", returned)
      name_section = tops[1]
      pattern = /(?!.*\()\d*/
      
      current_karma = $(name_section).text().match pattern
      
      date = new Date
      day = date.getDay()
      
      # for testing
      # store.set 'todays_karma', {'karma': 0, 'stored_at': day}  
      
      todays_karma = store.get 'todays_karma'
      
      if todays_karma == undefined || todays_karma['stored_at'] != day
        store.set 'todays_karma' , {'karma': current_karma, 'stored_at': day}
      else 
        if todays_karma['stored_at'] == day 
          @karma_diff = current_karma - todays_karma['karma'] 
      
      if @karma_diff > 0
        chrome.browserAction.setBadgeText {'text': "#{@karma_diff}"}
      
      @hacker_news_id = $("a", name_section)[0].text


ycombo = new YCombo()
ycombo.start()

setInterval(
  ->
    ycombo.syncYCData()
  600000
)

