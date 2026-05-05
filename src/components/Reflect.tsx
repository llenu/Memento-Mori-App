/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { differenceInDays } from 'date-fns';
import { UserData } from '../types';

interface Quote {
  text: string;
  author: string;
  category: string;
}

const QUOTES: Quote[] = [
  { text: "You could leave life right now. Let that determine what you do, say, and think.", author: "Marcus Aurelius", category: "Stoicism" },
  { text: "Memento mori — remember, you will die.", author: "Stoic Tradition", category: "Urgency" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca", category: "Urgency" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius", category: "Action" },
  { text: "How long are you going to wait before you demand the best of yourself?", author: "Epictetus", category: "Action" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius", category: "Stoicism" },
  { text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca", category: "Death" },
  { text: "Life is very short and anxious for those who forget the past, neglect the present, and fear the future.", author: "Seneca", category: "Urgency" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius", category: "Action" },
  { text: "If it is not right do not do it; if it is not true do not say it.", author: "Marcus Aurelius", category: "Stoicism" },
  { text: "Don't explain your philosophy. Embody it.", author: "Epictetus", category: "Action" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus", category: "Stoicism" },
  { text: "Man conquers the world by conquering himself.", author: "Zeno of Citium", category: "Action" },
  { text: "Death is nothing to us. When we exist, death is not; and when death exists, we are not.", author: "Epicurus", category: "Death" },
  { text: "Our life is what our thoughts make it.", author: "Marcus Aurelius", category: "Stoicism" },
  { text: "External things are not the problem. It’s your assessment of them. Which you can erase right now.", author: "Marcus Aurelius", category: "Stoicism" },
  { text: "The best revenge is to be unlike him who performed the injury.", author: "Marcus Aurelius", category: "Stoicism" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca", category: "Action" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca", category: "Urgency" },
  { text: "If a man knows not to which port he sails, no wind is favorable.", author: "Seneca", category: "Action" },
  { text: "As is a tale, so is life: not how long it is, but how good it is, is what matters.", author: "Seneca", category: "Legacy" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca", category: "Stoicism" },
  { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus", category: "Gratitude" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus", category: "Action" },
  { text: "There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.", author: "Epictetus", category: "Stoicism" },
  { text: "The key is to keep company only with people who uplift you, whose presence calls forth your best.", author: "Epictetus", category: "Legacy" },
  { text: "Nature has given men one tongue but two ears, that we may hear from others twice as much as we speak.", author: "Epictetus", category: "Stoicism" },
  { text: "Every morning when you wake up, think to yourself: I am alive today.", author: "Steve Jobs", category: "Urgency" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "Urgency" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Action" },
  { text: "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose.", author: "Steve Jobs", category: "Death" },
  { text: "Only the dead have seen the end of war.", author: "Plato", category: "Death" },
  { text: "The unexamined life is not worth living.", author: "Socrates", category: "Action" },
  { text: "I cannot teach anybody anything. I can only make them think.", author: "Socrates", category: "Stoicism" },
  { text: "Be kind, for everyone you meet is fighting a hard battle.", author: "Plato", category: "Stoicism" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "Action" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", category: "Stoicism" },
  { text: "The more you know, the more you know you don't know.", author: "Aristotle", category: "Stoicism" },
  { text: "Patience is bitter, but its fruit is sweet.", author: "Aristotle", category: "Stoicism" },
  { text: "You will never do anything in this world without courage.", author: "Aristotle", category: "Action" },
  { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi", category: "Action" },
  { text: "Don't be satisfied with stories, how things have gone with others. Unfold your own myth.", author: "Rumi", category: "Action" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi", category: "Stoicism" },
  { text: "Live life as if everything is rigged in your favor.", author: "Rumi", category: "Gratitude" },
  { text: "What you seek is seeking you.", author: "Rumi", category: "Gratitude" },
  { text: "Life is a balance of holding on and letting go.", author: "Rumi", category: "Stoicism" },
  { text: "Everything that is made beautiful and fair and lovely is made for the eye of one who sees.", author: "Rumi", category: "Gratitude" },
  { text: "Silence is the language of God, all else is poor translation.", author: "Rumi", category: "Stoicism" },
  { text: "Lovers don't finally meet somewhere. They're in each other all along.", author: "Rumi", category: "Legacy" },
  { text: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", author: "Rumi", category: "Stoicism" }
];

export const Reflect: React.FC<{ user: UserData }> = ({ user }) => {
  const [index, setIndex] = useState(0);
  const daysAlive = differenceInDays(new Date(), new Date(user.birthDate));

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') {
        nextQuote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="h-full w-full flex flex-col items-center justify-center bg-background p-12 cursor-pointer select-none"
      onClick={nextQuote}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-center space-y-12"
        >
          <p className="text-xl md:text-5xl font-display leading-tight italic text-parchment">
            "{QUOTES[index].text}"
          </p>
          
          <div className="space-y-2 md:space-y-4">
            <p className="text-amber font-display text-lg md:text-xl uppercase tracking-widest">
              — {QUOTES[index].author}
            </p>
            <p className="text-parchment/30 text-[8px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em]">
              {QUOTES[index].category}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-24 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3 md:space-y-4 w-full px-8 text-center">
        <div className="w-12 h-px bg-parchment/20" />
        <p className="text-parchment/40 text-[8px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase">
          Day {daysAlive.toLocaleString()} of your life
        </p>
      </div>

      <div className="absolute bottom-8 text-parchment/10 text-[10px] uppercase tracking-widest animate-pulse">
        Tap to cycle
      </div>
    </div>
  );
};
