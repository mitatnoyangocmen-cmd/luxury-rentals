import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Sparkles,
  Star,
  Coffee,
  Car,
  Tv,
  Bath,
  SlidersHorizontal,
  Wifi,
  Utensils,
  Wind,
  Shirt,
  ChevronDown,
  Check,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Clock,
  Compass,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

import InteractiveGallery from "./components/InteractiveGallery";
import ConciergeChat from "./components/ConciergeChat";
import ReviewsSection from "./components/ReviewsSection";
import { AMENITIES } from "./data";
import VIPTransferBooking from "./components/VIPTransferBooking";

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans selection:bg-gold selection:text-white">
      {/* Premium Sticky Navigation */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 h-20 md:h-24 transition-all duration-300 border-b ${
          navScrolled
            ? "glass-nav border-gold/15 shadow-md"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto grid h-full w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 min-[1180px]:gap-5 min-[1180px]:px-6">
          <a href="#" className="flex shrink-0 items-center group">
            <img
            src="/images/logos/FMG-Homes_Logo-V3.png"
            alt="Istanbul Panoramic Rooftop Terrace View"
            referrerPolicy="no-referrer"
            className="w-16 sm:w-20 min-[1180px]:w-28 h-auto object-contain opacity-100"
            />
          </a>

          {/* Desktop Navigation Links */}
          <div className={`hidden min-[920px]:flex min-w-0 items-center justify-center gap-3 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] min-[1180px]:gap-6 min-[1180px]:text-[11px] min-[1180px]:tracking-[0.2em] ${navScrolled ? "text-gray-600" : "text-white/85"}`}>
            <a
              href="#why-us"
              className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200"
            >
              The Stay
            </a>
            <a
              href="#amenities"
              className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200"
            >
              Amenities
            </a>
            <a
              href="#gallery"
              className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200"
            >
              Gallery
            </a>
            {/*
            <a href="#concierge" className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200">AI Concierge</a>
            */}
            <a
              href="#reviews"
              className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200"
            >
              Reviews
            </a>
            <a
              href="#vip-transfer-benefits"
              className="hover:text-gold border-b border-transparent hover:border-gold pb-1 transition-all duration-200"
            >
              VIP Transfer
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-2 min-[1180px]:gap-4">
            <a
              href="#platform-booking"
              className="inline-flex items-center justify-center bg-gold text-white hover:brightness-110 px-4 sm:px-5 min-[1180px]:px-10 py-3 min-[1180px]:py-3.5 rounded-full text-[10px] min-[1180px]:text-[11px] font-bold uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-gold/10 active:scale-95 cursor-pointer"
            >
              Book Your Stay
            </a>
            <a href="#vip-transfer-booking" className="hidden sm:inline-flex items-center justify-center border border-gold bg-white/90 text-charcoal hover:bg-gold hover:text-white px-5 min-[1180px]:px-8 py-3 min-[1180px]:py-3.5 rounded-full text-[10px] min-[1180px]:text-[11px] font-bold uppercase tracking-widest transition-all duration-300">
              Book VIP Transfer
            </a>
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-[920px]:hidden p-2 rounded-lg bg-white/40 border border-gray-200/40 text-charcoal focus:outline-none"
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
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="min-[920px]:hidden bg-cream/95 backdrop-blur-xl border-b border-gold/15 overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4 flex flex-col text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                <a
                  href="#why-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-gold py-1"
                >
                  The Stay
                </a>
                <a
                  href="#amenities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-gold py-1"
                >
                  Amenities
                </a>
                <a
                  href="#gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-gold py-1"
                >
                  Gallery
                </a>
                <a
                  href="#reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-gold py-1"
                >
                  Reviews
                </a>
                <a
                  href="#vip-transfer-benefits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-gold py-1"
                >
                  VIP Transfer
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Welcome Section */}
      <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-x-clip bg-charcoal">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=2000"
            alt="Istanbul Panoramic Rooftop Terrace View"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-[clamp(8rem,16vh,11rem)] pb-10 text-center sm:gap-7">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-[0.3em] font-semibold text-white"
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
            150 m² private oasis • 4 Bedrooms • Sleeps up to 10 guests • Private
            glass hot tub • Panoramic rooftop terrace • VIP Mercedes-Benz Vito
            Airport transfers
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-3 pt-2"
          >
            <a href="#platform-booking" className="rounded-full bg-gold px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-white transition hover:brightness-110">Book Your Stay</a>
            <a href="#vip-transfer-booking" className="rounded-full border border-white/50 bg-white/10 px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur transition hover:bg-white hover:text-charcoal">Book VIP Transfer</a>
          </motion.div>
          <div className="mt-1 animate-bounce text-center text-white/50 select-none">
            <span className="block text-[10px] font-semibold uppercase tracking-widest">Explore Stay</span>
            <ChevronDown className="mx-auto h-5 w-5" />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-28 bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Explanatory text */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-gold font-serif italic text-xl mb-2">
                  Premium Family Apartment
                </h2>
                <div className="h-px w-20 bg-gold mb-6"></div>
                <h3 className="text-3xl sm:text-5xl font-serif text-charcoal font-medium leading-tight">
                  Your Entire Private Residence <br /> in the Heart of the
                  Peninsula
                </h3>
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
                Experience Istanbul without compromise. Unlike cramped hotel
                suites or shared listings, our spacious 150m² luxury residence
                offers absolute independence for large families and travel
                groups. Tucked in a safe, quiet, residential enclave of Fatih,
                you’re connected directly to all historic wonders.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-2 text-xs font-semibold">
                {[
                  "150m² Full Floor Apartment",
                  "4 Fully Air-Conditioned Bedrooms",
                  "100% Private - No Shared Areas",
                  "Contactless Smart Door Entry",
                  "Private Spa Glass hot tub",
                  "Barista Espresso & Tea Station",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 text-charcoal/80"
                  >
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
                  src="/images/historic-loft/livingroom.jpg"
                  alt="Istanbul Luxe Spacious Living Lounge"
                  referrerPolicy="no-referrer"
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent flex items-end p-8 text-white">
                  <div>
                    <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                      Design Masterpiece
                    </span>
                    <h5 className="font-serif text-lg">Double Custom Parlor</h5>
                  </div>
                </div>
              </div>

              {/* Abs Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-2xl rounded-3xl hidden lg:block border border-gold/15">
                <p className="text-gold text-4xl font-serif font-bold mb-0.5">
                  100%
                </p>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-charcoal">
                  Private Sanctuary
                </p>
                <p className="text-[9px] text-gray-400 mt-1">
                  Reserved solely for your group
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Amenities Inspector Section */}
      <section
        id="amenities"
        className="py-28 bg-white border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <h2 className="text-gold font-serif italic text-xl">
              Resort-Level Appointments
            </h2>
            <div className="h-px w-20 bg-gold mx-auto mb-6"></div>
            <h3 className="text-3xl sm:text-5xl font-serif font-medium text-charcoal">
              In-Home Amenities
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-lg mx-auto">
              Every detail is curated, sanitized, and restocked according to
              five-star boutique hospitality protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AMENITIES.map((amenity, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-gray-100 bg-cream/10 hover:bg-cream/40 card-hover space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cream text-gold flex items-center justify-center">
                  {amenity.iconName === "Bath" && <Bath className="w-5 h-5" />}
                  {amenity.iconName === "Sunset" && (
                    <Compass className="w-5 h-5" />
                  )}
                  {amenity.iconName === "Tv" && <Tv className="w-5 h-5" />}
                  {amenity.iconName === "Wifi" && <Wifi className="w-5 h-5" />}
                  {amenity.iconName === "Utensils" && (
                    <Utensils className="w-5 h-5" />
                  )}
                  {amenity.iconName === "Coffee" && (
                    <Coffee className="w-5 h-5" />
                  )}
                  {amenity.iconName === "Wind" && <Wind className="w-5 h-5" />}
                  {amenity.iconName === "Shirt" && (
                    <Shirt className="w-5 h-5" />
                  )}
                  {amenity.iconName === "Sparkles" && (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-charcoal">
                    {amenity.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1.5 font-light">
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-gold font-serif italic text-xl">
              Immersive View
            </h2>
            <div className="h-px w-20 bg-gold mx-auto mb-6"></div>
            <h3 className="text-3xl sm:text-5xl font-serif font-medium text-charcoal">
              Residency Photo Gallery
            </h3>
          </div>

          <InteractiveGallery />
        </div>
      </section>

      {/* AI Concierge Chat component placeholder */}

      {/* Testimonials & Reviews Section */}
      <section id="reviews" className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-gold font-serif italic text-xl">
              Unfiltered Feedback
            </h2>
            <div className="h-px w-20 bg-gold mx-auto mb-6"></div>
            <h3 className="text-3xl sm:text-5xl font-serif font-medium text-charcoal">
              "A classic home away from home."
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-lg mx-auto">
              Verified reviews from leading booking channels and direct group
              stays.
            </p>
          </div>

          <ReviewsSection />
        </div>
      </section>

      {/* Trust & Guest experience Section */}
      <section className="py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h3 className="text-3xl font-serif font-medium text-charcoal">
            The Five-Star Guest Standard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-cream text-gold flex items-center justify-center mx-auto text-xl font-bold">
                🔑
              </div>
              <h4 className="text-base font-semibold text-charcoal">
                Seamless Check-In
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-light">
                Contactless key-code door technology allows flexible, autonomous
                access at any late hour of the night.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-cream text-gold flex items-center justify-center mx-auto text-xl font-bold">
                💬
              </div>
              <h4 className="text-base font-semibold text-charcoal">
                24/7 Human Concierge
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-light">
                Our local guest hosting squad is on-call around the clock via
                WhatsApp for any emergency, restock, or booking.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-cream text-gold flex items-center justify-center mx-auto text-xl font-bold">
                🧹
              </div>
              <h4 className="text-base font-semibold text-charcoal">
                Immaculate Cleanliness
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-light">
                Our in-house professional cleaning squad uses medical-grade
                protocols and anti-allergen steam methods.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* --- SECTION: DIRECT BOOKING & SAVINGS --- */}
      <section id="vip-transfer-booking" className="py-24 bg-[#F9F7F2] border-t border-gray-100 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-[#C5A059] font-serif italic text-2xl" data-aos="fade-up">
              Private Airport Service
            </h2>
            <h3 className="text-4xl md:text-6xl font-serif text-[#1A1A1A]" data-aos="fade-up" data-aos-delay="100">
              Your arrival, thoughtfully arranged
            </h3>
            <p className="text-gray-500 text-base font-light max-w-xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              Choose your route, luggage and journey details for a clear VIP transfer quote.
            </p>
            <div className="h-px w-24 bg-[#C5A059]/30 mx-auto mt-6"></div>
          </div>

          <div data-aos="zoom-in" data-aos-duration="1000">
            <VIPTransferBooking />
          </div>
        </div>
      </section>

      <section id="vip-transfer-benefits" className="py-28 bg-white border-b border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-cream rounded-3xl overflow-hidden shadow-sm border border-gold/10 p-8 md:p-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-gold font-serif italic text-xl mb-2">Why Book a VIP Transfer?</h2>
              <div className="h-px w-20 bg-gold mx-auto mb-6"></div>
              <h3 className="text-3xl sm:text-4xl font-serif font-medium text-charcoal">A calmer arrival in Istanbul</h3>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["Stay Together", "For groups, avoid splitting into two or three city taxis. Travel together from the airport to your accommodation and enjoy the journey with your family or friends from beginning to end."],
                ["A Trusted Transfer", "Book through a transfer provider recommended by your accommodation host, rather than searching for an unfamiliar driver after landing."],
                ["Meet & Greet", "Be welcomed at the airport and guided to your private driver, making the arrival process much easier after a long flight."],
                ["Start Exploring Sooner", "Relax with complimentary soft drinks in the vehicle, leave the airport behind, and arrive at your accommodation refreshed and ready to explore Istanbul."],
                ["Easier With Luggage, Children & Families", "Avoid dealing with trains, station changes, stairs, crowds and luggage on public transportation. Istanbul has an extensive rail network, but transfers between lines are common and can be inconvenient for larger groups, families, young children and travelers with multiple suitcases."],
                ["Comfort From Door to Door", "Enjoy a private, direct journey instead of navigating unfamiliar transportation immediately after arriving in Istanbul."],
                ["More Predictable Arrival", "Know your route, vehicle and estimated transfer price in advance instead of figuring everything out after landing."],
              ].map(([title, copy]) => (
                <article key={title} className="rounded-2xl border border-gold/10 bg-white p-5">
                  <h4 className="font-serif text-lg text-charcoal">{title}</h4>
                  <p className="mt-2 text-xs leading-relaxed font-light text-gray-600">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION: TRUSTED PLATFORMS --- */}
      <section id="platform-booking" className="py-24 bg-[#1A1A1A] text-white relative overflow-hidden scroll-mt-20">
        {/* Dekoratif Compass/Pusula İkonu */}
        <div className="absolute -bottom-20 -right-20 opacity-5 pointer-events-none">
          <Compass className="w-[500px] h-[500px] text-[#C5A059]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
          <div className="space-y-4" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif text-[#C5A059]">
              Prefer booking through a trusted platform?
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
              You can also find our luxury penthouse on major travel sites. While direct booking offers the best rates, we support your preference for platform-based reservations.
            </p>
          </div>

          {/* Platform Buttons */}
          <div className="flex flex-wrap justify-center gap-5" data-aos="fade-up" data-aos-delay="200">
            <a
              href="https://airbnb.com/h/historic-fatih-loft"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#FF5A5F] hover:bg-[#FF385C] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              <img
                src="/images/logos/airbnb.svg" // Eğer SVG dosyanız yoksa burayı ikonla değiştirebilirsiniz
                alt="Airbnb"
                className="w-5 h-5 brightness-0 invert"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>Find on Airbnb</span>
            </a>

            <a
              href="https://www.booking.com/hotel/tr/4-br-flat-with-terrace-and-hot-tub-in-historic-istanbul.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#003B95] hover:bg-[#002D72] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              <img
                src="/images/logos/booking.svg"
                alt="Booking.com"
                className="w-5 h-5 brightness-0 invert"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>Find on Booking.com</span>
            </a>

            <a
              href="https://www.vrbo.com/5221379"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#156B52] hover:bg-[#0F5A45] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              <img
                src="/images/logos/vrbo.svg"
                alt="VRBO"
                className="w-5 h-5 brightness-0 invert"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>Find On VRBO</span>
            </a>

            <a
              href="https://www.agoda.com/4br-apt-in-old-city-terrace-hot-tub-ac-wifi/hotel/istanbul-tr.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#D91A5B] hover:bg-[#BE124C] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              <img
                src="/images/logos/Agoda.svg"
                alt="Agoda"
                className="w-5 h-5 brightness-0 invert"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>Find on Agoda</span>
            </a>

            <a
              href="https://wa.me/905312980035"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              <span>Contact us on WhatsApp</span>
            </a>
          </div>

          <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">
            Official Partner of Global Travel Channels
          </p>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 bg-black text-gray-500 text-xs border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>
            © 2026 Luxury Family Residence Istanbul. Built exclusively with
            premium materials.
          </p>
          {/*
          <div className="flex space-x-8 uppercase tracking-widest text-[10px] font-semibold">
            <a href="#" className="hover:text-gold transition">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition">House Rules</a>
            <a href="#" className="hover:text-gold transition">Contact Support</a>
          </div>
          */}
        </div>
      </footer>
    </div>
  );
}
