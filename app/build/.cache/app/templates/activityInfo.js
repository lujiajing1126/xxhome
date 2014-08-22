/*TMODJS:{"version":1,"md5":"e16dafe2e3c33f9dfb1a39a161ed75c9"}*/
template('app/templates/activityInfo',function($data,$filename) {
'use strict';var $utils=this,$helpers=$utils.$helpers,include=function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);$out+=text;return $out;},stage=$data.stage,$escape=$utils.$escape,begin=$data.begin,$each=$utils.$each,descriptions=$data.descriptions,des=$data.des,i=$data.i,end=$data.end,location=$data.location,numberOfPeople=$data.numberOfPeople,category=$data.category,$out='';$out+='  ';
include('./partial/header');
$out+='  ';
if(stage=="drafting"){
$out+=' <section class="container container0">暂无此活动！</section> ';
}else{
$out+=' <section class="container container0"> <div class="wrapper popbox-wrapper"> <div class="imgbox image-back" style="background-image:url(\'../images/default/101.jpg\');"></div> </div> <div class="wrapper xx-title-wrapper clearfix"> <div class="focus"> <span class="type-wrapper benefit"> <span class="square">益</span> <span class="triangle left"></span> <span class="triangle right"></span> </span> </div> <div class="info"> <p class="date">';
$out+=$escape(begin);
$out+='</p> <p class="title"> <span class="org">复旦诗社</span> — <a href="undefined"> <span class="">惬意的生活，寻找生活中美丽的瞬间</span> </a> </p> </div> </div> </section> <section class="container"> <div class="wrapper article-wrapper"> <article class="article-content"> ';
$each(descriptions,function(des,i){
$out+=' <p>';
$out+=$escape(des);
$out+='</p> ';
});
$out+=' </article> <footer class="article-footer"> <p>时间：';
$out+=$escape(begin);
$out+='至';
$out+=$escape(end);
$out+='</p> <p>地址：';
$out+=$escape(location);
$out+='</p> <p>人数：';
$out+=$escape(numberOfPeople);
$out+='人</p> <p>类型：';
$out+=$escape(category);
$out+='</p> </footer> </div> </section> ';
}
$out+='  ';
include('./partial/footer');
return new String($out);
});