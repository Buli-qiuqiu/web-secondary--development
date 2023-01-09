define(["./Cartesian2-697a9954","./AttributeCompression-ab5c33b7","./Math-737a2579","./IndexDatatype-c134ea39","./createTaskProcessorWorker","./Check-f3fec9b0","./when-54335d57","./WebGLConstants-4739ce15"],function(P,L,S,_,a,e,r,n){"use strict";var G=32767,W=new P.Cartographic,B=new P.Cartesian3;var z=new P.Rectangle,H=new P.Ellipsoid,O=new P.Cartesian3,Y={min:void 0,max:void 0};var Z=new P.Cartesian3,j=new P.Cartesian3,q=new P.Cartesian3,J=new P.Cartesian3,K=new P.Cartesian3;return a(function(a,e){var r=new Uint16Array(a.positions),n=new Uint16Array(a.widths),t=new Uint32Array(a.counts),i=new Uint16Array(a.batchIds);!function(a){a=new Float64Array(a);var e=0;Y.min=a[e++],Y.max=a[e++],P.Rectangle.unpack(a,2,z),e+=P.Rectangle.packedLength,P.Ellipsoid.unpack(a,e,H),e+=P.Ellipsoid.packedLength,P.Cartesian3.unpack(a,e,O)}(a.packedBuffer);for(var a=H,s=O,u=function(a,e,r,n,t){var i=a.length/3,s=a.subarray(0,i),u=a.subarray(i,2*i),c=a.subarray(2*i,3*i);L.AttributeCompression.zigZagDeltaDecode(s,u,c);for(var o=new Float64Array(a.length),f=0;f<i;++f){var p=s[f],C=u[f],d=c[f],p=S.CesiumMath.lerp(e.west,e.east,p/G),C=S.CesiumMath.lerp(e.south,e.north,C/G),d=S.CesiumMath.lerp(r,n,d/G),d=P.Cartographic.fromRadians(p,C,d,W),d=t.cartographicToCartesian(d,B);P.Cartesian3.pack(d,o,3*f)}return o}(r,z,Y.min,Y.max,a),a=4*(r=u.length/3)-4,c=new Float32Array(3*a),o=new Float32Array(3*a),f=new Float32Array(3*a),p=new Float32Array(2*a),C=new Uint16Array(a),d=0,b=0,w=0,h=0,l=t.length,y=0;y<l;++y){for(var k,v=t[y],A=n[y],g=i[y],m=0;m<v;++m){0===m?(E=P.Cartesian3.unpack(u,3*h,Z),x=P.Cartesian3.unpack(u,3*(h+1),j),k=P.Cartesian3.subtract(E,x,q),P.Cartesian3.add(E,k,k)):k=P.Cartesian3.unpack(u,3*(h+m-1),q);var x,E,D,I=P.Cartesian3.unpack(u,3*(h+m),J);m===v-1?(x=P.Cartesian3.unpack(u,3*(h+v-1),Z),E=P.Cartesian3.unpack(u,3*(h+v-2),j),D=P.Cartesian3.subtract(x,E,K),P.Cartesian3.add(x,D,D)):D=P.Cartesian3.unpack(u,3*(h+m+1),K),P.Cartesian3.subtract(k,s,k),P.Cartesian3.subtract(I,s,I),P.Cartesian3.subtract(D,s,D);for(var T=m===v-1?2:4,U=0===m?2:0;U<T;++U){P.Cartesian3.pack(I,c,d),P.Cartesian3.pack(k,o,d),P.Cartesian3.pack(D,f,d),d+=3;var F=U-2<0?-1:1;p[b++]=U%2*2-1,p[b++]=F*A,C[w++]=g}}h+=v}var N=_.IndexDatatype.createTypedArray(a,6*r-6),R=0,M=0,l=r-1;for(y=0;y<l;++y)N[M++]=R,N[M++]=R+2,N[M++]=R+1,N[M++]=R+1,N[M++]=R+2,N[M++]=R+3,R+=4;return e.push(c.buffer,o.buffer,f.buffer),e.push(p.buffer,C.buffer,N.buffer),{indexDatatype:2===N.BYTES_PER_ELEMENT?_.IndexDatatype.UNSIGNED_SHORT:_.IndexDatatype.UNSIGNED_INT,currentPositions:c.buffer,previousPositions:o.buffer,nextPositions:f.buffer,expandAndWidth:p.buffer,batchIds:C.buffer,indices:N.buffer}})});
