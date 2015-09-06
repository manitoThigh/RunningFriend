<?php

header('Content-Type: text/html; charset=UTF-8');
include_once __DIR__ . '/DBconnection.php';

$toHtml = '<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>正在进入</title>
</head>
<body>
<form name=loading> 
　<p align=center> <font color="#0066ff" size="2">验证成功，将自动跳转至主页，请稍等</font><font color="#0066ff" size="2" face="Arial">...</font>
　　<input type=text name=chart size=46 style="font-family:Arial; font-weight:bolder; color:#0066ff; background-color:#fef4d9; padding:0px; border-style:none;"> 
　　
　　<input type=text name=percent size=47 style="color:#0066ff; text-align:center; border-width:medium; border-style:none;"> 
　　<script>　 
var bar=0　 
var line="||"　 
var amount="||"　 
count()　 
function count(){　 
bar=bar+2　 
amount =amount + line　 
document.loading.chart.value=amount　 
document.loading.percent.value=bar+"%"　 
if (bar<99)　 
{setTimeout("count()",100);}　 
else　 
{window.location = "/RunningFriend/home.html";}　 
}</script> 
　</p> 
</form> 
<p align="center"> 如果您的浏览器不支持跳转,<a style="text-decoration: none" href="/RunningFriend/home.html"><font color="#FF0000">请点这里</font></a>.</p>
</body>
</html>';

echo $toHtml;
$mailMd5 = $_REQUEST['active_'];
$verifyCode = $_REQUEST['code_'];
$connection = getConnection();
$sql = 'select * from userinformation where '
        . 'md5(umail) =\'' . $mailMd5 . '\' and '
        . 'verifycode = \'' . $verifyCode . '\'';
$result = pg_query($sql);
$count = pg_num_rows($result);

if ($count == 1) {
    $sql = 'update userinformation'
            . ' set hasverify = true '
            . 'where md5(umail) = \'' . $mailMd5 . '\'';
    $result = pg_query($sql);
    if (pg_affected_rows($result) == 1) {
    }
} else {
    echo '验证失败';
}
exit(-1);
?>

