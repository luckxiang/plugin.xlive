
var LIST_URL = "http://www.xuenetwork.com/xbmclive/liveSource.xml";
var xml = require('showtime/xml');

(function(plugin) {

    var PLUGIN_PREFIX = "xlive:";
    var list;
    var service = plugin.createService("xlive", PLUGIN_PREFIX+"start", "video", true, plugin.path + "xlive.png");

    plugin.addURI(PLUGIN_PREFIX+"start", function(page) {
        page.type = "directory";
        var SearchQueryResponse = showtime.httpGet(LIST_URL);
        var doc = xml.parse(SearchQueryResponse.toString());

        list = doc.channel_list.filterNodes('class');
        for(var k = 0; k < list.length; k++)
        {
            print(list[k]["@classname"]);
            page.appendItem(PLUGIN_PREFIX + 'id:'+ k, 'directory',{title: list[k]["@classname"] });
        }
    });

    plugin.addURI(PLUGIN_PREFIX+"id:(.*)", function(page, id) {
        var i = parseInt(id);
        var play_list = list[i].filterNodes('channel');
        for(var k = 0; k < play_list.length; k++)
        {
            page.appendItem(PLUGIN_PREFIX + 'channel:' + play_list[k].tvlink['@link'], 'video',{title: play_list[k]['@name'] });
        }   
    });

    plugin.addURI(PLUGIN_PREFIX+"channel:(.*)", function(page, url) {
        var videoParams = {
        sources: [{
                url: url,
          }],
        no_subtitle_scan: true,
        subtitles: []      
        }
        page.source = 'videoparams:' + JSON.stringify(videoParams);
    });

})(this);

