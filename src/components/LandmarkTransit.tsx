import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, Compass, Store, MapPin, Eye, Clock, Train, ArrowRight, Navigation, Sparkles, Footprints, ShieldCheck } from 'lucide-react';
import { LANDMARKS } from '../data';

export default function LandmarkTransit() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [transitMode, setTransitMode] = useState<'public' | 'walk' | 'taxi' | 'vip'>('public');

  const activeLandmark = LANDMARKS[selectedIdx];

  const getModeDetails = () => {
    switch (transitMode) {
      case 'public':
        return {
          time: activeLandmark.minutes,
          cost: '€1.20 (Istanbulkart)',
          comfort: 'Efficient, recommended to beat traffic',
          instructions: `Walk 2 mins to Yusufpaşa Tram. Board T1. Ride ${activeLandmark.stops} stops to your destination.`
        };
      case 'walk':
        // Rough estimate of walking time (tram stops * 10 mins)
        const walkMin = (activeLandmark.stops * 12) + 15;
        return {
          time: `${walkMin} mins`,
          cost: 'Free',
          comfort: 'Active walk, beautiful historic sights along the tram path',
          instructions: `Follow the historic tramline tracks eastwards through Divanyolu Street directly to your destination.`
        };
      case 'taxi':
        // Rough taxi estimate
        const taxiMin = Math.max(8, Math.floor(parseInt(activeLandmark.minutes) * 1.2));
        return {
          time: `${taxiMin} mins`,
          cost: '€4.00 - €7.00',
          comfort: 'Private, variable depending on local traffic peak hours',
          instructions: 'Our concierge can hail an official yellow taxi to our door. Ensure the taximeter is turned on.'
        };
      case 'vip':
        return {
          time: `${Math.max(6, Math.floor(parseInt(activeLandmark.minutes) * 0.95))} mins`,
          cost: 'Included in Transfer Package',
          comfort: 'Mercedes Vito, fully air-conditioned, cold drinks',
          instructions: 'Inquire with our private host to schedule your custom chauffeured travel. Best-in-class comfort.'
        };
    }
  };

  const details = getModeDetails();

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl grid grid-cols-1 lg:grid-cols-12">
      {/* Sights selector list (Lg cols 5) */}
      <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-gray-100 p-6 md:p-8 space-y-6">
        <div>
          <span className="text-gold uppercase tracking-widest text-[10px] font-bold block mb-1">Transit & Proximity</span>
          <h4 className="text-xl font-serif text-charcoal">Apartment Neighborhood</h4>
          <p className="text-xs text-gray-500 mt-1">Perfect central hub steps from Yusufpaşa T1 & Yenikapı.</p>
        </div>

        <div className="space-y-3.5">
          {LANDMARKS.map((landmark, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={landmark.name}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`w-full p-4 rounded-xl text-left border transition-all duration-300 flex items-center space-x-4 cursor-pointer ${
                  isSelected
                    ? 'border-gold bg-cream/70 shadow-sm'
                    : 'border-gray-50 hover:border-gold/20 hover:bg-gray-50/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-gold text-white' : 'bg-cream text-gold'
                }`}>
                  {landmark.name === 'Grand Bazaar' ? (
                    <Store className="w-5 h-5" />
                  ) : (
                    <Compass className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h5 className="font-semibold text-xs text-charcoal truncate">{landmark.name}</h5>
                    <span className="text-gold font-serif text-xs font-bold shrink-0 ml-1">
                      {landmark.minutes}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 truncate">{landmark.tag}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transit visualizer panel (Lg cols 7) */}
      <div className="lg:col-span-7 p-6 md:p-8 bg-cream/30 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Landmark Name & Description */}
          <div className="pb-4 border-b border-gray-200/60">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                  {activeLandmark.tag}
                </span>
                <h3 className="font-serif text-2xl text-charcoal mt-2 leading-snug">{activeLandmark.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-gray-400 block">Via Public Transit</span>
                <span className="text-lg font-serif font-bold text-gold">{activeLandmark.minutes}</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed mt-3 font-light">
              {activeLandmark.description}
            </p>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Choose Travel Mode</span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'public', label: 'T1 Tram', icon: <Train className="w-4 h-4" /> },
                { value: 'walk', label: 'Walk', icon: <Footprints className="w-4 h-4" /> },
                { value: 'taxi', label: 'Taxi', icon: <Clock className="w-4 h-4" /> },
                { value: 'vip', label: 'VIP Vito', icon: <Sparkles className="w-4 h-4" /> }
              ].map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setTransitMode(m.value as any)}
                  className={`py-2 px-1 rounded-lg border text-center flex flex-col items-center justify-center space-y-1 cursor-pointer transition ${
                    transitMode === m.value
                      ? 'border-gold bg-white text-gold shadow-sm font-semibold'
                      : 'border-transparent text-gray-500 hover:text-gold hover:bg-white/40'
                  }`}
                >
                  {m.icon}
                  <span className="text-[9px] uppercase tracking-tighter">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Route Visualizer Chart */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 block">Illustrated Transit Chart</span>
            
            <div className="flex items-center space-x-3.5 relative">
              {/* Linear route connector */}
              <div className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-dashed border-l border-gold/40" />

              <div className="space-y-6 w-full text-xs">
                {/* Step 1 */}
                <div className="flex items-start space-x-3 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    1
                  </div>
                  <div className="pt-0.5">
                    <h6 className="font-semibold text-charcoal">Apartment Doorstep</h6>
                    <p className="text-[10px] text-gray-400">Fatih historic quiet enclave</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-3 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    2
                  </div>
                  <div className="pt-0.5">
                    <h6 className="font-semibold text-charcoal">Transit Action</h6>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{details.instructions}</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-3 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    3
                  </div>
                  <div className="pt-0.5 flex justify-between items-start w-full">
                    <div>
                      <h6 className="font-semibold text-charcoal">Arrive at {activeLandmark.name}</h6>
                      <p className="text-[10px] text-gray-400">Total duration: ~{details.time}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gold font-bold bg-cream px-2 py-0.5 rounded-full block font-serif">
                        Cost: {details.cost}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips / Safety */}
        <div className="mt-6 p-4 rounded-xl bg-gold/10 border border-gold/10 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div className="text-[10px] text-gray-600 leading-relaxed">
            <span className="font-bold text-charcoal block">Concierge Location Tip:</span>
            Unlike outer suburban listings, staying in Fatih-Yusufpaşa puts you inside the safe municipal ring. Public transport is rapid and avoids Bosphorus gridlocks completely.
          </div>
        </div>
      </div>
    </div>
  );
}
