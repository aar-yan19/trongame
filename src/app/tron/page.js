"use client";

import { use, useEffect, useRef } from 'react';
import motion from 'framer-motion';
import {useState} from 'react';



export default function tron(){

const canvasRef = useRef(null);
const cycle1 = useRef({x:200, y:100, dx:2, dy:0, trail:[], color:'#00f'});
const cycle2 = useRef({x:400,y:100, dx:-2, dy:0, trail:[],color:'#fff'});
const [gamestarted, setGamestarted] = useState(false);
const [gameover, setGameover] = useState(false);
const [winner, setWinner] = useState('');
const keypressed = useRef({});


useEffect(() => {

    const handleKeyDown = (e) => {

      keypressed.current[e.key] = true;

      if(e.key === 't') setDirection(cycle1.current, 0, -2);
      if(e.key === 'f') setDirection(cycle1.current, -2, 0 );
      if(e.key==='g') setDirection(cycle1.current, 0,2);
      if (e.key==='h') setDirection(cycle1.current, 2,0);

      if(e.key==='ArrowUp') setDirection(cycle2.current, 0, -2);
      if(e.key==='ArrowDown') setDirection(cycle2.current, 0,2);
      if(e.key==='ArrowLeft') setDirection(cycle2.current, -2, 0);
      if(e.key==='ArrowRight') setDirection(cycle2.current, 2,0);



    }; window.addEventListener('keydown', handleKeyDown)
    return ()=> window.removeEventListener('keydown', handleKeyDown);


}, []);

const setDirection = (cycle,dx,dy) =>{
    if(cycle.dx !== -dx && cycle.dy !== -dy){
        cycle.dx = dx;
        cycle.dy = dy;

    }
}



    return(
        <div>
           
        </div>
    )
}