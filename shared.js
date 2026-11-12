
const FB_CONFIG={apiKey:"AIzaSyC3Xnc3Cc63B8v1nLPONlP5Up_FbGrdon4",authDomain:"beez-7c6a4.firebaseapp.com",databaseURL:"https://beez-7c6a4-default-rtdb.firebaseio.com",projectId:"beez-7c6a4",storageBucket:"beez-7c6a4.firebasestorage.app",messagingSenderId:"928305285561",appId:"1:928305285561:web:b9b46a0eebecdbd13f8e68",measurementId:"G-YZKBTPM6G0"};
const FB_BASE="https://www.gstatic.com/firebasejs/10.14.1/";
const fb=(async()=>{
 if(FB_CONFIG.apiKey.startsWith("YOUR"))return null;
 const [A,Au,D]=await Promise.all([import(FB_BASE+"firebase-app.js"),import(FB_BASE+"firebase-auth.js"),import(FB_BASE+"firebase-database.js")]);
 const app=A.initializeApp(FB_CONFIG),auth=Au.getAuth(app),db=D.getDatabase(app);
 await auth.authStateReady();
 return{Au,D,auth,db};
})().catch(e=>{console.warn("firebase init failed",e);return null});
async function fbRoom(f,name){
 const{D,db,auth}=f,me=auth.currentUser.uid,base="rooms/"+name,pr=D.ref(db,base+"/peers/"+me),ev=D.ref(db,base+"/events");
 const jr=D.push(D.ref(db,base+"/joins"));await D.set(jr,{ts:D.serverTimestamp()});
 const t0=(await D.get(jr)).val().ts;
 let cur={},pc=null;const hs={};
 const list=()=>Object.entries(cur).map(([k,v])=>({id:k,isMe:k===me,presence:v}));
 D.onDisconnect(pr).remove();
 const u1=D.onValue(D.ref(db,base+"/peers"),s=>{cur=s.val()||{};pc&&pc({peers:list()})});
 const u2=D.onChildAdded(ev,s=>{const v=s.val();if(!v||!(v.ts>=t0))return;(hs[v.topic]||[]).forEach(h=>h({data:v.data,peer:v.peer,isMe:v.peer===me}))});
 return{emit:(topic,data)=>D.push(ev,{topic,data:data||{},peer:me,ts:D.serverTimestamp()}),
  on:(t,cb)=>{(hs[t]=hs[t]||[]).push(cb)},
  presence:p=>D.set(pr,p),
  onPeers:cb=>{pc=cb;cb({peers:list()})},
  leave:()=>{u1();u2();D.remove(pr)}}}
window.claude={async use(n){
 const f=await fb;if(!f||!f.auth.currentUser)return null;
 const{D,db,auth}=f,u=auth.currentUser;
 if(n==="user")return{id:async()=>u.uid};
 if(n==="db")return{collection:()=>({
  doc:id=>({set:d=>D.set(D.ref(db,"players/"+id),{...d,name:u.displayName||""})}),
  onSnapshot:(cb,err)=>D.onValue(D.ref(db,"players"),s=>{const docs=[];s.forEach(c=>{const v=c.val();docs.push({id:c.key,data:()=>v})});cb({docs})},err)})};
 if(n==="room")return{join:name=>fbRoom(f,name)};
 return null}};

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let MY={c:0,a:0,f:0};try{const m=JSON.parse(localStorage.getItem("beez_my")||"null");if(m)MY={c:+m.c||0,a:+m.a||0,f:+m.f||0}}catch(e){}
let bid=0;const BC=["#FDB800","#ff7a59","#4ade80","#60a5fa","#c084fc","#f472b6","#f6f1e3","#2dd4bf"],BA=["none","crown","glasses","cap","bowtie","headband"],BF=["dots","happy","wink","shades"];
function beeSvg(b,s){b=b||{c:0,a:0,f:0};const id="bc"+(bid++),c=BC[b.c]||BC[0],L='stroke="#000" stroke-width="2.6" stroke-linecap="round" fill="none"';
const F=['<circle cx="41" cy="46" r="3"/><circle cx="59" cy="46" r="3"/>','<path d="M36 47q5-7 10 0M54 47q5-7 10 0" '+L+'/>','<circle cx="41" cy="46" r="3"/><path d="M54 47q5-6 10 0" '+L+'/>','<rect x="33" y="41" width="15" height="9" rx="2"/><rect x="52" y="41" width="15" height="9" rx="2"/><path d="M48 45h4" '+L+'/>'][b.f]||"";
const A=["",'<path d="M33 31l4-13 7 8 6-12 6 12 7-8 4 13z" fill="#f6f1e3" stroke="#000" stroke-width="2.5" stroke-linejoin="round"/>','<circle cx="41" cy="46" r="7.5" '+L+'/><circle cx="59" cy="46" r="7.5" '+L+'/><path d="M48.5 46h3" '+L+'/>','<path d="M30 38q20-24 40 0z" fill="#e11d48" stroke="#000" stroke-width="2.5"/><path d="M66 38h13" stroke="#000" stroke-width="4" stroke-linecap="round"/>','<path d="M50 80l-10-6v12zM50 80l10-6v12z" fill="#e11d48" stroke="#fff" stroke-width="2"/>','<path d="M27 38h46" stroke="#e11d48" stroke-width="5"/>'][b.a]||"";
return '<svg viewBox="8 6 84 84" width="'+s+'" height="'+s+'" aria-hidden="true"><clipPath id="'+id+'"><circle cx="50" cy="50" r="31"/></clipPath><circle cx="50" cy="50" r="31" fill="'+c+'"/><g clip-path="url(#'+id+')"><rect x="0" y="49.5" width="100" height="10"/><rect x="0" y="64.4" width="100" height="40"/></g><circle cx="50" cy="50" r="31" fill="none" stroke="#000" stroke-width="4"/><path d="M28.5 28L22.8 21.3M71.5 28L77.1 22.5" stroke="#000" stroke-width="3.6" stroke-linecap="round"/><g transform="translate(50 50) scale(1.07) translate(-50 -56)"><g fill="#000">'+F+'</g>'+A+'</g></svg>'}
function drawMy(){$("#bprev").innerHTML=beeSvg(MY,150);
 $("#bcol").innerHTML=BC.map((c,i)=>`<button class="sw${i==MY.c?" on":""}" data-k="c" data-v="${i}" style="background:${c}" aria-label="color ${i+1}"></button>`).join("");
 $("#bacc").innerHTML=BA.map((a,i)=>`<button class="chip${i==MY.a?" on":""}" data-k="a" data-v="${i}">${a}</button>`).join("");
 $("#bfac").innerHTML=BF.map((a,i)=>`<button class="chip${i==MY.f?" on":""}" data-k="f" data-v="${i}">${a}</button>`).join("")}
$("#bdlg").onclick=e=>{const b=e.target.closest("[data-k]");if(!b)return;MY[b.dataset.k]=+b.dataset.v;drawMy()};
$("#mybee").onclick=()=>{drawMy();$("#bdlg").showModal()};
$("#bsave").onclick=()=>{try{localStorage.setItem("beez_my",JSON.stringify(MY))}catch(e){}window.push&&push();$("#bdlg").close();window.renderDash&&renderDash()};
