import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const C={bg:'#07111f',panel:'#0d1b2d',line:'#1d3550',text:'#f6f9fc',muted:'#8fa6bd',accent:'#58d6ff',green:'#66f2b3'};
const font='Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
const fade=(f:number,a:number,b:number)=>interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const Card:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=><div style={{background:'linear-gradient(135deg,rgba(19,39,62,.92),rgba(8,22,38,.82))',border:'1px solid rgba(118,184,225,.18)',boxShadow:'0 28px 90px rgba(0,0,0,.28)',borderRadius:28,backdropFilter:'blur(20px)',...style}}>{children}</div>;
const Pill=({children,active=false}:{children:React.ReactNode;active?:boolean})=><div style={{padding:'13px 18px',borderRadius:99,border:`1px solid ${active?'rgba(88,214,255,.5)':'rgba(143,166,189,.2)'}`,background:active?'rgba(88,214,255,.1)':'rgba(255,255,255,.03)',color:active?C.accent:C.muted,fontSize:24,fontWeight:650}}>{children}</div>;

export const MandatPulse:React.FC=()=>{
 const frame=useCurrentFrame(); const {fps}=useVideoConfig();
 const enter=(start:number)=>spring({frame:frame-start,fps,config:{damping:18,stiffness:120,mass:.7}});
 const scene=(a:number,b:number)=>Math.min(fade(frame,a,a+12),1-fade(frame,b-12,b));
 const scan=Math.min(100,Math.max(0,Math.round(interpolate(frame,[105,220],[0,100],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}))));
 const score=Math.min(87,Math.max(0,Math.round(interpolate(frame,[245,330],[0,87],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}))));
 return <AbsoluteFill style={{background:`radial-gradient(circle at 75% 15%,#103456 0,${C.bg} 42%,#050b13 100%)`,color:C.text,fontFamily:font,overflow:'hidden'}}>
  <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(88,214,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(88,214,255,.035) 1px,transparent 1px)',backgroundSize:'72px 72px'}}/>
  <div style={{position:'absolute',top:54,left:64,right:64,display:'flex',alignItems:'center',justifyContent:'space-between',zIndex:20}}><div style={{fontWeight:850,fontSize:30,letterSpacing:-1}}>Mandat<span style={{color:C.accent}}>Pulse</span></div><Pill>Intelligence commerciale</Pill></div>

  <div style={{opacity:scene(0,120),transform:`translateY(${(1-enter(0))*28}px)`,position:'absolute',top:220,left:70,right:70}}>
   <div style={{fontSize:26,color:C.accent,fontWeight:750,letterSpacing:1,textTransform:'uppercase'}}>Cabinets de recrutement</div>
   <div style={{fontSize:74,lineHeight:1.03,fontWeight:850,letterSpacing:-4,marginTop:24}}>Quand l'offre est publique,<br/><span style={{color:C.muted}}>vos concurrents la voient aussi.</span></div>
   <div style={{marginTop:58,display:'flex',gap:18}}><Pill active>Offre publiée</Pill><Pill>LinkedIn</Pill><Pill>Jobboards</Pill></div>
  </div>

  <div style={{opacity:scene(110,245),position:'absolute',top:190,left:60,right:60}}>
   <div style={{fontSize:58,fontWeight:820,letterSpacing:-3}}>MandatPulse détecte <span style={{color:C.accent}}>plus tôt.</span></div>
   <Card style={{marginTop:48,padding:34}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{color:C.muted,fontSize:23}}>VEILLE EN COURS</div><div style={{fontSize:34,fontWeight:760,marginTop:8}}>Signaux de marché</div></div><div style={{fontSize:48,fontWeight:850,color:C.accent}}>{scan}%</div></div><div style={{height:8,background:'rgba(255,255,255,.06)',borderRadius:99,margin:'28px 0 34px',overflow:'hidden'}}><div style={{height:'100%',width:`${scan}%`,background:C.accent}}/></div>{[['+6 recrutements techniques','il y a 2 h'],['Nouveau site industriel','il y a 1 j'],['Direction RH renforcée','il y a 3 j']].map((x,i)=><div key={i} style={{opacity:fade(frame,135+i*18,150+i*18),display:'flex',justifyContent:'space-between',padding:'20px 0',borderTop:`1px solid ${C.line}`}}><span style={{fontSize:28,fontWeight:650}}>● &nbsp;{x[0]}</span><span style={{color:C.muted,fontSize:22}}>{x[1]}</span></div>)}</Card>
  </div>

  <div style={{opacity:scene(235,385),position:'absolute',top:175,left:60,right:60}}>
   <div style={{color:C.accent,fontSize:25,fontWeight:760}}>OPPORTUNITÉ DÉTECTÉE</div><div style={{fontSize:60,fontWeight:850,letterSpacing:-3,marginTop:12}}>Une entreprise mérite<br/>votre attention maintenant.</div>
   <Card style={{marginTop:40,padding:34}}><div style={{display:'flex',justifyContent:'space-between'}}><div><div style={{fontSize:25,color:C.muted}}>Entreprise</div><div style={{fontSize:42,fontWeight:800,marginTop:8}}>NOVATECH INDUSTRIES</div><div style={{fontSize:24,color:C.muted,marginTop:7}}>Industrie · Grand Est</div></div><div style={{width:150,height:150,borderRadius:999,border:`8px solid ${C.accent}`,display:'grid',placeItems:'center'}}><div style={{textAlign:'center'}}><b style={{fontSize:50}}>{score}</b><div style={{fontSize:18,color:C.muted}}>/100</div></div></div></div><div style={{display:'flex',gap:12,marginTop:34,flexWrap:'wrap'}}><Pill active>Besoin probable</Pill><Pill>Timing fort</Pill><Pill>Accessible</Pill></div></Card>
  </div>

  <div style={{opacity:scene(375,525),position:'absolute',top:165,left:60,right:60}}>
   <div style={{fontSize:58,fontWeight:850,letterSpacing:-3}}>Puis MandatPulse vous dit<br/><span style={{color:C.accent}}>qui contacter.</span></div>
   <Card style={{marginTop:42,padding:34}}><div style={{display:'flex',gap:26,alignItems:'center'}}><div style={{width:92,height:92,borderRadius:24,background:'linear-gradient(145deg,#204b6c,#10263d)',display:'grid',placeItems:'center',fontSize:34,fontWeight:800}}>CM</div><div><div style={{fontSize:34,fontWeight:780}}>Claire Martin</div><div style={{fontSize:25,color:C.muted,marginTop:6}}>Directrice des Ressources Humaines</div></div></div><div style={{marginTop:34,borderTop:`1px solid ${C.line}`,paddingTop:28}}><div style={{fontSize:21,color:C.accent,fontWeight:760}}>POURQUOI MAINTENANT</div><div style={{fontSize:30,lineHeight:1.35,fontWeight:650,marginTop:10}}>Expansion du site + recrutements techniques simultanés.</div></div></Card>
   <div style={{opacity:fade(frame,440,460),marginTop:24,padding:'24px 30px',borderRadius:24,background:'rgba(102,242,179,.08)',border:'1px solid rgba(102,242,179,.24)'}}><div style={{color:C.green,fontSize:21,fontWeight:760}}>ANGLE D'APPROCHE</div><div style={{fontSize:27,lineHeight:1.35,marginTop:8}}>Positionnez votre cabinet sur la montée en charge avant que le besoin ne soit diffusé partout.</div></div>
  </div>

  <div style={{opacity:scene(515,650),position:'absolute',top:230,left:70,right:70,textAlign:'center'}}><div style={{fontSize:27,color:C.accent,fontWeight:760}}>LE BON COMPTE · LE BON CONTACT · LE BON MOMENT</div><div style={{fontSize:72,lineHeight:1.05,fontWeight:880,letterSpacing:-4,marginTop:30}}>Vous savez <span style={{color:C.accent}}>qui</span> contacter.<br/>Et surtout <span style={{color:C.accent}}>pourquoi maintenant.</span></div></div>

  <div style={{opacity:fade(frame,640,665),position:'absolute',top:245,left:70,right:70,textAlign:'center'}}><div style={{fontSize:42,fontWeight:850}}>Mandat<span style={{color:C.accent}}>Pulse</span></div><div style={{fontSize:66,lineHeight:1.05,fontWeight:880,letterSpacing:-4,marginTop:30}}>Gagnez le mandat avant qu'il ne parte chez vos concurrents.</div><div style={{margin:'54px auto 0',padding:'24px 34px',borderRadius:22,background:C.text,color:C.bg,fontSize:29,fontWeight:800,width:'fit-content'}}>Recevez 5 entreprises ciblées gratuitement →</div><div style={{fontSize:21,color:C.muted,marginTop:28}}>mandatpulse.garcia68.chatgpt.site</div></div>
 </AbsoluteFill>;
};
