define(["./when-54335d57","./Transforms-251ff661","./Cartesian2-697a9954","./Check-f3fec9b0","./ComponentDatatype-417761a2","./GeometryAttribute-7ca1c9e4","./GeometryAttributes-caa08d6c","./Math-737a2579","./RuntimeError-88a32665","./WebGLConstants-4739ce15"],function(r,a,i,e,o,u,c,t,n,s){"use strict";function y(){this._workerName="createPlaneOutlineGeometry"}y.packedLength=0,y.pack=function(e,t){return t},y.unpack=function(e,t,n){return r.defined(n)?n:new y};var m=new i.Cartesian3(-.5,-.5,0),p=new i.Cartesian3(.5,.5,0);return y.createGeometry=function(){var e=new c.GeometryAttributes,t=new Uint16Array(8),n=new Float64Array(12);return n[0]=m.x,n[1]=m.y,n[2]=m.z,n[3]=p.x,n[4]=m.y,n[5]=m.z,n[6]=p.x,n[7]=p.y,n[8]=m.z,n[9]=m.x,n[10]=p.y,n[11]=m.z,e.position=new u.GeometryAttribute({componentDatatype:o.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:n}),t[0]=0,t[1]=1,t[2]=1,t[3]=2,t[4]=2,t[5]=3,t[6]=3,t[7]=0,new u.Geometry({attributes:e,indices:t,primitiveType:u.PrimitiveType.LINES,boundingSphere:new a.BoundingSphere(i.Cartesian3.ZERO,Math.sqrt(2))})},function(e,t){return r.defined(t)&&(e=y.unpack(e,t)),y.createGeometry(e)}});
