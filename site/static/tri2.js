/*! poly2tri v1.3.5 | (c) 2009-2014 Poly2Tri Contributors */
!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.poly2tri=t()}}(function(){return function t(n,e,i){function o(s,p){if(!e[s]){if(!n[s]){var a="function"==typeof require&&require;if(!p&&a)return a(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var h=e[s]={exports:{}};n[s][0].call(h.exports,function(t){var e=n[s][1][t];return o(e?e:t)},h,h.exports,t,n,e,i)}return e[s].exports}for(var r="function"==typeof require&&require,s=0;s<i.length;s++)o(i[s]);return o}({1:[function(t,n){n.exports={version:"1.3.5"}},{}],2:[function(t,n){"use strict";var e=function(t,n){this.point=t,this.triangle=n||null,this.next=null,this.prev=null,this.value=t.x},i=function(t,n){this.head_=t,this.tail_=n,this.search_node_=t};i.prototype.head=function(){return this.head_},i.prototype.setHead=function(t){this.head_=t},i.prototype.tail=function(){return this.tail_},i.prototype.setTail=function(t){this.tail_=t},i.prototype.search=function(){return this.search_node_},i.prototype.setSearch=function(t){this.search_node_=t},i.prototype.findSearchNode=function(){return this.search_node_},i.prototype.locateNode=function(t){var n=this.search_node_;if(t<n.value){for(;n=n.prev;)if(t>=n.value)return this.search_node_=n,n}else for(;n=n.next;)if(t<n.value)return this.search_node_=n.prev,n.prev;return null},i.prototype.locatePoint=function(t){var n=t.x,e=this.findSearchNode(n),i=e.point.x;if(n===i){if(t!==e.point)if(t===e.prev.point)e=e.prev;else{if(t!==e.next.point)throw new Error("poly2tri Invalid AdvancingFront.locatePoint() call");e=e.next}}else if(i>n)for(;(e=e.prev)&&t!==e.point;);else for(;(e=e.next)&&t!==e.point;);return e&&(this.search_node_=e),e},n.exports=i,n.exports.Node=e},{}],3:[function(t,n){"use strict";function e(t,n){if(!t)throw new Error(n||"Assert Failed")}n.exports=e},{}],4:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n){this.x=+t||0,this.y=+n||0,this._p2t_edge_list=null};i.prototype.toString=function(){return e.toStringBase(this)},i.prototype.toJSON=function(){return{x:this.x,y:this.y}},i.prototype.clone=function(){return new i(this.x,this.y)},i.prototype.set_zero=function(){return this.x=0,this.y=0,this},i.prototype.set=function(t,n){return this.x=+t||0,this.y=+n||0,this},i.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},i.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},i.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},i.prototype.mul=function(t){return this.x*=t,this.y*=t,this},i.prototype.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},i.prototype.normalize=function(){var t=this.length();return this.x/=t,this.y/=t,t},i.prototype.equals=function(t){return this.x===t.x&&this.y===t.y},i.negate=function(t){return new i(-t.x,-t.y)},i.add=function(t,n){return new i(t.x+n.x,t.y+n.y)},i.sub=function(t,n){return new i(t.x-n.x,t.y-n.y)},i.mul=function(t,n){return new i(t*n.x,t*n.y)},i.cross=function(t,n){return"number"==typeof t?"number"==typeof n?t*n:new i(-t*n.y,t*n.x):"number"==typeof n?new i(n*t.y,-n*t.x):t.x*n.y-t.y*n.x},i.toString=e.toString,i.compare=e.compare,i.cmp=e.compare,i.equals=e.equals,i.dot=function(t,n){return t.x*n.x+t.y*n.y},n.exports=i},{"./xy":11}],5:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n){this.name="PointError",this.points=n=n||[],this.message=t||"Invalid Points!";for(var i=0;i<n.length;i++)this.message+=" "+e.toString(n[i])};i.prototype=new Error,i.prototype.constructor=i,n.exports=i},{"./xy":11}],6:[function(t,n,e){(function(n){"use strict";var i=n.poly2tri;e.noConflict=function(){return n.poly2tri=i,e},e.VERSION=t("../dist/version.json").version,e.PointError=t("./pointerror"),e.Point=t("./point"),e.Triangle=t("./triangle"),e.SweepContext=t("./sweepcontext");var o=t("./sweep");e.triangulate=o.triangulate,e.sweep={Triangulate:o.triangulate}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../dist/version.json":1,"./point":4,"./pointerror":5,"./sweep":7,"./sweepcontext":8,"./triangle":9}],7:[function(t,n,e){"use strict";function i(t){t.initTriangulation(),t.createAdvancingFront(),o(t),r(t)}function o(t){var n,e=t.pointCount();for(n=1;e>n;++n)for(var i=t.getPoint(n),o=s(t,i),r=i._p2t_edge_list,a=0;r&&a<r.length;++a)p(t,r[a],o)}function r(t){for(var n=t.front().head().next.triangle,e=t.front().head().next.point;!n.getConstrainedEdgeCW(e);)n=n.neighborCCW(e);t.meshClean(n)}function s(t,n){var e=t.locateNode(n),i=u(t,n,e);return n.x<=e.point.x+F&&d(t,e),g(t,i),i}function p(t,n,e){t.edge_event.constrained_edge=n,t.edge_event.right=n.p.x>n.q.x,h(e.triangle,n.p,n.q)||(C(t,n,e),a(t,n.p,n.q,e.triangle,n.q))}function a(t,n,e,i,o){if(!h(i,n,e)){var r=i.pointCCW(o),s=z(e,r,n);if(s===M.COLLINEAR)throw new D("poly2tri EdgeEvent: Collinear not supported!",[e,r,n]);var p=i.pointCW(o),u=z(e,p,n);if(u===M.COLLINEAR)throw new D("poly2tri EdgeEvent: Collinear not supported!",[e,p,n]);s===u?(i=s===M.CW?i.neighborCCW(o):i.neighborCW(o),a(t,n,e,i,o)):q(t,n,e,i,o)}}function h(t,n,e){var i=t.edgeIndex(n,e);if(-1!==i){t.markConstrainedEdgeByIndex(i);var o=t.getNeighbor(i);return o&&o.markConstrainedEdgeByPoints(n,e),!0}return!1}function u(t,n,e){var i=new O(n,e.point,e.next.point);i.markNeighbor(e.triangle),t.addToMap(i);var o=new B(n);return o.next=e.next,o.prev=e,e.next.prev=o,e.next=o,l(t,i)||t.mapTriangleToNodes(i),o}function d(t,n){var e=new O(n.prev.point,n.point,n.next.point);e.markNeighbor(n.prev.triangle),e.markNeighbor(n.triangle),t.addToMap(e),n.prev.next=n.next,n.next.prev=n.prev,l(t,e)||t.mapTriangleToNodes(e)}function g(t,n){for(var e=n.next;e.next&&!j(e.point,e.next.point,e.prev.point);)d(t,e),e=e.next;for(e=n.prev;e.prev&&!j(e.point,e.next.point,e.prev.point);)d(t,e),e=e.prev;n.next&&n.next.next&&f(n)&&y(t,n)}function f(t){var n=t.point.x-t.next.next.point.x,e=t.point.y-t.next.next.point.y;return S(e>=0,"unordered y"),n>=0||Math.abs(n)<e}function l(t,n){for(var e=0;3>e;++e)if(!n.delaunay_edge[e]){var i=n.getNeighbor(e);if(i){var o=n.getPoint(e),r=i.oppositePoint(n,o),s=i.index(r);if(i.constrained_edge[s]||i.delaunay_edge[s]){n.constrained_edge[e]=i.constrained_edge[s];continue}var p=c(o,n.pointCCW(o),n.pointCW(o),r);if(p){n.delaunay_edge[e]=!0,i.delaunay_edge[s]=!0,_(n,o,i,r);var a=!l(t,n);return a&&t.mapTriangleToNodes(n),a=!l(t,i),a&&t.mapTriangleToNodes(i),n.delaunay_edge[e]=!1,i.delaunay_edge[s]=!1,!0}}}return!1}function c(t,n,e,i){var o=t.x-i.x,r=t.y-i.y,s=n.x-i.x,p=n.y-i.y,a=o*p,h=s*r,u=a-h;if(0>=u)return!1;var d=e.x-i.x,g=e.y-i.y,f=d*r,l=o*g,c=f-l;if(0>=c)return!1;var _=s*g,y=d*p,x=o*o+r*r,v=s*s+p*p,C=d*d+g*g,b=x*(_-y)+v*c+C*u;return b>0}function _(t,n,e,i){var o,r,s,p;o=t.neighborCCW(n),r=t.neighborCW(n),s=e.neighborCCW(i),p=e.neighborCW(i);var a,h,u,d;a=t.getConstrainedEdgeCCW(n),h=t.getConstrainedEdgeCW(n),u=e.getConstrainedEdgeCCW(i),d=e.getConstrainedEdgeCW(i);var g,f,l,c;g=t.getDelaunayEdgeCCW(n),f=t.getDelaunayEdgeCW(n),l=e.getDelaunayEdgeCCW(i),c=e.getDelaunayEdgeCW(i),t.legalize(n,i),e.legalize(i,n),e.setDelaunayEdgeCCW(n,g),t.setDelaunayEdgeCW(n,f),t.setDelaunayEdgeCCW(i,l),e.setDelaunayEdgeCW(i,c),e.setConstrainedEdgeCCW(n,a),t.setConstrainedEdgeCW(n,h),t.setConstrainedEdgeCCW(i,u),e.setConstrainedEdgeCW(i,d),t.clearNeighbors(),e.clearNeighbors(),o&&e.markNeighbor(o),r&&t.markNeighbor(r),s&&t.markNeighbor(s),p&&e.markNeighbor(p),t.markNeighbor(e)}function y(t,n){for(t.basin.left_node=z(n.point,n.next.point,n.next.next.point)===M.CCW?n.next.next:n.next,t.basin.bottom_node=t.basin.left_node;t.basin.bottom_node.next&&t.basin.bottom_node.point.y>=t.basin.bottom_node.next.point.y;)t.basin.bottom_node=t.basin.bottom_node.next;if(t.basin.bottom_node!==t.basin.left_node){for(t.basin.right_node=t.basin.bottom_node;t.basin.right_node.next&&t.basin.right_node.point.y<t.basin.right_node.next.point.y;)t.basin.right_node=t.basin.right_node.next;t.basin.right_node!==t.basin.bottom_node&&(t.basin.width=t.basin.right_node.point.x-t.basin.left_node.point.x,t.basin.left_highest=t.basin.left_node.point.y>t.basin.right_node.point.y,x(t,t.basin.bottom_node))}}function x(t,n){if(!v(t,n)){d(t,n);var e;if(n.prev!==t.basin.left_node||n.next!==t.basin.right_node){if(n.prev===t.basin.left_node){if(e=z(n.point,n.next.point,n.next.next.point),e===M.CW)return;n=n.next}else if(n.next===t.basin.right_node){if(e=z(n.point,n.prev.point,n.prev.prev.point),e===M.CCW)return;n=n.prev}else n=n.prev.point.y<n.next.point.y?n.prev:n.next;x(t,n)}}}function v(t,n){var e;return e=t.basin.left_highest?t.basin.left_node.point.y-n.point.y:t.basin.right_node.point.y-n.point.y,t.basin.width>e?!0:!1}function C(t,n,e){t.edge_event.right?b(t,n,e):E(t,n,e)}function b(t,n,e){for(;e.next.point.x<n.p.x;)z(n.q,e.next.point,n.p)===M.CCW?m(t,n,e):e=e.next}function m(t,n,e){e.point.x<n.p.x&&(z(e.point,e.next.point,e.next.next.point)===M.CCW?W(t,n,e):(w(t,n,e),m(t,n,e)))}function W(t,n,e){d(t,e.next),e.next.point!==n.p&&z(n.q,e.next.point,n.p)===M.CCW&&z(e.point,e.next.point,e.next.next.point)===M.CCW&&W(t,n,e)}function w(t,n,e){z(e.next.point,e.next.next.point,e.next.next.next.point)===M.CCW?W(t,n,e.next):z(n.q,e.next.next.point,n.p)===M.CCW&&w(t,n,e.next)}function E(t,n,e){for(;e.prev.point.x>n.p.x;)z(n.q,e.prev.point,n.p)===M.CW?P(t,n,e):e=e.prev}function P(t,n,e){e.point.x>n.p.x&&(z(e.point,e.prev.point,e.prev.prev.point)===M.CW?T(t,n,e):(N(t,n,e),P(t,n,e)))}function N(t,n,e){z(e.prev.point,e.prev.prev.point,e.prev.prev.prev.point)===M.CW?T(t,n,e.prev):z(n.q,e.prev.prev.point,n.p)===M.CW&&N(t,n,e.prev)}function T(t,n,e){d(t,e.prev),e.prev.point!==n.p&&z(n.q,e.prev.point,n.p)===M.CW&&z(e.point,e.prev.point,e.prev.prev.point)===M.CW&&T(t,n,e)}function q(t,n,e,i,o){var r=i.neighborAcross(o);S(r,"FLIP failed due to missing triangle!");var s=r.oppositePoint(i,o);if(i.getConstrainedEdgeAcross(o)){var p=i.index(o);throw new D("poly2tri Intersecting Constraints",[o,s,i.getPoint((p+1)%3),i.getPoint((p+2)%3)])}if(H(o,i.pointCCW(o),i.pointCW(o),s))if(_(i,o,r,s),t.mapTriangleToNodes(i),t.mapTriangleToNodes(r),o===e&&s===n)e===t.edge_event.constrained_edge.q&&n===t.edge_event.constrained_edge.p&&(i.markConstrainedEdgeByPoints(n,e),r.markConstrainedEdgeByPoints(n,e),l(t,i),l(t,r));else{var h=z(e,s,n);i=I(t,h,i,r,o,s),q(t,n,e,i,o)}else{var u=k(n,e,r,s);A(t,n,e,i,r,u),a(t,n,e,i,o)}}function I(t,n,e,i,o,r){var s;return n===M.CCW?(s=i.edgeIndex(o,r),i.delaunay_edge[s]=!0,l(t,i),i.clearDelaunayEdges(),e):(s=e.edgeIndex(o,r),e.delaunay_edge[s]=!0,l(t,e),e.clearDelaunayEdges(),i)}function k(t,n,e,i){var o=z(n,i,t);if(o===M.CW)return e.pointCCW(i);if(o===M.CCW)return e.pointCW(i);throw new D("poly2tri [Unsupported] nextFlipPoint: opposing point on constrained edge!",[n,i,t])}function A(t,n,e,i,o,r){var s=o.neighborAcross(r);S(s,"FLIP failed due to missing triangle");var p=s.oppositePoint(o,r);if(H(e,i.pointCCW(e),i.pointCW(e),p))q(t,e,p,s,p);else{var a=k(n,e,s,p);A(t,n,e,i,s,a)}}var S=t("./assert"),D=t("./pointerror"),O=t("./triangle"),B=t("./advancingfront").Node,L=t("./utils"),F=L.EPSILON,M=L.Orientation,z=L.orient2d,H=L.inScanArea,j=L.isAngleObtuse;e.triangulate=i},{"./advancingfront":2,"./assert":3,"./pointerror":5,"./triangle":9,"./utils":10}],8:[function(t,n){"use strict";var e=t("./pointerror"),i=t("./point"),o=t("./triangle"),r=t("./sweep"),s=t("./advancingfront"),p=s.Node,a=.3,h=function(t,n){if(this.p=t,this.q=n,t.y>n.y)this.q=t,this.p=n;else if(t.y===n.y)if(t.x>n.x)this.q=t,this.p=n;else if(t.x===n.x)throw new e("poly2tri Invalid Edge constructor: repeated points!",[t]);this.q._p2t_edge_list||(this.q._p2t_edge_list=[]),this.q._p2t_edge_list.push(this)},u=function(){this.left_node=null,this.bottom_node=null,this.right_node=null,this.width=0,this.left_highest=!1};u.prototype.clear=function(){this.left_node=null,this.bottom_node=null,this.right_node=null,this.width=0,this.left_highest=!1};var d=function(){this.constrained_edge=null,this.right=!1},g=function(t,n){n=n||{},this.triangles_=[],this.map_=[],this.points_=n.cloneArrays?t.slice(0):t,this.edge_list=[],this.pmin_=this.pmax_=null,this.front_=null,this.head_=null,this.tail_=null,this.af_head_=null,this.af_middle_=null,this.af_tail_=null,this.basin=new u,this.edge_event=new d,this.initEdges(this.points_)};g.prototype.addHole=function(t){this.initEdges(t);var n,e=t.length;for(n=0;e>n;n++)this.points_.push(t[n]);return this},g.prototype.AddHole=g.prototype.addHole,g.prototype.addHoles=function(t){var n,e=t.length;for(n=0;e>n;n++)this.initEdges(t[n]);return this.points_=this.points_.concat.apply(this.points_,t),this},g.prototype.addPoint=function(t){return this.points_.push(t),this},g.prototype.AddPoint=g.prototype.addPoint,g.prototype.addPoints=function(t){return this.points_=this.points_.concat(t),this},g.prototype.triangulate=function(){return r.triangulate(this),this},g.prototype.getBoundingBox=function(){return{min:this.pmin_,max:this.pmax_}},g.prototype.getTriangles=function(){return this.triangles_},g.prototype.GetTriangles=g.prototype.getTriangles,g.prototype.front=function(){return this.front_},g.prototype.pointCount=function(){return this.points_.length},g.prototype.head=function(){return this.head_},g.prototype.setHead=function(t){this.head_=t},g.prototype.tail=function(){return this.tail_},g.prototype.setTail=function(t){this.tail_=t},g.prototype.getMap=function(){return this.map_},g.prototype.initTriangulation=function(){var t,n=this.points_[0].x,e=this.points_[0].x,o=this.points_[0].y,r=this.points_[0].y,s=this.points_.length;for(t=1;s>t;t++){var p=this.points_[t];p.x>n&&(n=p.x),p.x<e&&(e=p.x),p.y>o&&(o=p.y),p.y<r&&(r=p.y)}this.pmin_=new i(e,r),this.pmax_=new i(n,o);var h=a*(n-e),u=a*(o-r);this.head_=new i(n+h,r-u),this.tail_=new i(e-h,r-u),this.points_.sort(i.compare)},g.prototype.initEdges=function(t){var n,e=t.length;for(n=0;e>n;++n)this.edge_list.push(new h(t[n],t[(n+1)%e]))},g.prototype.getPoint=function(t){return this.points_[t]},g.prototype.addToMap=function(t){this.map_.push(t)},g.prototype.locateNode=function(t){return this.front_.locateNode(t.x)},g.prototype.createAdvancingFront=function(){var t,n,e,i=new o(this.points_[0],this.tail_,this.head_);this.map_.push(i),t=new p(i.getPoint(1),i),n=new p(i.getPoint(0),i),e=new p(i.getPoint(2)),this.front_=new s(t,e),t.next=n,n.next=e,n.prev=t,e.prev=n},g.prototype.removeNode=function(){},g.prototype.mapTriangleToNodes=function(t){for(var n=0;3>n;++n)if(!t.getNeighbor(n)){var e=this.front_.locatePoint(t.pointCW(t.getPoint(n)));e&&(e.triangle=t)}},g.prototype.removeFromMap=function(t){var n,e=this.map_,i=e.length;for(n=0;i>n;n++)if(e[n]===t){e.splice(n,1);break}},g.prototype.meshClean=function(t){for(var n,e,i=[t];n=i.pop();)if(!n.isInterior())for(n.setInterior(!0),this.triangles_.push(n),e=0;3>e;e++)n.constrained_edge[e]||i.push(n.getNeighbor(e))},n.exports=g},{"./advancingfront":2,"./point":4,"./pointerror":5,"./sweep":7,"./triangle":9}],9:[function(t,n){"use strict";var e=t("./xy"),i=function(t,n,e){this.points_=[t,n,e],this.neighbors_=[null,null,null],this.interior_=!1,this.constrained_edge=[!1,!1,!1],this.delaunay_edge=[!1,!1,!1]},o=e.toString;i.prototype.toString=function(){return"["+o(this.points_[0])+o(this.points_[1])+o(this.points_[2])+"]"},i.prototype.getPoint=function(t){return this.points_[t]},i.prototype.GetPoint=i.prototype.getPoint,i.prototype.getPoints=function(){return this.points_},i.prototype.getNeighbor=function(t){return this.neighbors_[t]},i.prototype.containsPoint=function(t){var n=this.points_;return t===n[0]||t===n[1]||t===n[2]},i.prototype.containsEdge=function(t){return this.containsPoint(t.p)&&this.containsPoint(t.q)},i.prototype.containsPoints=function(t,n){return this.containsPoint(t)&&this.containsPoint(n)},i.prototype.isInterior=function(){return this.interior_},i.prototype.setInterior=function(t){return this.interior_=t,this},i.prototype.markNeighborPointers=function(t,n,e){var i=this.points_;if(t===i[2]&&n===i[1]||t===i[1]&&n===i[2])this.neighbors_[0]=e;else if(t===i[0]&&n===i[2]||t===i[2]&&n===i[0])this.neighbors_[1]=e;else{if(!(t===i[0]&&n===i[1]||t===i[1]&&n===i[0]))throw new Error("poly2tri Invalid Triangle.markNeighborPointers() call");this.neighbors_[2]=e}},i.prototype.markNeighbor=function(t){var n=this.points_;t.containsPoints(n[1],n[2])?(this.neighbors_[0]=t,t.markNeighborPointers(n[1],n[2],this)):t.containsPoints(n[0],n[2])?(this.neighbors_[1]=t,t.markNeighborPointers(n[0],n[2],this)):t.containsPoints(n[0],n[1])&&(this.neighbors_[2]=t,t.markNeighborPointers(n[0],n[1],this))},i.prototype.clearNeighbors=function(){this.neighbors_[0]=null,this.neighbors_[1]=null,this.neighbors_[2]=null},i.prototype.clearDelaunayEdges=function(){this.delaunay_edge[0]=!1,this.delaunay_edge[1]=!1,this.delaunay_edge[2]=!1},i.prototype.pointCW=function(t){var n=this.points_;return t===n[0]?n[2]:t===n[1]?n[0]:t===n[2]?n[1]:null},i.prototype.pointCCW=function(t){var n=this.points_;return t===n[0]?n[1]:t===n[1]?n[2]:t===n[2]?n[0]:null},i.prototype.neighborCW=function(t){return t===this.points_[0]?this.neighbors_[1]:t===this.points_[1]?this.neighbors_[2]:this.neighbors_[0]},i.prototype.neighborCCW=function(t){return t===this.points_[0]?this.neighbors_[2]:t===this.points_[1]?this.neighbors_[0]:this.neighbors_[1]},i.prototype.getConstrainedEdgeCW=function(t){return t===this.points_[0]?this.constrained_edge[1]:t===this.points_[1]?this.constrained_edge[2]:this.constrained_edge[0]},i.prototype.getConstrainedEdgeCCW=function(t){return t===this.points_[0]?this.constrained_edge[2]:t===this.points_[1]?this.constrained_edge[0]:this.constrained_edge[1]},i.prototype.getConstrainedEdgeAcross=function(t){return t===this.points_[0]?this.constrained_edge[0]:t===this.points_[1]?this.constrained_edge[1]:this.constrained_edge[2]},i.prototype.setConstrainedEdgeCW=function(t,n){t===this.points_[0]?this.constrained_edge[1]=n:t===this.points_[1]?this.constrained_edge[2]=n:this.constrained_edge[0]=n},i.prototype.setConstrainedEdgeCCW=function(t,n){t===this.points_[0]?this.constrained_edge[2]=n:t===this.points_[1]?this.constrained_edge[0]=n:this.constrained_edge[1]=n},i.prototype.getDelaunayEdgeCW=function(t){return t===this.points_[0]?this.delaunay_edge[1]:t===this.points_[1]?this.delaunay_edge[2]:this.delaunay_edge[0]},i.prototype.getDelaunayEdgeCCW=function(t){return t===this.points_[0]?this.delaunay_edge[2]:t===this.points_[1]?this.delaunay_edge[0]:this.delaunay_edge[1]},i.prototype.setDelaunayEdgeCW=function(t,n){t===this.points_[0]?this.delaunay_edge[1]=n:t===this.points_[1]?this.delaunay_edge[2]=n:this.delaunay_edge[0]=n},i.prototype.setDelaunayEdgeCCW=function(t,n){t===this.points_[0]?this.delaunay_edge[2]=n:t===this.points_[1]?this.delaunay_edge[0]=n:this.delaunay_edge[1]=n},i.prototype.neighborAcross=function(t){return t===this.points_[0]?this.neighbors_[0]:t===this.points_[1]?this.neighbors_[1]:this.neighbors_[2]},i.prototype.oppositePoint=function(t,n){var e=t.pointCW(n);return this.pointCW(e)},i.prototype.legalize=function(t,n){var e=this.points_;if(t===e[0])e[1]=e[0],e[0]=e[2],e[2]=n;else if(t===e[1])e[2]=e[1],e[1]=e[0],e[0]=n;else{if(t!==e[2])throw new Error("poly2tri Invalid Triangle.legalize() call");e[0]=e[2],e[2]=e[1],e[1]=n}},i.prototype.index=function(t){var n=this.points_;if(t===n[0])return 0;if(t===n[1])return 1;if(t===n[2])return 2;throw new Error("poly2tri Invalid Triangle.index() call")},i.prototype.edgeIndex=function(t,n){var e=this.points_;if(t===e[0]){if(n===e[1])return 2;if(n===e[2])return 1}else if(t===e[1]){if(n===e[2])return 0;if(n===e[0])return 2}else if(t===e[2]){if(n===e[0])return 1;if(n===e[1])return 0}return-1},i.prototype.markConstrainedEdgeByIndex=function(t){this.constrained_edge[t]=!0},i.prototype.markConstrainedEdgeByEdge=function(t){this.markConstrainedEdgeByPoints(t.p,t.q)},i.prototype.markConstrainedEdgeByPoints=function(t,n){var e=this.points_;n===e[0]&&t===e[1]||n===e[1]&&t===e[0]?this.constrained_edge[2]=!0:n===e[0]&&t===e[2]||n===e[2]&&t===e[0]?this.constrained_edge[1]=!0:(n===e[1]&&t===e[2]||n===e[2]&&t===e[1])&&(this.constrained_edge[0]=!0)},n.exports=i},{"./xy":11}],10:[function(t,n,e){"use strict";function i(t,n,e){var i=(t.x-e.x)*(n.y-e.y),o=(t.y-e.y)*(n.x-e.x),r=i-o;return r>-s&&s>r?p.COLLINEAR:r>0?p.CCW:p.CW}function o(t,n,e,i){var o=(t.x-n.x)*(i.y-n.y)-(i.x-n.x)*(t.y-n.y);if(o>=-s)return!1;var r=(t.x-e.x)*(i.y-e.y)-(i.x-e.x)*(t.y-e.y);return s>=r?!1:!0}function r(t,n,e){var i=n.x-t.x,o=n.y-t.y,r=e.x-t.x,s=e.y-t.y;return 0>i*r+o*s}var s=1e-12;e.EPSILON=s;var p={CW:1,CCW:-1,COLLINEAR:0};e.Orientation=p,e.orient2d=i,e.inScanArea=o,e.isAngleObtuse=r},{}],11:[function(t,n){"use strict";function e(t){return"("+t.x+";"+t.y+")"}function i(t){var n=t.toString();return"[object Object]"===n?e(t):n}function o(t,n){return t.y===n.y?t.x-n.x:t.y-n.y}function r(t,n){return t.x===n.x&&t.y===n.y}n.exports={toString:i,toStringBase:e,compare:o,equals:r}},{}]},{},[6])(6)});