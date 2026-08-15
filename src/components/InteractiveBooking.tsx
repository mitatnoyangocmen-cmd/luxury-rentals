import React, { useState, useEffect } from 'react';
import { Calendar, Users, MessageCircle, CheckCircle2, Info, User, Mail, Phone, AlertCircle, Loader2 } from 'lucide-react';

interface TransferOption {
  id: string;
  type: 'from' | 'to';
  label: string;
  emoji: string;
  description: string;
}

const TRANSFER_OPTIONS: TransferOption[] = [
  { id: 'from_ist', type: 'from', label: 'VIP Transfer From IST', emoji: '🛬', description: 'Airport to the apt, approx 40 mins' },
  { id: 'from_saw', type: 'from', label: 'VIP Transfer From SAW', emoji: '🛬', description: 'Airport to the apt, approx 55 mins' },
  { id: 'to_ist', type: 'to', label: 'VIP Transfer To IST', emoji: '🛫', description: 'Apt to Airport, approx 40 mins' },
  { id: 'to_saw', type: 'to', label: 'VIP Transfer To SAW', emoji: '🛫', description: 'Apt to Airport, approx 55 mins' },
];

const ICAL_URLS = [
  "https://www.vrbo.com/icalendar/7bd7ed3ccfdf4af6a02077ca42590e9e.ics?nonTentative",
  "https://ical.booking.com/v1/export?t=141ee329-00b8-4043-9851-b91fb5635640",
  "https://www.airbnb.com.tr/calendar/ical/1665364785885022959.ics?t=50b2f4fbf16e44c4a1f0413b0bc814e3"
];

const InteractiveBooking: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('1');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const [dateError, setDateError] = useState('');

  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState({ num1: 0, num2: 0 });
  const [isHuman, setIsHuman] = useState(false);

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setCaptchaChallenge({
      num1: Math.floor(Math.random() * 9) + 1,
      num2: Math.floor(Math.random() * 9) + 1
    });
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    
      setIsLoadingDates(true);
      const allBusyDates: string[] = [];
      console.log(ICAL_URLS);
      for (const url of ICAL_URLS) {

        try{
        console.log("Fetching:", url);

        // Using AllOrigins proxy to bypass CORS
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        console.log(data);
        console.log(data.contents);
        const icsText = data.contents;

        // Simple Regex to find date ranges in ICS
        const eventRegex = /DTSTART;?VALUE=DATE:(\d{8})[\s\S]*?DTEND;?VALUE=DATE:(\d{8})/g;
        let match;
        while ((match = eventRegex.exec(icsText)) !== null) {
          allBusyDates.push(...getDatesInRange(match[1], match[2]));
        }
      }
      catch (error) {
        console.error("Error fetching calendar:", error);
      }
      setBookedDates([...new Set(allBusyDates)]); // Remove duplicates
      }
    
  };

  // Helper: Convert ICS date (20240725) to YYYY-MM-DD and get all days in between
  const getDatesInRange = (startStr: string, endStr: string) => {
    const dates = [];
    const start = new Date(startStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
    const end = new Date(endStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
    
    let current = new Date(start);
    while (current < end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const checkDateAvailability = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return true;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    let current = new Date(start);
    while (current < end) {
      if (bookedDates.includes(current.toISOString().split('T')[0])) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  const handleStartDateChange = (val: string) => {
    setDateError('');
    if (bookedDates.includes(val)) {
      setDateError('Selected check-in date is already booked.');
      setStartDate('');
      console.log(bookedDates);
      return;
    }
    setStartDate(val);
  };

  const handleEndDateChange = (val: string) => {
    setDateError('');
    if (!checkDateAvailability(startDate, val)) {
      setDateError('Your selected range includes already booked dates.');
      setEndDate('');
      return;
    }
    setEndDate(val);
  };

  const handleCaptchaChange = (val: string) => {
    setCaptchaAnswer(val);
    setIsHuman(parseInt(val) === captchaChallenge.num1 + captchaChallenge.num2);
  };

  const toggleService = (option: TransferOption) => {
    setSelectedServices(prev => {
      const filtered = prev.filter(id => {
        const item = TRANSFER_OPTIONS.find(o => o.id === id);
        return item?.type !== option.type;
      });
      return prev.includes(option.id) ? prev.filter(id => id !== option.id) : [...filtered, option.id];
    });
  };

  const isFormValid = firstName && lastName && email && phone && startDate && endDate && isHuman && !dateError;

  const handleBookNow = () => {
    const selectedLabels = TRANSFER_OPTIONS
      .filter(opt => selectedServices.includes(opt.id))
      .map(opt => opt.label)
      .join(', ');

    const message = `*NEW BOOKING REQUEST*%0A` +
      `--------------------------%0A` +
      `👤 *Guest:* ${firstName} ${lastName}%0A` +
      `📧 *Email:* ${email}%0A` +
      `📞 *Phone:* ${phone}%0A` +
      `--------------------------%0A` +
      `📅 *Dates:* ${startDate} to ${endDate}%0A` +
      `👥 *Guests:* ${guests}%0A` +
      `✨ *Services:* ${selectedLabels || 'Standard Stay Only'}%0A%0A` +
      `I checked availability and these dates seem open. Please confirm!`;

    window.open(`https://wa.me/905312980035?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden font-sans">
      <div className="bg-[#1A1A1A] px-8 py-6 text-white flex flex-col md:flex-row justify-between items-center border-b border-[#C5A059]/30">
        <div>
          <h3 className="text-2xl font-serif text-[#C5A059]">Book Your Luxury Stay</h3>
          <p className="text-gray-400 text-xs italic">Live Calendar Sync Active</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          {isLoadingDates ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin" /> Syncing Calendars...
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#C5A059]/10 px-4 py-2 rounded-full border border-[#C5A059]/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A059]">Direct Booking Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        <div className="flex-1 p-8 bg-gray-50/30">
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C5A059]" /> 1. Stay Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Check-in</label>
                <input 
                  type="date" 
                  min={today}
                  value={startDate}
                  className={`w-full px-4 py-3 bg-white border ${dateError ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm outline-none focus:border-[#C5A059]`} 
                  onChange={(e) => handleStartDateChange(e.target.value)} 
                />
              </div>
              <div className="relative">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Check-out</label>
                <input 
                  type="date" 
                  min={startDate || today}
                  value={endDate}
                  className={`w-full px-4 py-3 bg-white border ${dateError ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm outline-none focus:border-[#C5A059]`} 
                  onChange={(e) => handleEndDateChange(e.target.value)} 
                />
              </div>
            </div>

            {dateError && (
              <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-lg animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span>{dateError}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Total Guests</label>
              <div className="relative">
                <Users className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none appearance-none focus:border-[#C5A059]"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} Guests</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">VIP Services</label>
              <div className="grid grid-cols-1 gap-2">
                {TRANSFER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleService(option)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                      selectedServices.includes(option.id)
                        ? 'border-[#C5A059] bg-[#F9F7F2]'
                        : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{option.emoji}</span>
                      <div className="text-left">
                        <div className="text-[13px] font-bold">{option.label}</div>
                        <div className="text-[10px] text-gray-500">{option.description}</div>
                      </div>
                    </div>
                    {selectedServices.includes(option.id) && <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 bg-white">
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4 text-[#C5A059]" /> 2. Guest Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">First Name</label>
                <input 
                  placeholder="e.g. John"
                  className="w-full px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl text-sm outline-none focus:bg-white focus:border-[#C5A059]"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Last Name</label>
                <input 
                  placeholder="e.g. Doe"
                  className="w-full px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl text-sm outline-none focus:bg-white focus:border-[#C5A059]"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-300 w-4 h-4" />
                <input 
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl text-sm outline-none focus:bg-white focus:border-[#C5A059]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-gray-300 w-4 h-4" />
                <input 
                  type="tel"
                  placeholder="+1 234 567 890"
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 bg-gray-50/50 rounded-xl text-sm outline-none focus:bg-white focus:border-[#C5A059]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-[#F9F7F2] rounded-2xl flex gap-4">
              <Info className="w-6 h-6 text-[#C5A059] shrink-0" />
              <p className="text-[10px] text-gray-600 leading-relaxed italic">
                Group travelers often find <span className="text-[#C5A059] font-bold">VIP transfers</span> more cost-effective and comfortable than public transport.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verify identity</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-lg">{captchaChallenge.num1} + {captchaChallenge.num2} =</span>
                  <input 
                    type="number"
                    className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center outline-none focus:border-[#C5A059]"
                    value={captchaAnswer}
                    onChange={(e) => handleCaptchaChange(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={!isFormValid}
                onClick={handleBookNow}
                className={`w-full py-4 rounded-full font-bold text-white flex items-center justify-center space-x-3 transition-all duration-500 shadow-xl ${
                  isFormValid 
                    ? 'bg-[#25D366] hover:bg-[#128C7E] hover:scale-[1.02]' 
                    : 'bg-gray-300 cursor-not-allowed grayscale opacity-60'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="tracking-wide">{isLoadingDates ? 'Syncing...' : 'Confirm & Book via WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBooking;