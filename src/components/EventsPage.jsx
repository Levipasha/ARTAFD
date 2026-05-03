import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Ticket, Star } from 'lucide-react';
import { eventsAPI } from '../services/api';
import SEO from './SEO';

const EventsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);


  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await eventsAPI.getEvents({ page: 1, limit: 50 });
        if (!cancelled) setEvents(res.events || []);
      } catch (e) {
        if (!cancelled) setEvents([]);
        console.error('EventsPage fetch error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents = events;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <SEO 
        title="Art Events & Exhibitions"
        description="Stay updated with art exhibitions, workshops, and cultural events. Register for upcoming art events and exhibitions near you."
        keywords="art events, art exhibitions, art workshops, cultural events, art shows"
        canonical="https://artartist.com/events"
      />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Art <span className="text-red-600">Events</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover exhibitions, workshops, and networking opportunities in your area. 
              Connect with artists and grow your creative journey.
            </p>
          </div>
        </div>
      </div>

      {/* Events Count */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="text-gray-600 font-medium text-sm md:text-base">
            {filteredEvents.length} events found
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const imageUrl = event?.images?.[0]?.url;
              const priceLabel =
                event?.pricing?.type === 'free'
                  ? 'Free'
                  : `₹${Number(event?.pricing?.amount || 0).toLocaleString()}`;

              return (
                <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full">
              {/* Event Image */}
              <div className="relative">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                {event.featured && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    FEATURED
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                  {event.category.toUpperCase()}
                </div>
              </div>
              
              {/* Event Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Calendar size={16} className="flex-shrink-0" />
                    <span className="truncate">{formatDate(event.date?.start)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Clock size={16} className="flex-shrink-0" />
                    <span className="truncate">{formatTime(event.date?.start)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="truncate">
                      {event.location?.type === 'virtual'
                        ? (event.location?.platform || 'Virtual')
                        : (event.location?.city || event.location?.address || 'Location')}
                    </span>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="mt-auto pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Users size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">{event.capacity?.current || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">—</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-red-600 sm:hidden">{priceLabel}</div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="hidden sm:block text-lg font-bold text-red-600">{priceLabel}</div>
                    <button className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <Ticket size={16} />
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
              );
            })}
          </div>
        )}

        {/* No Events Found */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              No events found in this category.
            </div>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              View All Events
            </button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with <span className="text-red-600">Art Events</span>
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get notified about upcoming exhibitions, workshops, and artist meetups in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EventsPage;
