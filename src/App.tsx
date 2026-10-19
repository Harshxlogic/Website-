import { Fragment, RefObject, createRef, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn, AnimatedText, ContactButton, LiveProjectButton } from './ui';
import BustHead from './BustHead';
import Exploded, { Part } from './Exploded';
import { Terminal, BarChart3, Cpu, CircuitBoard, GitBranch, Briefcase, LineChart, Users, Calculator, ShoppingCart, Music } from 'lucide-react';

const H='clamp(3rem, 12vw, 160px)';
const heading='hero-heading font-black uppercase leading-none tracking-tight text-center';

function Hero(){return(
<section className="relative h-screen flex flex-col" style={{overflowX:'clip'}}>
  <FadeIn delay={0} y={-20}><nav className="flex justify-between px-6 md:px-10 pt-6 md:pt-8 text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem]">
    {['About','Skills','Projects','Contact'].map(l=><a key={l} href={`#${l.toLowerCase()}`} className="hover:opacity-70 transition-opacity duration-200">{l}</a>)}</nav></FadeIn>
  <div className="overflow-hidden px-6 md:px-10"><FadeIn delay={0.15} y={40}>
    <h1 className="hero-heading font-black uppercase tracking-tight leading-[0.9] text-[15vw] sm:text-[13vw] md:text-[11vw] mt-8 md:mt-6">Harsh Vardhan<br/>Anand</h1></FadeIn></div>
  <div className="mt-auto flex flex-col items-start gap-5 px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
    <FadeIn delay={0.35} y={20}><p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[260px] md:max-w-[320px]" style={{fontSize:'clamp(0.75rem, 1.4vw, 1.5rem)'}}>ece student building embedded systems, ai tools and clean python</p></FadeIn>
    <FadeIn delay={0.5} y={20}><ContactButton/></FadeIn>
  </div>
  <FadeIn delay={0.6} y={30} className="absolute right-2 sm:right-6 md:right-12 bottom-0 z-10">
    <BustHead className="w-[200px] sm:w-[300px] md:w-[400px] lg:w-[460px]"/></FadeIn>
</section>);}

const B='https://motionsites.ai/assets/hero-';
const gifs=['space-voyage-preview-eECLH3Yc','codenest-preview-Cgppc2qV','vex-ventures-preview-BczMFIiw','stellar-ai-v2-preview-DjvxjG3C','asme-preview-B_nGDnTP','transform-data-preview-Cx5OU29N','vitara-preview-Cjz2QYyU','terra-preview-BFjrCr7T','skyelite-preview-DHaZIgUv','aethera-preview-DknSlcTa','designpro-preview-D8c5_een','stellar-ai-preview-D3HL6bw1','xportfolio-preview-D4A8maiC','orbit-web3-preview-BXt4OttD','nexora-preview-cx5HmUgo','evr-ventures-preview-DZxeVFEX','planet-orbit-preview-DWAP8Z1P','new-era-preview-CocuDUm9','wealth-preview-B70idl_u','luminex-preview-CxOP7ce6','celestia-preview-0yO3jXO8'].map(n=>`${B}${n}.gif`);
function Row({imgs,dir,offset}:{imgs:string[];dir:1|-1;offset:number}){
  const t=[...imgs,...imgs,...imgs];
  return <div className="flex gap-3" style={{transform:`translateX(${dir*(offset-200)}px)`,willChange:'transform'}}>
    {t.map((s,i)=><img key={i} src={s} loading="lazy" alt="" className="rounded-2xl object-cover shrink-0" style={{width:420,height:270}}/>)}</div>;}
function Marquee(){
  const ref=useRef<HTMLElement>(null);const [o,setO]=useState(0);
  useEffect(()=>{const f=()=>{const top=ref.current?ref.current.getBoundingClientRect().top+window.scrollY:0;setO((window.scrollY-top+window.innerHeight)*0.3);};
    f();window.addEventListener('scroll',f,{passive:true});return()=>window.removeEventListener('scroll',f);},[]);
  return <section ref={ref} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col gap-3 overflow-hidden">
    <Row imgs={gifs.slice(0,11)} dir={1} offset={o}/><Row imgs={gifs.slice(11)} dir={-1} offset={o}/></section>;}

const R='rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';
const GITHUB='https://github.com/Harshxlogic';
const LINKS=[['Website','https://harshvardhananandportfolioweb.vercel.app/'],['LinkedIn','http://www.linkedin.com/in/harsh-vardhan-anand'],['GitHub',GITHUB],['LeetCode','https://leetcode.com/u/harshxlogix/'],['Email','mailto:harshvardhanq123@gmail.com']];
const projects=[
 {name:'4-Bit ALU Design & Hardware Implementation',cat:'Hardware',date:'October 2026',stack:['Digital Logic Design','Circuit Design','Simulation'],
  pts:['Designed and implemented a 4-bit ALU supporting arithmetic and logic operations using Boolean algebra and combinational logic.','Simulated circuits, analyzed waveforms, and debugged hardware discrepancies to validate functionality.']},
 {name:'E-Commerce Sales Analysis',cat:'Data Analytics',date:'August–September 2026',stack:['Python','Pandas','NumPy','Matplotlib','Seaborn'],
  pts:['Cleaned and analyzed sales data to evaluate revenue, profitability, product performance, and regional trends.','Conducted EDA, calculated key business metrics, and visualized sales patterns to identify actionable insights.']},
 {name:'YouTube Music Downloader & Streamer',cat:'Python CLI',date:'August 2026',stack:['Python','yt-dlp','MPV','subprocess','CLI'],
  pts:['Built a CLI tool for YouTube media search, streaming, and downloading using yt-dlp and MPV.','Implemented top-5 search results, audio/video format selection, MP4 merging, input validation, and exception handling.']}];
const panel=`border border-[#D7E2EA]/30 bg-[#D7E2EA]/5 text-[#D7E2EA] p-4 sm:p-6 md:p-8 overflow-hidden ${R}`;

function About(){return(
<section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 gap-16 sm:gap-20 md:gap-24">
  {[['ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36','w-[120px] sm:w-[160px] md:w-[210px] top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',0.1,-80],
    ['ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e','w-[100px] sm:w-[140px] md:w-[180px] bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]',0.25,-80],
    ['ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594','w-[120px] sm:w-[160px] md:w-[210px] top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',0.15,80],
    ['ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce','w-[130px] sm:w-[170px] md:w-[220px] bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',0.3,80]]
    .map(([u,c,d,x]:any)=><FadeIn key={u} delay={d} x={x} y={0} duration={0.9} className={`absolute ${c}`}><img src={`https://shrug-person-78902957.figma.site/_components/v2/${u}.png`} alt="" className="w-full"/></FadeIn>)}
  <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
    <FadeIn y={40}><h2 className={heading} style={{fontSize:H}}>About me</h2></FadeIn>
    <AnimatedText text="I'm a B.Tech Electronics and Communication student at USICT, Delhi, working across embedded systems, Python automation and data analysis. From a 4-bit ALU in hardware to a CLI music streamer, i love building things that actually work. Let's build something incredible together!"/>
  </div>
  <div className="relative z-10"><ContactButton/></div>
</section>);}

const skills=[['Programming','C and Python for automation, scripting and CLI tools, written modular with input validation and exception handling. CS50P certified.'],
['AI & Data','Data cleaning, exploratory analysis and visualization with Pandas, NumPy, Matplotlib, Seaborn and Jupyter Notebook.'],
['Embedded & Robotics','ESP32 and PlatformIO, sensor interfacing, Embedded C, GPIO and ADC.'],
['Semiconductor & Hardware','Digital electronics, circuit design, FPGA, RTL and PCB design, using KiCAD, GTKWave and KLayout.'],
['Developer Tools','Git, GitHub, VS Code, Arduino IDE, on Linux (Arch) and Windows.']];
const experience=[['Python Developer Intern','Dynamite Webtech · 11 Aug – 11 Sep 2026. Built and refined Python automation and data-processing scripts, with input validation, exception handling, testing and debugging.'],
['Data Analytics Intern','InAmigos Foundation · 11 Oct – 24 Oct 2026. Cleaned datasets with Pandas and NumPy, ran exploratory analysis, and built Matplotlib and Seaborn visualizations.']];
function List({title,items}:{title:string;items:string[][]}){return(<>
  <h2 className="font-black uppercase text-center text-[#0C0C0C] mb-12 sm:mb-16 md:mb-20" style={{fontSize:H}}>{title}</h2>
  <div className="max-w-5xl mx-auto">{items.map(([n,d],i)=>
    <FadeIn key={n} delay={i*0.1}><div className="flex gap-6 sm:gap-10 py-8 sm:py-10 md:py-12 text-[#0C0C0C]" style={{borderTop:'1px solid rgba(12, 12, 12, 0.15)'}}>
      <span className="font-black leading-none" style={{fontSize:'clamp(3rem, 10vw, 140px)'}}>0{i+1}</span>
      <div className="flex flex-col gap-3"><h3 className="font-medium uppercase" style={{fontSize:'clamp(1rem, 2.2vw, 2.1rem)'}}>{n}</h3>
        <p className="font-light leading-relaxed max-w-2xl opacity-60" style={{fontSize:'clamp(0.85rem, 1.6vw, 1.25rem)'}}>{d}</p></div></div></FadeIn>)}</div></>);}
const more=[['Education','B.Tech in Electronics and Communication Engineering, USICT, Dwarka, Delhi. Expected 2030. CGPA 7.42.'],
['Certifications','CS50P and OpenCV Bootcamp.'],
['Positions of Responsibility','Coding Club: Event Coordinator and Technical Lead.'],
['Interests','Artificial Intelligence, Robotics, Embedded Systems, Computer Vision, Cybersecurity and Semiconductor Engineering.']];
// Stacking cards: every section is a sticky card; the next one slides over it like a deck.
// A card taller than the screen scrolls until its bottom is visible, then pins (top = vh - height).
const RT='rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]';
const decks:[string,string[][],string][]=[['Skills',skills,'#FFFFFF'],['Experience',experience,'#D7E2EA'],['More',more,'#BBCCD7']];
const compatibleIcon = (icon: typeof Terminal): Part['Icon'] => icon as unknown as Part['Icon'];
const stageSkills:{parts:Part[];captions:[string,string,string]}={
 parts:[{name:'Programming',sub:'C · Python · CLI',Icon:compatibleIcon(Terminal)},{name:'AI & Data',sub:'Pandas · NumPy · Seaborn',Icon:compatibleIcon(BarChart3)},{name:'Embedded',sub:'ESP32 · GPIO · ADC',Icon:compatibleIcon(Cpu)},
  {name:'Hardware',sub:'FPGA · RTL · KiCAD',Icon:compatibleIcon(CircuitBoard)},{name:'Dev Tools',sub:'Git · Linux · VS Code',Icon:compatibleIcon(GitBranch)}],
 captions:['One skill set, assembled','Pulled apart, each skill on its own','Locked in: what I work with']};
const stageExperience:{parts:Part[];captions:[string,string,string]}={
 parts:[{name:'Python Intern',sub:'Dynamite Webtech',Icon:compatibleIcon(Briefcase)},{name:'Data Intern',sub:'InAmigos Foundation',Icon:compatibleIcon(LineChart)},{name:'Coding Club',sub:'Event Coordinator · Tech Lead',Icon:compatibleIcon(Users)}],
 captions:['Experience, assembled','Pulled apart, each role on its own','Locked in: where I have worked']};
const stageProjects:{parts:Part[];captions:[string,string,string]}={
 parts:[{name:'4-Bit ALU',sub:'Hardware · Oct 2026',Icon:compatibleIcon(Calculator)},{name:'Sales Analysis',sub:'Data Analytics · Aug 2026',Icon:compatibleIcon(ShoppingCart)},{name:'Music CLI',sub:'Python · Aug 2026',Icon:compatibleIcon(Music)}],
 captions:['Projects, assembled','Pulled apart, each build on its own','Locked in: what I have built']};
const stages:Record<string,{title:string;mock:string;parts:Part[];captions:[string,string,string]}>={
 Skills:{title:'Skills',mock:'harsh.dev / skills',...stageSkills},
 Experience:{title:'Experience',mock:'harsh.dev / experience',...stageExperience}};
const stageCls=`relative z-10 bg-[#0C0C0C] ${'rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]'}`;
function StackCard({i,total,bg,id,mark,children}:{i:number;total:number;bg:string;id?:string;mark:RefObject<HTMLDivElement>;children:ReactNode}){
  const ref=useRef<HTMLDivElement>(null);
  const [top,setTop]=useState(0);const [tall,setTall]=useState(false);
  useEffect(()=>{const el=ref.current;if(!el)return;
    const m=()=>{const h=el.offsetHeight;setTop(Math.min(0,window.innerHeight-h));setTall(h>window.innerHeight);};
    m();const ro=new ResizeObserver(m);ro.observe(el);window.addEventListener('resize',m);
    return()=>{ro.disconnect();window.removeEventListener('resize',m);};},[]);
  const last=i===total-1;
  // progress of the NEXT card rising from the bottom of the screen to the top
  const {scrollYProgress}=useScroll({target:mark,offset:['start end','start start']});
  const scale=useTransform(scrollYProgress,[0,1],[1,last?1:0.94]);
  const dim=useTransform(scrollYProgress,[0,1],[0,last?0:0.45]);
  return <motion.div ref={ref} id={id} className={`sticky min-h-screen ${RT} px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-28 pb-24 sm:pb-28 md:pb-32`}
    style={{top,background:bg,scale,transformOrigin:tall?'center bottom':'center top',boxShadow:'0 -18px 40px rgba(0,0,0,0.25)'}}>
    {children}
    <motion.div aria-hidden className={`pointer-events-none absolute inset-0 bg-black ${RT}`} style={{opacity:dim}}/>
  </motion.div>;}
function Services(){
  const marks=useMemo(()=>decks.map(()=>createRef<HTMLDivElement>()),[]);
  return(<section className="relative">
    {decks.map(([title,items,bg],i)=><Fragment key={title}>
      {stages[title]&&<Exploded id={i===0?'skills':undefined} className={stageCls} style={{boxShadow:'0 -18px 40px rgba(0,0,0,0.25)'}} {...stages[title]}/>}
      <StackCard i={i} total={decks.length} bg={bg} mark={marks[i]}><List title={title} items={items}/></StackCard>
      <div ref={marks[i]} aria-hidden/></Fragment>)}
  </section>);}

function Card({p,i,total}:{p:typeof projects[number];i:number;total:number}){
  const ref=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','start start']});
  const scale=useTransform(scrollYProgress,[0,1],[1,1-(total-1-i)*0.03]);
  return <div ref={ref} className="min-h-[85vh]"><motion.div className={`sticky top-24 md:top-32 ${R} border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8`} style={{scale,marginTop:i*28}}>
    <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6 text-[#D7E2EA]">
      <span className="hero-heading font-black leading-none" style={{fontSize:'clamp(3rem, 10vw, 140px)'}}>0{i+1}</span>
      <div className="flex-1 hidden sm:block"><p className="font-light uppercase tracking-wide opacity-70">{p.cat}</p><h3 className="font-medium uppercase" style={{fontSize:'clamp(1rem, 2vw, 1.8rem)'}}>{p.name}</h3></div>
      <LiveProjectButton href={GITHUB}/></div>
    <h3 className="sm:hidden font-medium uppercase text-[#D7E2EA] mb-4">{p.name}</h3>
    <div className="flex gap-3 sm:gap-4 items-stretch">
      <div className="flex flex-col gap-3 sm:gap-4" style={{width:'40%'}}>
        <div className={`${panel} flex flex-wrap content-start gap-2`} style={{minHeight:'clamp(130px, 16vw, 230px)'}}>
          {p.stack.map(t=><span key={t} className="rounded-full border border-[#D7E2EA]/60 px-3 py-1 text-[0.7rem] sm:text-sm uppercase tracking-wide">{t}</span>)}</div>
        <div className={`${panel} flex flex-col justify-end flex-1`} style={{minHeight:'clamp(160px, 22vw, 340px)'}}>
          <p className="font-light uppercase tracking-wide opacity-70 text-xs sm:text-base">{p.cat}</p>
          <p className="hero-heading font-black uppercase leading-tight" style={{fontSize:'clamp(1.2rem, 3.2vw, 2.6rem)'}}>{p.date}</p></div></div>
      <div className={`${panel} flex flex-col justify-center gap-5`} style={{width:'60%'}}>
        {p.pts.map(t=><p key={t} className="font-light leading-relaxed" style={{fontSize:'clamp(0.8rem, 1.6vw, 1.3rem)'}}>{t}</p>)}</div></div>
  </motion.div></div>;}
function Projects(){return(
<section id="projects" className="relative z-10 bg-[#0C0C0C] -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-6 pb-24">
  <Exploded className="-mx-5 sm:-mx-8 md:-mx-10 mb-12" title="Projects" mock="harsh.dev / projects" {...stageProjects}/>
  <div className="max-w-6xl mx-auto">{projects.map((p,i)=><Card key={p.name} p={p} i={i} total={projects.length}/>)}</div>
</section>);}

function Footer(){return(
<footer id="contact" className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-10 pb-16 flex flex-col items-center gap-10 text-[#D7E2EA]">
  <h2 className={heading} style={{fontSize:H}}>Contact</h2>
  <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 uppercase tracking-wider text-sm md:text-lg">
    {LINKS.map(([n,u])=><a key={n} href={u} target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">{n}</a>)}</div>
  <p className="font-light opacity-60">Delhi · +91 7701822574</p>
</footer>);}

export default function App(){return <main className="bg-[#0C0C0C]" style={{overflowX:'clip'}}><Hero/><Marquee/><About/><Services/><Projects/><Footer/></main>;}
