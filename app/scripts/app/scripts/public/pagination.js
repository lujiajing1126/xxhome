define(function(){var a=SUI.$;a.pagination=function(b,c,d){{var e,f,g=[];a("<ul>").addClass("pagination")}if(1==totalPage)return g;3>=c?(e=1,f=totalPage>5?5:totalPage):(f=totalPage>c+2?c+2:totalPage,e=f-4);for(var h=e;f>=h;h++){var i="#"+d+"?page="+h;g.push(h==c?'<li class="active"><a>'+h+"</a></li>":'<li><a href="'+i+'">'+h+"</a></li>")}return g}});