define(function(a,b){var c=(SUI.$,a("scripts/public/helper"));b.getOrganizationInfo=function(a,b){var d=["organizationInfo.id","organizationInfo.name","organizationInfo.parent","organizationInfo.email","organizationInfo.contact","organizationInfo.description","extendedOrganizationInfo.type","extendedOrganizationInfo.credit","dynamic.numberOfMembers","dynamic.numberOfFollowers","dynamic.numberOfExecutingEvents"];return c.globalResponseHandler({url:"/api/org/"+a+"/info?session="+b+"&fields="+d.join(","),type:"GET",dataType:"JSON"})},b.createOrganization=function(a,b){return c.globalResponseHandler({url:"/api/account/create_organization",type:"POST",dataType:"JSON",data:{parentId:"",email:"",name:a,decription:"",session:b}})}});