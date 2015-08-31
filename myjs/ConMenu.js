
CreateFeature = function (lonlat) {
    var me = this;
    var lonlats = [lonlat.getLng(), lonlat.getLat()];
    var lnglat = new TLngLat(lonlats[0], lonlats[1]);
    iconUrl = "http://www.tianditu.com/images/route/routeStart.png";
    var iconSize = new TSize(44, 34);
    var iconPixel = new TPixel(16, 34);
    var tIcon = new TIcon(iconUrl, iconSize, {anchor: iconPixel});
    var marker = new TMarker(lnglat, {icon: tIcon});
    return marker;
};


AddMyMenu = function (map) {
    var me = this;
    var menu = new TContextMenu();
    var txtMenuItem = [
        {
            text: '设为起点',
            callback: function (lonlat) {
                var distance = new AdvisePoint(map, lonlat);
                distance.Search();
                startFeature = CreateFeature(lonlat);
                map.addOverLay(startFeature);
            }
        },
        {
            text: '缩小',
            callback: function () {
            }
        }
    ];
    for (var i = 0; i < txtMenuItem.length; i++) {
        var options = new TMenuItemOptions();
        options.width = 100;
        menu.addItem(new TMenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, options));
    }
    map.addContextMenu(menu);
};

