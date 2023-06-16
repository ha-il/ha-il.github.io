"use strict";(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[84],{3204:function(e){const t=/[\p{Lu}]/u,a=/[\p{Ll}]/u,r=/^[\p{Lu}](?![\p{Lu}])/gu,n=/([\p{Alpha}\p{N}_]|$)/u,s=/[_.\- ]+/,l=new RegExp("^"+s.source),i=new RegExp(s.source+n.source,"gu"),o=new RegExp("\\d+"+n.source,"gu"),c=(e,n)=>{if("string"!=typeof e&&!Array.isArray(e))throw new TypeError("Expected the input to be `string | string[]`");if(n={pascalCase:!1,preserveConsecutiveUppercase:!1,...n},0===(e=Array.isArray(e)?e.map((e=>e.trim())).filter((e=>e.length)).join("-"):e.trim()).length)return"";const s=!1===n.locale?e=>e.toLowerCase():e=>e.toLocaleLowerCase(n.locale),c=!1===n.locale?e=>e.toUpperCase():e=>e.toLocaleUpperCase(n.locale);if(1===e.length)return n.pascalCase?c(e):s(e);return e!==s(e)&&(e=((e,r,n)=>{let s=!1,l=!1,i=!1;for(let o=0;o<e.length;o++){const c=e[o];s&&t.test(c)?(e=e.slice(0,o)+"-"+e.slice(o),s=!1,i=l,l=!0,o++):l&&i&&a.test(c)?(e=e.slice(0,o-1)+"-"+e.slice(o-1),i=l,l=!1,s=!0):(s=r(c)===c&&n(c)!==c,i=l,l=n(c)===c&&r(c)!==c)}return e})(e,s,c)),e=e.replace(l,""),e=n.preserveConsecutiveUppercase?((e,t)=>(r.lastIndex=0,e.replace(r,(e=>t(e)))))(e,s):s(e),n.pascalCase&&(e=c(e.charAt(0))+e.slice(1)),((e,t)=>(i.lastIndex=0,o.lastIndex=0,e.replace(i,((e,a)=>t(a))).replace(o,(e=>t(e)))))(e,c)};e.exports=c,e.exports.default=c},8032:function(e,t,a){a.d(t,{G:function(){return z},L:function(){return b},M:function(){return x},P:function(){return C},S:function(){return G},_:function(){return o},a:function(){return i},b:function(){return p},c:function(){return d},g:function(){return g},h:function(){return u},w:function(){return h}});var r=a(5785),n=a(7294),s=(a(3204),a(5697)),l=a.n(s);function i(){return i=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},i.apply(this,arguments)}function o(e,t){if(null==e)return{};var a,r,n={},s=Object.keys(e);for(r=0;r<s.length;r++)t.indexOf(a=s[r])>=0||(n[a]=e[a]);return n}const c=["images","placeholder"],u=()=>"undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype;const d=e=>{var t;return(e=>{var t,a;return Boolean(null==e||null==(t=e.images)||null==(a=t.fallback)?void 0:a.src)})(e)?e:(e=>Boolean(null==e?void 0:e.gatsbyImageData))(e)?e.gatsbyImageData:(e=>Boolean(null==e?void 0:e.gatsbyImage))(e)?e.gatsbyImage:null==e||null==(t=e.childImageSharp)?void 0:t.gatsbyImageData};function m(e,t,a){const r={};let n="gatsby-image-wrapper";return"fixed"===a?(r.width=e,r.height=t):"constrained"===a&&(n="gatsby-image-wrapper gatsby-image-wrapper-constrained"),{className:n,"data-gatsby-image-wrapper":"",style:r}}function p(e,t,a,r,n){return void 0===n&&(n={}),i({},a,{loading:r,shouldLoad:e,"data-main-image":"",style:i({},n,{opacity:t?1:0})})}function g(e,t,a,r,n,s,l,o){const c={};s&&(c.backgroundColor=s,"fixed"===a?(c.width=r,c.height=n,c.backgroundColor=s,c.position="relative"):("constrained"===a||"fullWidth"===a)&&(c.position="absolute",c.top=0,c.left=0,c.bottom=0,c.right=0)),l&&(c.objectFit=l),o&&(c.objectPosition=o);const u=i({},e,{"aria-hidden":!0,"data-placeholder-image":"",style:i({opacity:t?0:1,transition:"opacity 500ms linear"},c)});return u}function h(e,t){var a,n;const{images:s,placeholder:l}=e,u=i({},o(e,c),{images:i({},s,{sources:[]}),placeholder:l&&i({},l,{sources:[]})});var d;return t.forEach((t=>{var a;let{media:n,image:s}=t;n&&(s.layout,e.layout,(a=u.images.sources).push.apply(a,(0,r.Z)(s.images.sources.map((e=>i({},e,{media:n})))).concat([{media:n,srcSet:s.images.fallback.srcSet}])),u.placeholder&&u.placeholder.sources.push({media:n,srcSet:s.placeholder.fallback}))})),(a=u.images.sources).push.apply(a,(0,r.Z)(s.sources)),null!=l&&l.sources&&(null==(d=u.placeholder)||(n=d.sources).push.apply(n,(0,r.Z)(l.sources))),u}const y=["children"],f=function(e){let{layout:t,width:a,height:r}=e;return"fullWidth"===t?n.createElement("div",{"aria-hidden":!0,style:{paddingTop:r/a*100+"%"}}):"constrained"===t?n.createElement("div",{style:{maxWidth:a,display:"block"}},n.createElement("img",{alt:"",role:"presentation","aria-hidden":"true",src:"data:image/svg+xml;charset=utf-8,%3Csvg%20height='"+r+"'%20width='"+a+"'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E",style:{maxWidth:"100%",display:"block",position:"static"}})):null},b=function(e){let{children:t}=e,a=o(e,y);return n.createElement(n.Fragment,null,n.createElement(f,i({},a)),t,null)},v=["src","srcSet","loading","alt","shouldLoad"],w=["fallback","sources","shouldLoad"],E=function(e){let{src:t,srcSet:a,loading:r,alt:s="",shouldLoad:l}=e,c=o(e,v);return n.createElement("img",i({},c,{decoding:"async",loading:r,src:l?t:void 0,"data-src":l?void 0:t,srcSet:l?a:void 0,"data-srcset":l?void 0:a,alt:s}))},k=function(e){let{fallback:t,sources:a=[],shouldLoad:r=!0}=e,s=o(e,w);const l=s.sizes||(null==t?void 0:t.sizes),c=n.createElement(E,i({},s,t,{sizes:l,shouldLoad:r}));return a.length?n.createElement("picture",null,a.map((e=>{let{media:t,srcSet:a,type:s}=e;return n.createElement("source",{key:t+"-"+s+"-"+a,type:s,media:t,srcSet:r?a:void 0,"data-srcset":r?void 0:a,sizes:l})})),c):c};var L;E.propTypes={src:s.string.isRequired,alt:s.string.isRequired,sizes:s.string,srcSet:s.string,shouldLoad:s.bool},k.displayName="Picture",k.propTypes={alt:s.string.isRequired,shouldLoad:s.bool,fallback:s.exact({src:s.string.isRequired,srcSet:s.string,sizes:s.string}),sources:s.arrayOf(s.oneOfType([s.exact({media:s.string.isRequired,type:s.string,sizes:s.string,srcSet:s.string.isRequired}),s.exact({media:s.string,type:s.string.isRequired,sizes:s.string,srcSet:s.string.isRequired})]))};const S=["fallback"],C=function(e){let{fallback:t}=e,a=o(e,S);return t?n.createElement(k,i({},a,{fallback:{src:t},"aria-hidden":!0,alt:""})):n.createElement("div",i({},a))};C.displayName="Placeholder",C.propTypes={fallback:s.string,sources:null==(L=k.propTypes)?void 0:L.sources,alt:function(e,t,a){return e[t]?new Error("Invalid prop `"+t+"` supplied to `"+a+"`. Validation failed."):null}};const x=function(e){return n.createElement(n.Fragment,null,n.createElement(k,i({},e)),n.createElement("noscript",null,n.createElement(k,i({},e,{shouldLoad:!0}))))};x.displayName="MainImage",x.propTypes=k.propTypes;const I=["as","className","class","style","image","loading","imgClassName","imgStyle","backgroundColor","objectFit","objectPosition"],N=["style","className"],T=e=>e.replace(/\n/g,""),_=function(e,t,a){for(var r=arguments.length,n=new Array(r>3?r-3:0),s=3;s<r;s++)n[s-3]=arguments[s];return e.alt||""===e.alt?l().string.apply(l(),[e,t,a].concat(n)):new Error('The "alt" prop is required in '+a+'. If the image is purely presentational then pass an empty string: e.g. alt="". Learn more: https://a11y-style-guide.com/style-guide/section-media.html')},j={image:l().object.isRequired,alt:_},O=["as","image","style","backgroundColor","className","class","onStartLoad","onLoad","onError"],R=["style","className"],q=new Set;let A,M;const P=function(e){let{as:t="div",image:r,style:s,backgroundColor:l,className:c,class:d,onStartLoad:p,onLoad:g,onError:h}=e,y=o(e,O);const{width:f,height:b,layout:v}=r,w=m(f,b,v),{style:E,className:k}=w,L=o(w,R),S=(0,n.useRef)(),C=(0,n.useMemo)((()=>JSON.stringify(r.images)),[r.images]);d&&(c=d);const x=function(e,t,a){let r="";return"fullWidth"===e&&(r='<div aria-hidden="true" style="padding-top: '+a/t*100+'%;"></div>'),"constrained"===e&&(r='<div style="max-width: '+t+'px; display: block;"><img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg%20height=\''+a+"'%20width='"+t+"'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E\" style=\"max-width: 100%; display: block; position: static;\"></div>"),r}(v,f,b);return(0,n.useEffect)((()=>{A||(A=a.e(731).then(a.bind(a,6731)).then((e=>{let{renderImageToString:t,swapPlaceholderImage:a}=e;return M=t,{renderImageToString:t,swapPlaceholderImage:a}})));const e=S.current.querySelector("[data-gatsby-image-ssr]");if(e&&u())return e.complete?(null==p||p({wasCached:!0}),null==g||g({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)):(null==p||p({wasCached:!0}),e.addEventListener("load",(function t(){e.removeEventListener("load",t),null==g||g({wasCached:!0}),setTimeout((()=>{e.removeAttribute("data-gatsby-image-ssr")}),0)}))),void q.add(C);if(M&&q.has(C))return;let t,n;return A.then((e=>{let{renderImageToString:a,swapPlaceholderImage:l}=e;S.current&&(S.current.innerHTML=a(i({isLoading:!0,isLoaded:q.has(C),image:r},y)),q.has(C)||(t=requestAnimationFrame((()=>{S.current&&(n=l(S.current,C,q,s,p,g,h))}))))})),()=>{t&&cancelAnimationFrame(t),n&&n()}}),[r]),(0,n.useLayoutEffect)((()=>{q.has(C)&&M&&(S.current.innerHTML=M(i({isLoading:q.has(C),isLoaded:q.has(C),image:r},y)),null==p||p({wasCached:!0}),null==g||g({wasCached:!0}))}),[r]),(0,n.createElement)(t,i({},L,{style:i({},E,s,{backgroundColor:l}),className:k+(c?" "+c:""),ref:S,dangerouslySetInnerHTML:{__html:x},suppressHydrationWarning:!0}))},z=(0,n.memo)((function(e){return e.image?(0,n.createElement)(P,e):null}));z.propTypes=j,z.displayName="GatsbyImage";const F=["src","__imageData","__error","width","height","aspectRatio","tracedSVGOptions","placeholder","formats","quality","transformOptions","jpgOptions","pngOptions","webpOptions","avifOptions","blurredOptions","breakpoints","outputPixelDensities"];function W(e){return function(t){let{src:a,__imageData:r,__error:s}=t,l=o(t,F);return s&&console.warn(s),r?n.createElement(e,i({image:r},l)):(console.warn("Image not loaded",a),null)}}const D=W((function(e){let{as:t="div",className:a,class:r,style:s,image:l,loading:c="lazy",imgClassName:u,imgStyle:d,backgroundColor:h,objectFit:y,objectPosition:f}=e,v=o(e,I);if(!l)return console.warn("[gatsby-plugin-image] Missing image prop"),null;r&&(a=r),d=i({objectFit:y,objectPosition:f,backgroundColor:h},d);const{width:w,height:E,layout:k,images:L,placeholder:S,backgroundColor:_}=l,j=m(w,E,k),{style:O,className:R}=j,q=o(j,N),A={fallback:void 0,sources:[]};return L.fallback&&(A.fallback=i({},L.fallback,{srcSet:L.fallback.srcSet?T(L.fallback.srcSet):void 0})),L.sources&&(A.sources=L.sources.map((e=>i({},e,{srcSet:T(e.srcSet)})))),n.createElement(t,i({},q,{style:i({},O,s,{backgroundColor:h}),className:R+(a?" "+a:"")}),n.createElement(b,{layout:k,width:w,height:E},n.createElement(C,i({},g(S,!1,k,w,E,_,y,f))),n.createElement(x,i({"data-gatsby-image-ssr":"",className:u},v,p("eager"===c,!1,A,c,d)))))})),H=function(e,t){for(var a=arguments.length,r=new Array(a>2?a-2:0),n=2;n<a;n++)r[n-2]=arguments[n];return"fullWidth"!==e.layout||"width"!==t&&"height"!==t||!e[t]?l().number.apply(l(),[e,t].concat(r)):new Error('"'+t+'" '+e[t]+" may not be passed when layout is fullWidth.")},Z=new Set(["fixed","fullWidth","constrained"]),B={src:l().string.isRequired,alt:_,width:H,height:H,sizes:l().string,layout:e=>{if(void 0!==e.layout&&!Z.has(e.layout))return new Error("Invalid value "+e.layout+'" provided for prop "layout". Defaulting to "constrained". Valid values are "fixed", "fullWidth" or "constrained".')}};D.displayName="StaticImage",D.propTypes=B;const G=W(z);G.displayName="StaticImage",G.propTypes=B},8678:function(e,t,a){var r=a(7294),n=a(1883);t.Z=e=>{let{location:t,title:a,children:s}=e;const l="/"===t.pathname;let i;return i=l?r.createElement("h1",{className:"main-heading"},r.createElement(n.Link,{to:"/"},a)):r.createElement(n.Link,{className:"header-link-home",to:"/"},a),r.createElement("div",{className:"global-wrapper","data-is-root-path":l},r.createElement("header",{className:"global-header"},i),r.createElement("main",null,s),r.createElement("footer",null,"© ",(new Date).getFullYear(),", Built with"," ",r.createElement("a",{href:"https://www.gatsbyjs.com"},"Gatsby")))}},9357:function(e,t,a){var r=a(7294),n=a(1883);t.Z=e=>{var t,a,s;let{description:l,title:i,children:o}=e;const{site:c}=(0,n.useStaticQuery)("2841359383"),u=l||c.siteMetadata.description,d=null===(t=c.siteMetadata)||void 0===t?void 0:t.title;return r.createElement(r.Fragment,null,r.createElement("title",null,d?i+" | "+d:i),r.createElement("meta",{name:"description",content:u}),r.createElement("meta",{property:"og:title",content:i}),r.createElement("meta",{property:"og:description",content:u}),r.createElement("meta",{property:"og:type",content:"website"}),r.createElement("meta",{name:"twitter:card",content:"summary"}),r.createElement("meta",{name:"twitter:creator",content:(null===(a=c.siteMetadata)||void 0===a||null===(s=a.social)||void 0===s?void 0:s.twitter)||""}),r.createElement("meta",{name:"twitter:title",content:i}),r.createElement("meta",{name:"twitter:description",content:u}),o)}}}]);
//# sourceMappingURL=cd7d5f864fc9e15ed8adef086269b0aeff617554-c76df311fdf943185425.js.map