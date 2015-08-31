
var University = [];
University[0] = ['中南大学 ',28.1646480000,112.9368740000];
University[1] = ['湖南大学',28.1799770000,112.9440460000];
University[2] = ['湖南师范大学',28.2005120000,113.0770650000];
University[3] = ['长沙理工大学',28.1287540000,113.0467450000];
University[4] = ['湖南农业大学',28.3030930000,113.8333660000];
University[5] = ['中南林业科技大学',28.1336310000,112.9957660000];
University[6] = ['湖南商学院',28.2204880000,112.9160840000];
University[7] = ['长沙学院',28.2956050000,112.8746190000];
University[8] = ['湖南第一师范',28.1915870000,112.8711850000];
University[9] = ['长沙医学院',28.2261980000,112.9090190000];
University[10] = ['湖南涉外经济学院',28.2027510000,112.8737720000];
University[11] = ['湖南师范大学树达学院',28.2062030000,113.0664140000];
University[12] = ['长沙理工大学城南学院',28.1584190000,112.9766240000];
University[13] = ['湖南中医药大学湘杏学院',28.1645660000,112.9967420000];
University[14] = ['湖南商学院北津学院',28.2685150000,112.9578320000];
University[15] = ['中南林业科技大学涉外学院',28.1323970000,112.9926530000];
University[16] = ['湖南农业大学东方科技学院',28.1852230000,113.0817640000];



function showPosition(marker, name, winHtml)
{
    var info = marker.openInfoWinHtml(winHtml);
    info.setTitle(name);
}

ParseResult = function (mapobj, obj) {
    htmlStr = '<div id = "resultpanel" style="position:absolute;left:820px;"> ' +
            '<div id="resultDiv" class="result"> ' +
            '<div id="searchDiv"></div> ' +
            '<div id="pageDiv"> ' +
            '<input type="button" value="第一页" onClick="localsearch.firstPage()"/> ' +
            '<input type="button" value="上一页" onClick="localsearch.previousPage()"/> ' +
            '<input type="button" value="下一页" onClick="localsearch.nextPage()"/> ' +
            '<input type="button" value="最后一页" onClick="localsearch.lastPage()"/>' +
            '<br/> ' +
            '转到第<input type="text" value="1" id="pageId" size="3"/>页 ' +
            '<input type="button" onClick="localsearch.gotoPage(parseInt(document.getElementById(\'pageId\').value));" value="转到"/> ' +
            '</div>' +
            ' </div> '
    if (obj)
    {
        var divMarker = document.createElement("div");
        var zoomArr = [];
        for (var i = 0; i < obj.length; i++)
        {
            (function (i) {
                var name = obj[i].name;
                var address = obj[i].address;
                var lnglatArr = obj[i].lonlat.split(" ");
                var lnglat = new TLngLat(lnglatArr[0], lnglatArr[1]);

                var winHtml = "地址:" + address;

                var marker = new TMarker(lnglat);
                mapobj.addOverLay(marker);
                TEvent.bind(marker, "click", marker, function () {
                    var info = marker.openInfoWinHtml(winHtml);
                    info.setTitle(name);
                });
                zoomArr.push(lnglat);

                var a = document.createElement("a");
                a.href = "javascript://";
                a.innerHTML = name;
                a.onclick = function () {
                    showPosition(marker, name, winHtml);
                }
                divMarker.appendChild(document.createTextNode((i + 1) + "."));
                divMarker.appendChild(a);
                divMarker.appendChild(document.createElement("br"));
            })(i);
        }
        $(htmlStr).appendTo($("body"));
        divMarker.appendChild(document.createTextNode('共' + localsearch.getCountNumber() + '条记录，分' + localsearch.getCountPage() + '页,当前第' + localsearch.getPageIndex() + '页'));
        document.getElementById("searchDiv").appendChild(divMarker);
        document.getElementById("resultDiv").style.display = "block";
    }
};

AdvisePoint = function (mapobj, lonlatobj) {

    this.corObj = lonlatobj;
    this.map = mapobj;
    this.regularCorArray = new Array();
    this.regularCorArray[0] = [112.98763, 28.21229];
    this.regularCorArray[1] = [113.03129, 28.24062];
    this.regularCorArray[2] = [112.92921, 28.18563];
    this.regularCorArray[3] = [112.95637, 28.19663];
    this.regularCorArray[4] = [112.93057, 28.11699];
};

AdvisePoint.prototype.Search = function () {
    var config = {
        pageCapacity: 10,
        onSearchComplete: this.localSearchResult
    };
    localsearch = new TLocalSearch(this.map, config);
    localsearch.searchNearby('公园', this.corObj, 1000);
};

AdvisePoint.prototype.localSearchResult = function (result) {
    ParseResult(this.map, result.getPois());
};

