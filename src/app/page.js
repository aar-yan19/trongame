// File: app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './globals.css';

export default function Home() {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  const cycle1 = useRef({});
  const cycle2 = useRef({});
  const keysPressed = useRef({});
  const firstrun = useRef(false);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Clear once at start
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const update = () => {
        const cycles = [cycle1.current, cycle2.current];
      
        for (let c of cycles) {
          c.x += c.dx;
          c.y += c.dy;
      
          // Check if the cycle hits any wall or its own trail or the other cycle's trail
          const otherCycle = c === cycle1.current ? cycle2.current : cycle1.current;
      
          if (
            c.x < 0 || c.x >= canvas.width ||
            c.y < 0 || c.y >= canvas.height ||
            c.trail.some(p => p.x === c.x && p.y === c.y) || // Own trail collision
            otherCycle.trail.some(p => p.x === c.x && p.y === c.y) // Other cycle's trail collision
          ) {
            endGame(c === cycle1.current ? 'Flynn' : 'CLU');
            return;
          }
      
          c.trail.push({ x: c.x, y: c.y });
      
          // Glowing trail (as before)
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = c.color;
          ctx.fillRect(c.x, c.y, 6, 6);
      
          // Reset shadow for safety
          ctx.shadowBlur = 0;
        }
      };
      

      const loop = setInterval(update, 16);
      return () => clearInterval(loop);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyDown = e => {
      keysPressed.current[e.key] = true;

      if (e.key === 'ArrowUp') setDirection(cycle2.current, 0, -2);
      if (e.key === 'ArrowDown') setDirection(cycle2.current, 0, 2);
      if (e.key === 'ArrowLeft') setDirection(cycle2.current, -2, 0);
      if (e.key === 'ArrowRight') setDirection(cycle2.current, 2, 0);

      if (e.key === 't') setDirection(cycle1.current, 0, -2);
      if (e.key === 'g') setDirection(cycle1.current, 0, 2);
      if (e.key === 'f') setDirection(cycle1.current, -2, 0);
      if (e.key === 'h') setDirection(cycle1.current, 2, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setDirection = (cycle, dx, dy) => {
    if (cycle.dx !== -dx && cycle.dy !== -dy) {
      cycle.dx = dx;
      cycle.dy = dy;
    }
  };

  const endGame = (loser) => {
    setGameOver(true);
    setWinner(loser === 'Flynn' ? 'CLU' : 'Flynn');
  };

  const startGame = () => {

 
    !firstrun.current && (() => {
      const startSound = new Audio('/tron.mp3');
      startSound.play();
      firstrun.current = true;
    })();
   
  
    cycle1.current = { x: 200, y: 100, dx: 2, dy: 0, trail: [], color: '#00f' };
    cycle2.current = { x: 400, y: 100, dx: -2, dy: 0, trail: [], color: '#ff4d00' };
    setGameOver(false);
    setWinner('');
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {!gameStarted && (
        <div>
        <motion.h1
          className="text-blue-500 text-5xl font-tron mb-8"
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          TRON RETRO
        </motion.h1>
        <h2 className='text-center m-2'>Minor project by aryan. </h2>
        <h2 className='text-center m-2'>Evaluated by professor Dr. Bhupendra. </h2>
        </div>

      )}

      {!gameStarted && (
        <button
          onClick={startGame}
          className="bg-blue-500 text-black text-lg px-6 py-3 rounded hover:bg-blue-400"
        >
          Start Game
        </button>
      )}

      {gameStarted && (
        <canvas ref={canvasRef} width={600} height={400} className="border-2 border-blue-500" />
      )}

      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white mt-4"
        >
          <h2 className="text-2xl">{winner} Wins!</h2>
          <button
            onClick={startGame}
            className="mt-4 bg-white text-black px-4 py-2 rounded"
          >
            Restart
          </button>
        </motion.div>
      )}
    </div>
  );
}
