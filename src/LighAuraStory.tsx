import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

const C={paper:'#f7f7f4',silver:'#c8ccd0',ink:'#111317',gold:'#c9a45d',red:'#c8102e',deep:'#760818'};
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const p=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)});
const fade=(f:number,a:number,b:number,c:number,d:number)=>Math.min(p(f,a,b),1-p(f,c,d));

const Logo=({size=58}:{size?:number})=><div style={{position:'relative',width:size,height:size}}>
  <div style={{position:'absolute',left:'17%',top:'5%',width:'10%',height:'88%',background:'linear-gradient(#ee3a46,#98081d)',transform:'rotate(27deg)',transformOrigin:'bottom'}}/>
  <div style={{position:'absolute',right:'17%',top:'5%',width:'10%',height:'88%',background:'linear-gradient(#f04950,#950619)',transform:'rotate(-27deg)',transformOrigin:'bottom'}}/>
  <div style={{position:'absolute',left:'31%',right:'29%',bottom:'19%',height:'8%',background:C.red,transform:'skewX(-24deg)'}}/>
  <div style={{position:'absolute',left:'37%',top:'43%',width:'29%',height:'8%',background:C.gold,transform:'rotate(-9deg)'}}/>
</div>;

const World=()=> <AbsoluteFill style={{overflow:'hidden',background:'linear-gradient(112deg,#fafaf8 0%,#f2f3f3 42%,#d8dcdf 72%,#eef0ef 100%)'}}>
  <div style={{position:'absolute',right:90,top:60,width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle at 34% 30%,#fff 0 3%,#eaebec 15%,#cfd3d5 44%,#bcc1c5 70%,#eef0f0 100%)',boxShadow:'inset -30px -20px 70px rgba(90,96,100,.13),0 0 130px rgba(255,255,255,.9)',opacity:.83}}/>
  <div style={{position:'absolute',left:420,top:-340,width:640,height:1260,border:'3px solid rgba(255,255,255,.92)',borderRadius:'50%',boxShadow:'0 0 0 16px rgba(170,176,180,.13),0 0 0 21px rgba(255,255,255,.62),inset 0 0 65px rgba(255,255,255,.68)',transform:'rotate(21deg)'}}/>
  <div style={{position:'absolute',right:-390,top:-230,width:750,height:1180,border:'3px solid rgba(255,255,255,.9)',borderRadius:'50%',boxShadow:'0 0 0 19px rgba(170,176,180,.11),0 0 0 25px rgba(255,255,255,.6)',transform:'rotate(-24deg)'}}/>
  <div style={{position:'absolute',left:910,top:110,width:90,height:690,clipPath:'polygon(48% 0,60% 8%,62% 34%,83% 62%,72% 100%,28% 100%,18% 62%,41% 34%)',background:'linear-gradient(90deg,rgba(187,191,194,.05),rgba(255,255,255,.85),rgba(158,164,169,.14))'}}/>
  <div style={{position:'absolute',right:0,bottom:115,width:920,height:300,opacity:.35,clipPath:'polygon(0 83%,10% 68%,18% 78%,27% 53%,35% 68%,45% 29%,58% 63%,69% 36%,81% 65%,90% 50%,100% 70%,100% 100%,0 100%)',background:'linear-gradient(#9ca3a8,#e6e8e9)'}}/>
  <div style={{position:'absolute',left:-100,right:-100,bottom:-80,height:350,transform:'perspective(650px) rotateX(63deg)',transformOrigin:'bottom',background:'repeating-linear-gradient(90deg,transparent 0 150px,rgba(120,125,130,.11) 151px),repeating-linear-gradient(0deg,rgba(110,115,120,.08) 0 1px,transparent 1px 80px),linear-gradient(#fff,#d8dcde)',borderTop:'1px solid rgba(130,135,140,.24)'}}/>
</AbsoluteFill>;

const Cup=({side,assemble,energy}:{side:'left'|'right';assemble:number;energy:number})=>{
 const dir=side==='left'?-1:1;
 return <div style={{position:'absolute',top:350,[side]:50,width:255,height:330,transform:`translateX(${dir*(1-assemble)*330}px) rotateY(${dir*12}deg) rotateZ(${dir*4}deg)`,transformStyle:'preserve-3d'}}>
   <div style={{position:'absolute',inset:0,border:'4px solid #c9a45d',borderRadius:'44% 44% 39% 39%',background:'linear-gradient(135deg,#2a2d31 0 12%,#0e1013 42%,#303438 72%,#0f1113 100%)',boxShadow:'inset 14px 16px 20px rgba(255,255,255,.1),inset -18px -16px 24px rgba(0,0,0,.66),0 38px 55px rgba(0,0,0,.23),0 0 0 12px rgba(17,19,22,.88)'}}>
    <div style={{position:'absolute',inset:'18%',borderRadius:'40%',background:'radial-gradient(circle at 30% 30%,#bc2a39 0 2px,#68111c 2px 4px,#190e11 4px 8px)',backgroundSize:'12px 12px',boxShadow:'inset 0 0 36px #050607,0 0 0 7px #111317'}}/>
    <div style={{position:'absolute',right:21,top:52,width:10,height:190,borderRadius:99,background:'linear-gradient(#f13a4a,#8d071c)',boxShadow:`0 0 ${10+energy*28}px rgba(221,27,55,${.35+energy*.45})`}}/>
    <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%) scale(.72)'}}><Logo size={76}/></div>
   </div>
  </div>;
};

const Headset=({assemble,turn=0,scale=1,energy=1}:{assemble:number;turn?:number;scale?:number;energy?:number})=> <div style={{position:'relative',width:700,height:760,transform:`rotateY(${turn}deg) scale(${scale})`,transformStyle:'preserve-3d',filter:'drop-shadow(0 48px 48px rgba(18,20,22,.25))'}}>
  <div style={{position:'absolute',left:140,top:15,width:420,height:430,transform:`translateY(${(1-assemble)*-260}px)`,border:'58px solid transparent',borderTopColor:'#202225',borderLeftColor:'#2c2f32',borderRightColor:'#414447',borderRadius:'52% 52% 40% 40%',boxShadow:'inset 0 5px 9px rgba(255,255,255,.17),0 0 0 5px #c9a45d'}}/>
  <div style={{position:'absolute',left:195,top:60,width:310,height:320,transform:`translateY(${(1-assemble)*-260}px)`,border:'27px solid transparent',borderTopColor:'#7c0d1b',borderRadius:'50%',boxShadow:'inset 0 10px 15px #15171a'}}/>
  <div style={{position:'absolute',left:166,top:295,width:56,height:205,transform:`translateX(${(1-assemble)*-250}px) rotate(7deg)`,border:'4px solid #d1ad67',borderRadius:22,background:'linear-gradient(90deg,#17191c,#55595d,#17191c)'}}/>
  <div style={{position:'absolute',right:166,top:295,width:56,height:205,transform:`translateX(${(1-assemble)*250}px) rotate(-7deg)`,border:'4px solid #d1ad67',borderRadius:22,background:'linear-gradient(90deg,#17191c,#55595d,#17191c)'}}/>
  <Cup side="left" assemble={assemble} energy={energy}/><Cup side="right" assemble={assemble} energy={energy}/>
  <div style={{position:'absolute',left:94,top:575,width:230,height:13,transform:`translateX(${(1-assemble)*-300}px) rotate(34deg)`,transformOrigin:'left',borderRadius:99,background:'linear-gradient(90deg,#3b3e42,#c5c9cc)'}}><i style={{position:'absolute',right:-17,top:'50%',width:32,height:32,transform:'translateY(-50%)',borderRadius:'50%',background:'#121418',border:'4px solid #c9a45d',boxShadow:'0 0 0 5px rgba(200,16,46,.35)'}}/></div>
 </div>;

const Platform=({energy}:{energy:number})=> <div style={{position:'absolute',left:'50%',bottom:82,width:760,height:210,transform:'translateX(-50%) perspective(700px) rotateX(64deg)',borderRadius:'50%',background:'radial-gradient(ellipse at center,#fff 0 20%,#1b1d20 21% 27%,#c8a05a 28% 30%,#e2e4e5 31% 43%,#6e7275 44% 48%,#eef0f1 50% 67%,transparent 68%)',filter:'drop-shadow(0 28px 30px rgba(25,28,30,.2))'}}>
  <div style={{position:'absolute',inset:'26% 15%',borderRadius:'50%',border:`3px solid rgba(200,16,46,${.22+.65*energy})`,boxShadow:`0 0 ${42*energy}px rgba(200,16,46,.62)`}}/>
  <div style={{position:'absolute',left:'49%',top:'39%',width:9,height:'31%',background:C.red,boxShadow:'0 0 18px rgba(200,16,46,.65)',transform:'rotate(13deg)'}}/>
 </div>;

const Keyboard=()=> <div style={{position:'relative',width:330,height:170,transform:'perspective(600px) rotateX(58deg) rotateZ(-8deg)',borderRadius:20,background:'linear-gradient(145deg,#292c30,#08090b 68%,#3b3e41)',boxShadow:'0 28px 35px rgba(12,14,16,.28),inset 0 0 0 4px #b28c4a'}}>
 <div style={{position:'absolute',inset:22,display:'grid',gridTemplateColumns:'repeat(9,1fr)',gap:8}}>{Array.from({length:36}).map((_,i)=><i key={i} style={{borderRadius:4,background:i%7===0?C.red:i%11===0?C.gold:'#1a1d20',boxShadow:'inset 0 -2px 0 #070809'}}/>)}</div>
</div>;
const Mouse=()=> <div style={{position:'relative',width:160,height:220,borderRadius:'49% 49% 43% 43%',background:'linear-gradient(140deg,#25282c,#08090b 48%,#4d3b25 75%,#121418)',boxShadow:'0 30px 38px rgba(20,22,24,.28),inset 8px 10px 16px rgba(255,255,255,.09)',transform:'rotate(8deg)'}}><div style={{position:'absolute',left:'49%',top:0,width:2,height:'42%',background:'#b4b7ba'}}/><div style={{position:'absolute',left:'45%',top:'12%',width:'10%',height:'17%',borderRadius:99,background:C.gold}}/><div style={{position:'absolute',left:'14%',right:'14%',bottom:'15%',height:5,borderRadius:99,background:C.red,boxShadow:'0 0 12px rgba(200,16,46,.55)'}}/></div>;
const Monitor=()=> <div style={{position:'relative',width:370,height:270}}><div style={{position:'absolute',left:0,right:0,top:0,height:205,border:'10px solid #1c1e21',borderRadius:10,background:'radial-gradient(circle at 58% 50%,#ed2039 0 3%,transparent 4%),conic-gradient(from 140deg at 58% 50%,#050609,#8b0b20 6%,#050609 13%,#bc1430 18%,#050609 22%,#151923 39%,#020304 54%,#941129 67%,#050609 76%)',boxShadow:'0 28px 34px rgba(18,20,22,.2)'}}/><div style={{position:'absolute',left:'49%',top:205,width:12,height:48,background:'linear-gradient(#3d4044,#111315)'}}/><div style={{position:'absolute',left:88,right:60,bottom:8,height:8,transform:'skewX(-34deg)',background:'#202225'}}/></div>;

const Card=({kind,index,opacity,y}:{kind:'headset'|'keyboard'|'mouse'|'monitor';index:number;opacity:number;y:number})=>{
 const visuals={headset:<div style={{transform:'scale(.38)',width:700,height:760,transformOrigin:'center'}}><Headset assemble={1} turn={-4} energy={1}/></div>,keyboard:<Keyboard/>,mouse:<Mouse/>,monitor:<Monitor/>};
 const names=[['AURORA PRO','Casque Wireless','299 €'],['K1 ELITE','Clavier Mécanique','249 €'],['NEXUS X','Souris Ultra-légère','159 €'],['VISION 27','Écran 4K 240Hz','799 €']][index];
 return <div style={{opacity,transform:`translateY(${y}px)`,width:390,height:420,borderRadius:28,border:'1px solid rgba(40,44,48,.09)',background:'linear-gradient(145deg,#fff,#e1e4e5 74%,#d4d8da)',boxShadow:'inset 0 2px 0 #fff,0 28px 55px rgba(30,33,36,.08)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
   <div style={{transform:'scale(.72)',display:'grid',placeItems:'center',height:260}}>{visuals[kind]}</div>
   <div style={{position:'absolute',left:26,bottom:24}}><div style={{fontWeight:850,fontSize:22}}>{names[0]}</div><div style={{fontSize:16,color:'#5b6065',marginTop:3}}>{names[1]}</div><div style={{fontWeight:850,fontSize:24,marginTop:8}}>{names[2]}</div></div>
   <div style={{position:'absolute',right:22,bottom:24,width:54,height:54,borderRadius:12,background:'linear-gradient(145deg,#c9a45d,#886426)',color:'white',display:'grid',placeItems:'center',fontSize:30}}>+</div>
  </div>;
};

export const LighAuraStory:React.FC=()=>{
 const f=useCurrentFrame();
 const assembly=p(f,65,250);
 const energy=p(f,180,320);
 const reveal=p(f,235,420);
 const pull=p(f,420,570);
 const shop=p(f,505,645);
 const productTurn=interpolate(f,[235,420],[-12,16],clamp);
 const productScale=interpolate(pull,[0,1],[1,.56]);
 const productX=interpolate(pull,[0,1],[360,0]);
 const productY=interpolate(pull,[0,1],[0,-230]);
 return <AbsoluteFill style={{fontFamily:'Inter, ui-sans-serif, system-ui, sans-serif',color:C.ink,overflow:'hidden'}}>
   <World/>
   <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(255,255,255,.6),transparent 38%,transparent 80%,rgba(255,255,255,.25))'}}/>

   <div style={{position:'absolute',top:48,left:68,display:'flex',alignItems:'center',gap:16,zIndex:20,opacity:1-p(f,440,500)}}><Logo size={54}/><div><div style={{fontSize:24,letterSpacing:5,fontWeight:750}}>LIGHAURA MG</div><div style={{fontSize:10,letterSpacing:7,color:'#646a70',marginTop:5}}>BEYOND PLAY</div></div></div>

   <div style={{position:'absolute',left:112,top:300,width:610,zIndex:15,opacity:fade(f,0,30,375,440),transform:`translateY(${interpolate(p(f,0,90),[0,1],[24,0])}px)`}}>
    <div style={{fontSize:16,letterSpacing:8,fontWeight:700,color:'#4f555a'}}>HIGH-END GAMING GEAR</div>
    <div style={{fontSize:68,lineHeight:.96,fontWeight:420,letterSpacing:-3,marginTop:28}}>PLUS QU’UN JEU.<br/><span style={{color:'#ad8643'}}>UNE EXPÉRIENCE.</span></div>
    <div style={{fontSize:21,lineHeight:1.55,color:'#4c5156',maxWidth:510,marginTop:32}}>Design, performance et innovation réunis dans une nouvelle génération d’équipement haut de gamme.</div>
   </div>

   <div style={{position:'absolute',left:'50%',top:'49%',width:820,height:850,transform:`translate(calc(-50% + ${productX}px),calc(-50% + ${productY}px)) scale(${productScale})`,zIndex:12}}>
    <div style={{position:'absolute',left:60,top:0,transform:`rotateY(${productTurn}deg)`,transformOrigin:'center',perspective:1200}}><Headset assemble={assembly} turn={productTurn} energy={energy}/></div>
    <Platform energy={energy}/>
   </div>

   <div style={{position:'absolute',right:75,top:320,zIndex:18,opacity:(1-pull)*p(f,150,250),display:'flex',flexDirection:'column',gap:11,paddingLeft:23,fontSize:15,letterSpacing:2,fontWeight:700}}><i style={{position:'absolute',left:0,top:0,width:4,height:112,background:C.gold}}/><span>DESIGN</span><span>PERFORMANCE</span><span>ÉMOTION</span><span>SANS COMPROMIS</span></div>

   <div style={{position:'absolute',left:58,top:390,zIndex:18,opacity:(1-pull)*p(f,30,80),display:'flex',flexDirection:'column',gap:34,font:'600 15px ui-monospace',color:'#62676c'}}><span style={{color:C.ink}}>01</span><span>02</span><span>03</span></div>

   <div style={{position:'absolute',left:0,right:0,top:85,textAlign:'center',opacity:shop,zIndex:20}}><div style={{fontSize:14,letterSpacing:8,color:C.red,fontWeight:750}}>COLLECTION 01</div><div style={{fontSize:58,letterSpacing:-3,fontWeight:430,marginTop:10}}>NOS PRODUITS ICONIQUES</div><div style={{fontSize:19,color:'#656a6f',marginTop:9}}>Des outils d’exception pour des joueurs d’exception.</div></div>

   <div style={{position:'absolute',left:80,right:80,bottom:70,display:'flex',gap:20,zIndex:18,opacity:shop}}>
    {(['headset','keyboard','mouse','monitor'] as const).map((k,i)=>{const q=p(f,525+i*20,590+i*20);return <Card key={k} kind={k} index={i} opacity={q} y={interpolate(q,[0,1],[90,0])}/>})}
   </div>

   <div style={{position:'absolute',left:'50%',bottom:28,transform:'translateX(-50%)',width:1300,height:1,background:'linear-gradient(90deg,transparent,#b6904c,#b6904c,transparent)',opacity:.8}}/>
   <div style={{position:'absolute',inset:0,boxShadow:'inset 0 0 150px rgba(255,255,255,.42)',pointerEvents:'none'}}/>
 </AbsoluteFill>;
};
