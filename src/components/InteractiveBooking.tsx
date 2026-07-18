import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Star, Car, Coffee, Sparkles, Send, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { BookingEstimate } from '../types';

interface AddonItem {
  id: string;
  name: string;
  price: number;
  type: 'flat' | 'per-night' | 'per-guest-night';
  icon: React.ReactNode;
  description: string;
}

const ADDONS_LIST: AddonItem[] = [
  {
    id: 'transfer_ist',
    name: 'VIP Airport Transfer (IST)',
    price: 60,
    type: 'flat',
    icon: <Car className="w-5 h-5" />,
    description: 'Chauffeured Mercedes-Benz Vito directly from Istanbul Airport.'
  },
  {
    id: 'transfer_saw',
    name: 'VIP Airport Transfer (SAW)',
    price: 70,
    type: 'flat',
    icon: <Car className="w-5 h-5" />,
    description: 'Chauffeured Mercedes-Benz Vito directly from Sabiha Gökçen Airport.'
  },
  {
    id: 'breakfast',
    name: 'Daily Turkish Breakfast',
    price: 15,
    type: 'per-guest-night',
    icon: <Coffee className="w-5 h-5" />,
    description: 'Traditional organic breakfast basket (olives, honey, local cheeses, pastries) delivered daily.'
  },
  {
    id: 'cleaning',
    name: 'Daily Refresh Housekeeping',
    price: 25,
    type: 'per-night',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Hotel-style daily bed make-up, trash removal, and fresh luxury towels.'
  }
];

export default function InteractiveBooking() {
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(4);
  const [selectedAddons, setSelectedAddons] = useState<{ [key: string]: boolean }>({});
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [nights, setNights] = useState<number>(3);
  const [pricing, setPricing] = useState<{
    baseStay: number;
    extraGuests: number;
    addonsTotal: number;
    grandTotal: number;
  }>({ baseStay: 540, extraGuests: 0, addonsTotal: 0, grandTotal: 540 });

  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Pre-fill dates for realistic initial estimates
  useEffect(() => {
    const today = new Date();
    const inDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks out
    const outDate = new Date(inDate.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 nights stay
    
    setCheckIn(inDate.toISOString().split('T')[0]);
    setCheckOut(outDate.toISOString().split('T')[0]);
  }, []);

  // Recalculate price when checkIn, checkOut, guests, or selectedAddons change
  useEffect(() => {
    if (!checkIn || !checkOut) return;

    const inD = new Date(checkIn);
    const outD = new Date(checkOut);
    const timeDiff = outD.getTime() - inD.getTime();
    
    if (timeDiff <= 0) {
      setErrorMessage('Departure date must be after check-in date.');
      setNights(0);
      return;
    }
    
    setErrorMessage('');
    const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setNights(calculatedNights);

    const baseNightlyRate = 180; // Standard night price
    const freeGuestsCount = 4; // up to 4 guests included in base stay
    const extraGuestRate = 20; // €20 per extra guest per night

    const baseStayCost = baseNightlyRate * calculatedNights;
    const extraGuestsCount = Math.max(0, guests - freeGuestsCount);
    const extraGuestsCost = extraGuestsCount * extraGuestRate * calculatedNights;

    // Calculate addons
    let addonsCost = 0;
    ADDONS_LIST.forEach(addon => {
      if (selectedAddons[addon.id]) {
        if (addon.type === 'flat') {
          addonsCost += addon.price;
        } else if (addon.type === 'per-night') {
          addonsCost += addon.price * calculatedNights;
        } else if (addon.type === 'per-guest-night') {
          addonsCost += addon.price * guests * calculatedNights;
        }
      }
    });

    setPricing({
      baseStay: baseStayCost,
      extraGuests: extraGuestsCost,
      addonsTotal: addonsCost,
      grandTotal: baseStayCost + extraGuestsCost + addonsCost
    });
  }, [checkIn, checkOut, guests, selectedAddons]);

  const handleAddonToggle = (id: string) => {
    setSelectedAddons(prev => {
      const updated = { ...prev };
      // Prevent selecting both IST and SAW transfers
      if (id === 'transfer_ist' && !prev[id]) {
        updated['transfer_saw'] = false;
      } else if (id === 'transfer_saw' && !prev[id]) {
        updated['transfer_ist'] = false;
      }
      updated[id] = !prev[id];
      return updated;
    });
  };

  const getWhatsAppLink = () => {
    const phone = '905300000000'; // Target owner contact placeholder
    const addonsString = Object.keys(selectedAddons)
      .filter(k => selectedAddons[k])
      .map(k => ADDONS_LIST.find(a => a.id === k)?.name)
      .join(', ');

    const message = `Hello Istanbul Luxe! I would like to inquire about booking the Luxury Family Apartment:
- *Check-in*: ${checkIn}
- *Check-out*: ${checkOut}
- *Nights*: ${nights}
- *Guests*: ${guests}
${addonsString ? `- *Services Requested*: ${addonsString}\n` : ''}- *Estimated Total*: €${pricing.grandTotal}
My Name is ${fullName || 'Interested Guest'}. Looking forward to your response!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setErrorMessage('Please fill in your name and email address to submit.');
      return;
    }
    setInquirySubmitted(true);
    setErrorMessage('');
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xl" id="interactive-booking-card">
      <div className="bg-charcoal text-white p-8 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-gold" />
        </div>
        <span className="text-gold uppercase tracking-widest text-xs font-bold block mb-1">Direct Rates & Savings</span>
        <h3 className="text-2xl font-serif">Inquire & Calculate Your Stay</h3>
        <p className="text-gray-400 text-sm mt-2">No service fees. 100% private 150m² home with private check-in.</p>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (Lg cols 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold" /> Check-In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-cream border border-gray-200 px-4 py-3 rounded-xl focus:border-gold focus:outline-none text-charcoal font-medium text-sm transition"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold" /> Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full bg-cream border border-gray-200 px-4 py-3 rounded-xl focus:border-gold focus:outline-none text-charcoal font-medium text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2 flex items-center justify-between">
              <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1.5 text-gold" /> Total Guests</span>
              <span className="text-gold text-xs font-bold">{guests} of 10 max</span>
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-gold hover:text-gold transition active:scale-95 bg-cream"
              >
                -
              </button>
              <input
                type="range"
                min="1"
                max="10"
                value={guests}
                onChange={e => setGuests(parseInt(e.target.value))}
                className="flex-1 h-2 bg-cream rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <button
                type="button"
                onClick={() => setGuests(prev => Math.min(10, prev + 1))}
                className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-gold hover:text-gold transition active:scale-95 bg-cream"
              >
                +
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 italic">
              * Base rate includes up to 4 guests. Each extra guest is charged €20/night.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold" /> Exclusive Concierge Services (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADDONS_LIST.map(addon => {
                const isSelected = !!selectedAddons[addon.id];
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => handleAddonToggle(addon.id)}
                    className={`p-4 rounded-xl text-left border flex items-start space-x-3 transition-all duration-300 ${
                      isSelected
                        ? 'border-gold bg-cream/60 shadow-inner'
                        : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-gold text-white' : 'bg-cream text-gold'} transition-colors`}>
                      {addon.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h5 className="font-semibold text-xs text-charcoal truncate">{addon.name}</h5>
                        <span className="font-serif text-gold text-xs font-bold shrink-0 ml-1">
                          €{addon.price}
                          <span className="text-[9px] text-gray-400 font-sans font-normal font-light">
                            {addon.type === 'flat' ? '' : addon.type === 'per-night' ? '/nt' : '/gst/nt'}
                          </span>
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{addon.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing Estimator Column (Lg cols 5) */}
        <div className="lg:col-span-5 bg-cream/50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4 pb-2 border-b border-gray-200 flex justify-between">
              <span>Invoice Estimate</span>
              <span className="text-gold italic font-serif">{nights} Nights</span>
            </h4>

            {errorMessage ? (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold mb-4 text-center">
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-3.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Base Nightly Stay ({nights} × €180)</span>
                <span className="font-mono text-charcoal font-medium">€{pricing.baseStay}</span>
              </div>
              {pricing.extraGuests > 0 && (
                <div className="flex justify-between">
                  <span>Additional Guests ({guests - 4} × €20 × {nights} nights)</span>
                  <span className="font-mono text-charcoal font-medium">€{pricing.extraGuests}</span>
                </div>
              )}
              {pricing.addonsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Luxury Add-ons Subtotal</span>
                  <span className="font-mono text-charcoal font-medium">€{pricing.addonsTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-green-600 font-semibold bg-green-50/50 p-2 rounded-lg">
                <span>Direct Booking Discount</span>
                <span>- €0 (Saved fees!)</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-baseline">
                <span className="font-bold text-sm text-charcoal uppercase">Grand Total</span>
                <span className="text-3xl font-serif font-bold text-gold">€{pricing.grandTotal}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <AnimatePresence mode="wait">
              {!inquirySubmitted ? (
                <motion.form
                  onSubmit={handleFormSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-xl focus:border-gold focus:outline-none text-xs"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-xl focus:border-gold focus:outline-none text-xs"
                  />
                  <textarea
                    placeholder="Special requests or preferred travel hours..."
                    value={notes}
                    rows={2}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-xl focus:border-gold focus:outline-none text-xs"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="submit"
                      className="w-full bg-charcoal text-white hover:bg-gold-hover px-4 py-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Quote</span>
                    </button>
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white hover:bg-green-700 px-4 py-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md cursor-pointer"
                    >
                      <span className="font-bold">Book Instantly</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 border border-green-100 p-4 rounded-xl text-center space-y-2"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                  <h5 className="font-semibold text-charcoal text-xs">Inquiry Submitted Successfully!</h5>
                  <p className="text-[10px] text-gray-500">
                    Thank you {fullName}. We’ve received your booking request for {checkIn} to {checkOut} ({guests} guests). A personalized offer has been generated and sent to {email}.
                  </p>
                  <button
                    onClick={() => setInquirySubmitted(false)}
                    className="text-[10px] text-gold underline font-semibold mt-2 focus:outline-none"
                  >
                    Edit Request / Add Services
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
