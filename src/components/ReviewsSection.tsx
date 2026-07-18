import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Plus, Check, Globe, HelpCircle, ArrowUpDown, Filter } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data';
import { Review } from '../types';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  
  // Submit new review form states
  const [author, setAuthor] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Computed values
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStars = starFilter === null ? true : r.rating === starFilter;
    return matchesSearch && matchesStars;
  });

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !text || !country) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author,
      rating,
      text,
      country,
      date: 'July 2026',
      avatar: author.split(' ').map(n => n[0]).join('').toUpperCase()
    };

    setReviews(prev => [newReview, ...prev]);
    setSubmitSuccess(true);
    setAuthor('');
    setCountry('');
    setText('');
    setRating(5);

    setTimeout(() => {
      setSubmitSuccess(false);
      setFormOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-12">
      {/* Testimonial Scorecards Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-cream/30 p-8 rounded-3xl border border-gray-100">
        {/* Total Score index (Cols 4) */}
        <div className="md:col-span-4 text-center md:text-left space-y-2">
          <span className="text-gold uppercase tracking-widest text-[10px] font-bold block">Verified Guests Scores</span>
          <h4 className="text-5xl font-serif font-bold text-charcoal">{averageRating}</h4>
          <div className="flex justify-center md:justify-start text-gold space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-medium">Based on {reviews.length} total direct stays</p>
        </div>

        {/* Breakdown bar visualizer (Cols 5) */}
        <div className="md:col-span-5 space-y-2.5">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = reviews.filter(r => r.rating === stars).length;
            const percent = ((count / reviews.length) * 100).toFixed(0);
            return (
              <button
                key={stars}
                onClick={() => setStarFilter(starFilter === stars ? null : stars)}
                className={`w-full flex items-center text-xs space-x-3 transition hover:text-gold text-left cursor-pointer ${
                  starFilter === stars ? 'font-bold text-gold' : 'text-gray-500'
                }`}
              >
                <span className="w-12 shrink-0 font-medium flex items-center">
                  {stars} Star{stars > 1 && 's'}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[10px]">{percent}%</span>
              </button>
            );
          })}
        </div>

        {/* Call to action add review (Cols 3) */}
        <div className="md:col-span-3 text-center md:text-right">
          <button
            type="button"
            onClick={() => setFormOpen(!formOpen)}
            className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-white text-xs font-bold px-6 py-3.5 rounded-full shadow-md transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Leave a Review</span>
          </button>
        </div>
      </div>

      {/* Expandable submit review form */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleAddReviewSubmit}
              className="bg-white rounded-3xl p-6 md:p-8 border border-gold/15 shadow-inner space-y-5"
            >
              <h4 className="font-serif text-lg text-charcoal font-semibold">Tell Us About Your Istanbul Stay</h4>
              
              {submitSuccess ? (
                <div className="p-4 bg-green-50 text-green-600 rounded-xl text-center flex items-center justify-center space-x-2 font-bold text-xs">
                  <Check className="w-4 h-4" />
                  <span>Thank you! Your simulated review was posted instantly below.</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        className="w-full bg-cream border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Origin Country</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. United States 🇺🇸"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full bg-cream border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Overall Rating</label>
                      <select
                        value={rating}
                        onChange={e => setRating(parseInt(e.target.value))}
                        className="w-full bg-cream border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5 Good)</option>
                        <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                        <option value={2}>⭐⭐ (2/5 Fair)</option>
                        <option value={1}>⭐ (1/5 Poor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Your Review Story</label>
                    <textarea
                      required
                      placeholder="Share your experience (views, clean service, location ease, jacuzzis...)"
                      value={text}
                      rows={4}
                      onChange={e => setText(e.target.value)}
                      className="w-full bg-cream border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="px-5 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-charcoal hover:bg-gold text-white px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                    >
                      Post Review
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Filter & List container */}
      <div className="space-y-6">
        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-gray-100">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search reviews (e.g. family, terrace...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-cream border border-gray-100 px-4 py-2.5 pl-10 rounded-full text-xs focus:outline-none focus:border-gold"
            />
            <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex space-x-3 text-xs text-gray-500 items-center">
            <span className="flex items-center"><Filter className="w-3.5 h-3.5 mr-1 text-gold" /> Filtered Stays:</span>
            <span className="font-bold text-charcoal">{filteredReviews.length}</span>
            {starFilter !== null && (
              <button
                onClick={() => setStarFilter(null)}
                className="bg-gold/10 text-gold px-2.5 py-1 rounded-full text-[10px] font-bold hover:bg-gold/20 flex items-center"
              >
                {starFilter} Stars × <Check className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Actual Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((rev, i) => (
                <motion.div
                  key={rev.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-6 border border-gray-100 rounded-2xl bg-cream/30 flex flex-col justify-between card-hover"
                >
                  <div>
                    {/* Stars bar */}
                    <div className="flex text-gold mb-3.5 space-x-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-current' : 'opacity-20'}`}
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="italic text-gray-700 text-xs leading-relaxed mb-6 font-light">
                      "{rev.text}"
                    </p>
                  </div>

                  {/* Author metadata block */}
                  <div className="flex items-center space-x-3 border-t border-gray-200/40 pt-4">
                    <div className="w-9 h-9 rounded-full bg-gold text-white flex items-center justify-center font-bold text-xs">
                      {rev.avatar}
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-charcoal">{rev.author}</h5>
                      <div className="flex items-center text-[10px] text-gray-400 mt-0.5 space-x-2">
                        <span>{rev.country}</span>
                        <span>•</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-400 text-xs">
                No reviews found matching "{searchQuery}" filter. Click star breakdown or clear search to reset.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
