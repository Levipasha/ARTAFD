import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Ticket, X, CheckCircle, Loader2 } from 'lucide-react';
import { eventsAPI, formsAPI } from '../services/api';
import SEO from './SEO';

// Form Modal Component
const EventFormModal = ({ event, onClose }) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ guestName: '', guestEmail: '', responses: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const data = await formsAPI.getEventForm(event._id);
        setForm(data.form);
        if (data.form) {
          setFormData(prev => ({
            ...prev,
            responses: data.form.fields.map(f => ({ fieldLabel: f.label, fieldType: f.type, value: '' }))
          }));
        }
      } catch (e) {
        console.error('Fetch form error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [event._id]);

  const handleResponseChange = (fieldLabel, value) => {
    setFormData(prev => ({
      ...prev,
      responses: prev.responses.map(r => r.fieldLabel === fieldLabel ? { ...r, value } : r)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    const missingFields = form.fields
      .filter(f => f.required)
      .filter(f => {
        const response = formData.responses.find(r => r.fieldLabel === f.label);
        return !response?.value?.trim();
      });

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    try {
      setSubmitting(true);
      await formsAPI.submitForm(event._id, formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600">No registration form available for this event.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Submitted!</h3>
          <p className="text-gray-600 mb-6">Thank you for registering. We will contact you soon.</p>
          <button onClick={onClose} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{form.title}</h3>
              <p className="text-sm text-gray-500">{event.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {form.description && <p className="text-gray-600 mb-4">{form.description}</p>}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Guest Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, guestEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Form Fields */}
            {form.fields.map((field) => {
              const response = formData.responses.find(r => r.fieldLabel === field.label);
              return (
                <div key={field.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={response?.value || ''}
                      onChange={(e) => handleResponseChange(field.label, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none min-h-[80px]"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={response?.value || ''}
                      onChange={(e) => handleResponseChange(field.label, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    >
                      <option value="">{field.placeholder || 'Select...'}</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={response?.value || ''}
                      onChange={(e) => handleResponseChange(field.label, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>Submit Registration</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [expandedDescIds, setExpandedDescIds] = useState(new Set());
  const toggleExpanded = (id) => {
    setExpandedDescIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };
  
  // Newsletter subscription state
  const [subEmail, setSubEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subMessage, setSubMessage] = useState({ type: '', text: '' });


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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
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
                
                <div className="mb-4">
                  <p className={`text-gray-600 text-sm whitespace-pre-line ${expandedDescIds.has(event._id) ? '' : 'line-clamp-2'}`}>
                    {event.description}
                  </p>
                  {event.description?.length > 80 && (
                    <button 
                      onClick={() => toggleExpanded(event._id)} 
                      className="text-red-600 hover:text-red-700 text-xs font-semibold mt-1 outline-none"
                    >
                      {expandedDescIds.has(event._id) ? 'View Less' : 'View More'}
                    </button>
                  )}
                </div>
                
                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Calendar size={16} className="flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(event.date?.start)}
                      {event.date?.end && formatDate(event.date?.start) !== formatDate(event.date?.end)
                        ? ` - ${formatDate(event.date?.end)}`
                        : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Clock size={16} className="flex-shrink-0" />
                    <span className="truncate">
                      {formatTime(event.date?.start)}
                      {event.date?.end ? ` - ${formatTime(event.date?.end)}` : ''}
                    </span>
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
                <div className="mt-auto pt-4 border-t flex items-center justify-between gap-4">
                  <div className="text-lg font-bold text-gray-900">
                    {priceLabel}
                  </div>

                  <button
                    onClick={() => {
                      if (event.location?.virtualLink) {
                        window.open(event.location.virtualLink, '_blank', 'noopener,noreferrer');
                      } else {
                        setSelectedEvent(event);
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Ticket size={16} />
                    Register
                  </button>
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
            <div className="text-gray-400 text-lg">
              No events found.
            </div>
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
          
          {subMessage.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${subMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {subMessage.text}
            </div>
          )}
          
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!subEmail.trim()) {
                setSubMessage({ type: 'error', text: 'Please enter your email' });
                return;
              }
              try {
                setSubscribing(true);
                setSubMessage({ type: '', text: '' });
                await formsAPI.subscribeToEvents({ email: subEmail, name: subName });
                setSubMessage({ type: 'success', text: 'Subscribed successfully! You will receive updates about art events.' });
                setSubEmail('');
                setSubName('');
              } catch (err) {
                setSubMessage({ 
                  type: 'error', 
                  text: err.response?.data?.error || 'Failed to subscribe. Please try again.' 
                });
              } finally {
                setSubscribing(false);
              }
            }}
            className="max-w-md mx-auto space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <button 
              type="submit"
              disabled={subscribing}
              className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {subscribing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Subscribing...</>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Registration Form Modal */}
      {selectedEvent && (
        <EventFormModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
    </>
  );
};

export default EventsPage;
