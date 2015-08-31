/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$("#aboutus").click(function ()
{
    if (!sideToggle.checked)
    {
        $("#sideToggle").trigger("click");
    }
    var me = this;
    me.html =
            '<div id="content">' +
            '<div id="information">' +
            '   <h4>刘文凯</h4>' +
            '   <h4>罗&nbsp;&nbsp;&nbsp;靓</h4>' +
            '   <h4>李晗孙白</h4>' + 
            '   <h4>张&nbsp;&nbsp;&nbsp;锐</h4>' +
            '</div>' + '</div>';
    //$(me.html).appendTo($('#sidemenu'));
    $('#content').replaceWith(me.html);
});


$("#se-road").click(function ()
{
    alert('come');
    if (!sideToggle.checked)
    {
        $("#sideToggle").trigger("click");
    }
});

