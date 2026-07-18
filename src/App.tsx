import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Sparkles, Star, Coffee, Car, Tv, Bath, SlidersHorizontal, 
  Wifi, Utensils, Wind, Shirt, ChevronDown, Check, CheckCircle2, 
  Calendar, ChevronRight, Clock, Compass, HelpCircle, ShieldCheck 
} from 'lucide-react';

import InteractiveBooking from './components/InteractiveBooking';
import InteractiveGallery from './components/InteractiveGallery';
import LandmarkTransit from './components/LandmarkTransit';
import ConciergeChat from './components/ConciergeChat';
import ReviewsSection from './components/ReviewsSection';
import { AMENITIES } from './data';

export default function App() {
  const [navScrolled, setNavScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans selection:bg-gold selection:text-white">
      
      {/* Premium Sticky Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${
        navScrolled 
          ? 'py-3.5 glass-nav border-gold/15 shadow-md' 
          : 'py-5 bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="flex items-baseline space-x-1 group">
            <span className="text-2xl font-serif font-bold tracking-tight text-charcoal">ISTANBUL</span>
            <span className="text-2xl font-serif font-light text-gold transition group-hover:brightness-110">LUXE</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-600">
            <a href="#why-us" className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200">The Stay</a>
            <a href="#amenities" className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200">Amenities</a>
            <a href="#location" className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200">Proximity Map</a>
            <a href="#transfer" className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200">VIP Vito</a>
            <a href="#gallery" className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200">Gallery</a>
            <a href="#concierge" className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200">AI Concierge</a>
            <a href="#reviews" className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200">Reviews</a>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="#booking" 
              className="bg-gold text-white hover:brightness-110 px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-gold/10 active:scale-95 cursor-pointer"
            >
              Book Your Stay
            </a>
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 rounded-lg bg-white/40 border border-gray-200/40 text-charcoal focus:outline-none"
            >
              <SlidersHorizontal className="w-4 h-4 text-charcoal rotate-90" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-cream/95 backdrop-blur-xl border-b border-gold/15 overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4 flex flex-col text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold py-1">The Stay</a>
                <a href="#amenities" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold py-1">Amenities</a>
                <a href="#location" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold py-1">Proximity Map</a>
                <a href="#transfer" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold py-1">VIP Vito</a>
                <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold py-1">Gallery</a>
                <a href="#concierge" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold py-1">AI Concierge</a>
                <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold py-1">Reviews</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Welcome Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-charcoal">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=2000" 
            alt="Istanbul Panoramic Rooftop Terrace View" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-[0.3em] font-semibold mb-6 text-white"
          >
            Historic Center • Fatih
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-white leading-tight font-medium tracking-tight"
          >
            Elegance at the <br className="hidden md:inline" />
            <span className="italic font-light text-gold">Sultan's Gate</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/80 text-sm sm:text-lg font-light max-w-3xl mx-auto leading-relaxed"
          >
            150 m² private oasis • 4 Bedrooms • Sleeps up to 10 guests • Private glass jacuzzi • Panoramic rooftop terrace • VIP Mercedes-Benz Vito Airport transfers
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <a 
              href="#booking" 
              className="bg-gold text-white hover:brightness-110 px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
            >
              Book Your Stay
            </a>
            <a 
              href="#concierge" 
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-charcoal transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Talk to AI Concierge
            </a>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-center space-y-1 select-none animate-bounce">
          <span className="text-[10px] uppercase tracking-widest font-semibold block">Explore Stay</span>
          <ChevronDown className="w-5 h-5 mx-auto" />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-28 bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Explanatory text */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-gold font-serif italic text-xl mb-2">Premium Family Apartment</h2>
                <div className="h-px w-20 bg-gold mb-6"></div>
                <h3 className="text-3xl sm:text-5xl font-serif text-charcoal font-medium leading-tight">
                  Your Entire Private Residence <br /> in the Heart of the Peninsula
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
                Experience Istanbul without compromise. Unlike cramped hotel suites or shared listings, our spacious 150m² luxury residence offers absolute independence for large families and travel groups. Tucked in a safe, quiet, residential enclave of Fatih, you’re connected directly to all historic wonders.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-2 text-xs font-semibold">
                {[
                  '150m² Full Floor Apartment',
                  '4 Fully Air-Conditioned Bedrooms',
                  '100% Private - No Shared Areas',
                  'Contactless Smart Door Entry',
                  'Private Spa Glass Jacuzzi',
                  'Barista Espresso & Tea Station'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-charcoal/80">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full mr-1 shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium visual card */}
            <div className="lg:col-span-5 relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Istanbul Luxe Spacious Living Lounge" 
                  referrerPolicy="no-referrer"
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent flex items-end p-8 text-white">
                  <div>
                    <span className="text-gold text-[10px] uppercase tracking-widest font-bold">Design Masterpiece</span>
                    <h5 className="font-serif text-lg">Double Custom Parlor</h5>
                  </div>
                </div>
              </div>
              
              {/* Abs Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-2xl rounded-3xl hidden lg:block border border-gold/15">
                <p className="text-gold text-4xl font-serif font-bold mb-0.5">100%</p>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-charcoal">Private Sanctuary</p>
                <p className="text-[9px] text-gray-400 mt-1">Reserved solely for your group</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Premium Amenities Inspector Section */}
      <section id="amenities" className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <h2 className="text-gold font-serif italic text-xl">Resort-Level Appointments</h2>
            <div className="h-px w-20 bg-gold mx-auto mb-6"></div>
            <h3 className="text-3xl sm:text-5xl font-serif font-medium text-charcoal">In-Home Amenities</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-lg mx-auto">
              Every detail is curated, sanitized, and restocked according to five-star boutique hospitality protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AMENITIES.map((amenity, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-gray-100 bg-cream/10 hover:bg-cream/40 card-hover space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cream text-gold flex items-center justify-center">
                  {amenity.iconName === 'Bath' && <Bath className="w-5 h-5" />}
                  {amenity.iconName === 'Sunset' && <Compass className="w-5 h-5" />}
                  {amenity.iconName === 'Tv' && <Tv className="w-5 h-5" />}
                  {amenity.iconName === 'Wifi' && <Wifi className="w-5 h-5" />}
                  {amenity.iconName === 'Utensils' && <Utensils className="w-5 h-5" />}
                  {amenity.iconName === 'Coffee' && <Coffee className="w-5 h-5" />}
                  {amenity.iconName === 'Wind' && <Wind className="w-5 h-5" />}
                  {amenity.iconName === 'Shirt' && <Shirt className="w-5 h-5" />}
                  {amenity.iconName === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-charcoal">{amenity.name}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1.5 font-light">
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Transit Map / Landmark Visualizer Section */}
      <section id="location" className="py-28 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-4">
              <h2 className="text-gold font-serif italic text-xl">Prime Transit Geography</h2>
              <div className="h-px w-20 bg-gold mb-6"></div>
              <h3 className="text-3xl sm:text-5xl font-serif font-medium leading-tight">Explore the Magic of Istanbul in Minutes</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xl">
                Avoid slow bridge traffic. Being located inside the Fatih district center gives you direct walking steps to the **Yusufpaşa T1 Tram** and **Yenikapı Metro Interchange Hub**, making all city areas easily reachable.
              </p>
            </div>
            
            {/* Quick overview of transport times */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Tram T1 Station</p>
                <p className="text-2xl font-serif text-gold font-bold mt-1">2 Mins Walk</p>
                <p className="text-[9px] text-gray-500">Fast connection to sights</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Marmaray Hub</p>
                <p className="text-2xl font-serif text-gold font-bold mt-1">5 Mins Walk</p>
                <p className="text-[9px] text-gray-500">Metro to Asian Side & Taksim</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Yellow Taxis</p>
                <p className="text-2xl font-serif text-gold font-bold mt-1">At Doorstep</p>
                <p className="text-[9px] text-gray-500">Concierge hailing available</p>
              </div>
            </div>
          </div>

          {/* Map landmark transit simulator component */}
          <LandmarkTransit />

        </div>
      </section>

      {/* VIP Airport transfer Mercedes Vito Section */}
      <section id="transfer" className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-cream rounded-3xl overflow-hidden shadow-sm flex flex-col lg:flex-row border border-gold/10">
            
            {/* Description card */}
            <div className="lg:w-1/2 p-8 md:p-14 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-gold font-serif italic text-xl mb-2">Exclusive Logistics</h2>
                <div className="h-px w-20 bg-gold mb-6"></div>
                <h3 className="text-3xl sm:text-4xl font-serif font-medium text-charcoal">Mercedes-Benz Vito VIP Airport Transfer</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                Forget the stress of street taxi negotiations. We provide private airport pickups from Istanbul Airport (IST) and Sabiha Gökçen Airport (SAW) using our private fleet. Our professional driver greets you at the arrivals gate.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-charcoal">
                <div className="flex items-center space-x-2.5">
                  <Star className="w-4 h-4 text-gold" />
                  <span>Starlit Sky Roof</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Tv className="w-4 h-4 text-gold" />
                  <span>TV & Music Systems</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Coffee className="w-4 h-4 text-gold" />
                  <span>Chilled Soft Drinks</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Car className="w-4 h-4 text-gold" />
                  <span>Luggage Assistance</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-baseline gap-4">
                <a 
                  href="#booking" 
                  className="bg-charcoal hover:bg-gold text-white text-xs font-bold px-8 py-3.5 rounded-full transition shadow-md uppercase tracking-wider cursor-pointer"
                >
                  Book with Transfer Estimate
                </a>
                <a 
                  href="https://wa.me/905312980035" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-gold font-bold border-b border-gold hover:text-charcoal transition text-xs"
                >
                  Inquire pricing via WhatsApp →
                </a>
              </div>
            </div>

            {/* Side photo with JSX referrerPolicy="no-referrer" */}
            <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-[450px]">
              <img 
                src="https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&q=80&w=1200" 
                alt="VIP Mercedes-Benz Vito Luxury Lounge Cabin" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-gold font-serif italic text-xl">Immersive View</h2>
            <div className="h-px w-20 bg-gold mx-auto mb-6"></div>
            <h3 className="text-3xl sm:text-5xl font-serif font-medium text-charcoal">Residency Photo Gallery</h3>
          </div>

          <InteractiveGallery />

        </div>
      </section>

      {/* AI Host Assistant Chat & FAQ Section */}
      <section id="concierge" className="py-28 bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Narrative text block */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-gold font-serif italic text-xl mb-2">24/7 Digital Concierge</h2>
                <div className="h-px w-20 bg-gold mb-6"></div>
                <h3 className="text-3xl sm:text-4xl font-serif font-medium text-charcoal leading-snug">
                  Smart Local AI Assistant At Your Service
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                Have specific questions about check-in policies, WiFi speed, local markets, early arrivals, or the best traditional tea spots in the neighborhood?
              </p>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                Use our digital host chat! It is programmed directly with our apartment rules and historic neighborhood geography to guide you instantly.
              </p>

              <div className="space-y-3.5 border-t border-gray-200/60 pt-6">
                <div className="flex items-center space-x-3.5 text-xs text-charcoal font-semibold">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mr-1 shrink-0"></div>
                  <span>Instantly answer operational FAQ queries</span>
                </div>
                <div className="flex items-center space-x-3.5 text-xs text-charcoal font-semibold">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mr-1 shrink-0"></div>
                  <span>Discover authentic local landmarks and eateries</span>
                </div>
                <div className="flex items-center space-x-3.5 text-xs text-charcoal font-semibold">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mr-1 shrink-0"></div>
                  <span>Completely private and safe secure data proxy</span>
                </div>
              </div>
            </div>

            {/* Chatbox widget (Lg cols 7) */}
            <div className="lg:col-span-7">
              <ConciergeChat />
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials & Reviews Section */}
      <section id="reviews" className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-gold font-serif italic text-xl">Unfiltered Feedback</h2>
            <div className="h-px w-20 bg-gold mx-auto mb-6"></div>
            <h3 className="text-3xl sm:text-5xl font-serif font-medium text-charcoal">"A classic home away from home."</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-lg mx-auto">Verified reviews from leading booking channels and direct group stays.</p>
          </div>

          <ReviewsSection />

        </div>
      </section>

      {/* Booking Calculator Section */}
      <section id="booking" className="py-28 bg-cream border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-gold font-serif italic text-xl">Instant Booking Savings</h2>
            <div className="h-px w-20 bg-gold mx-auto mb-6"></div>
            <h3 className="text-3xl sm:text-5xl font-serif font-medium text-charcoal">Estimate Your Custom Stay</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-lg mx-auto">Skip standard travel channel fees. Connect with the owner instantly.</p>
          </div>

          <InteractiveBooking />

        </div>
      </section>

      {/* Trust & Guest experience Section */}
      <section className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h3 className="text-3xl font-serif font-medium text-charcoal">The Five-Star Guest Standard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-cream text-gold flex items-center justify-center mx-auto text-xl font-bold">
                🔑
              </div>
              <h4 className="text-base font-semibold text-charcoal">Seamless Check-In</h4>
              <p className="text-gray-500 text-xs leading-relaxed font-light">
                Contactless key-code door technology allows flexible, autonomous access at any late hour of the night.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-cream text-gold flex items-center justify-center mx-auto text-xl font-bold">
                💬
              </div>
              <h4 className="text-base font-semibold text-charcoal">24/7 Human Concierge</h4>
              <p className="text-gray-500 text-xs leading-relaxed font-light">
                Our local guest hosting squad is on-call around the clock via WhatsApp for any emergency, restock, or booking.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-cream text-gold flex items-center justify-center mx-auto text-xl font-bold">
                🧹
              </div>
              <h4 className="text-base font-semibold text-charcoal">Immaculate Cleanliness</h4>
              <p className="text-gray-500 text-xs leading-relaxed font-light">
                Our in-house professional cleaning squad uses medical-grade protocols and anti-allergen steam methods.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call To Action Book Now */}
      <section className="py-28 bg-charcoal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Compass className="w-96 h-96 text-gold" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-gold">Secure Your Stay Today</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
              Experience historic Sultanahmet and Fatih from our luxury rooftop panoramic penthouse. Direct bookings qualify for VIP airport transfer bundles.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://wa.me/905312980035" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2.5 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Book via WhatsApp</span>
            </a>
            <a 
              href="https://airbnb.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2.5 bg-white text-charcoal hover:bg-gray-100 px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition shadow-lg active:scale-95 cursor-pointer"
            >
              <span className="text-red-500 font-extrabold">★</span>
              <span>Find on Airbnb</span>
            </a>
            <a 
              href="https://booking.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2.5 bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Find on Booking.com</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left border-t border-white/10 pt-10">
            <div>
              <h5 className="text-gold font-bold uppercase tracking-wider text-xs">Residence Location</h5>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                Fatih District, Istanbul, Turkey <br />
                Steps from Yusufpaşa T1 Tram & Yenikapı Metro
              </p>
            </div>
            <div>
              <h5 className="text-gold font-bold uppercase tracking-wider text-xs">Direct Office Information</h5>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                mitatnoyangocmen@gmail.com <br />
                +90 (531) 298 00 35
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-gray-500 text-xs border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2026 Luxury Family Residence Istanbul. Built exclusively with premium materials.</p>
          <div className="flex space-x-8 uppercase tracking-widest text-[10px] font-semibold">
            <a href="#" className="hover:text-gold transition">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition">House Rules</a>
            <a href="#" className="hover:text-gold transition">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
