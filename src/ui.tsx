import { useEffect, useMemo, useRef, useState, ReactNode, ElementType } from 'react';
import { Github } from 'lucide-react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

export function FadeIn({children,delay=0,duration=0.7,x=0,y=30,className,as='div'}:{children:ReactNode;delay?:number;duration?:number;x?:number;y?:number;className?:string;as?:ElementType}) {
  const M:any = useMemo(()=>motion.create(as),[as]);
  return <M className={className} initial={{opacity:0,x,y}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,margin:'50px',amount:0}} transition={{duration,delay,ease:[0.25,0.1,0.25,1]}}>{children}</M>;
}

export function Magnet({children,padding=100,strength=2,activeTransition='transform 0.3s ease-out',inactiveTransition='transform 0.6s ease-in-out',className}:{children:ReactNode;padding?:number;strength?:number;activeTransition?:string;inactiveTransition?:string;className?:string}) {
  const ref=useRef<HTMLDivElement>(null);const [active,setActive]=useState(false);const [pos,setPos]=useState({x:0,y:0});
  useEffect(()=>{const mv=(e:MouseEvent)=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;
    if(Math.abs(cx-e.clientX)<r.width/2+padding&&Math.abs(cy-e.clientY)<r.height/2+padding){setActive(true);setPos({x:(e.clientX-cx)/strength,y:(e.clientY-cy)/strength});}else{setActive(false);setPos({x:0,y:0});}};
    window.addEventListener('mousemove',mv);return()=>window.removeEventListener('mousemove',mv);},[padding,strength]);
  return <div ref={ref} className={className}><div style={{transform:`translate3d(${pos.x}px,${pos.y}px,0)`,transition:active?activeTransition:inactiveTransition,willChange:'transform'}}>{children}</div></div>;
}

function Char({c,i,n,p}:{c:string;i:number;n:number;p:MotionValue<number>}) {
  const o=useTransform(p,[i/n,(i+1)/n],[0.2,1]);
  return <span className="relative"><span className="invisible">{c}</span><motion.span className="absolute left-0 top-0" style={{opacity:o}}>{c}</motion.span></span>;
}
export function AnimatedText({text}:{text:string}) {
  const ref=useRef<HTMLParagraphElement>(null);
  const {scrollYProgress}=useScroll({target:ref,offset:['start 0.8','end 0.2']});
  const chars=text.split('');
  return <p ref={ref} className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]" style={{fontSize:'clamp(1rem, 2vw, 1.35rem)'}}>
    {chars.map((c,i)=><Char key={i} c={c} i={i} n={chars.length} p={scrollYProgress}/>)}</p>;
}

export const ContactButton=()=>(
  <a href="mailto:harshvardhanq123@gmail.com" className="inline-block rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
    style={{background:'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',boxShadow:'0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',outline:'2px solid white',outlineOffset:'-3px'}}>Contact Me</a>);
export const LiveProjectButton=({href='#'}:{href?:string})=>(
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors"><Github size={18}/>GitHub</a>);
