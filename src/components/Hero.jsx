import React, { useEffect, useMemo, useRef, useState } from 'react';
import { artistsAPI } from '../services/api';
import profileBg from './cropped_circle_image.png';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechMessage, setSpeechMessage] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const hasSpeech =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSpeechSupported(Boolean(hasSpeech));

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // no-op
        }
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await artistsAPI.searchArtists({ q: searchQuery.trim(), limit: 8 });
        if (!cancelled) setSuggestions(res.artists || []);
      } catch (e) {
        if (!cancelled) setSuggestions([]);
        console.error('Artist suggestions error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const t = setTimeout(run, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchQuery]);

  const hasSuggestions = useMemo(() => suggestions.length > 0, [suggestions.length]);

  const handleMicClick = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechMessage('Voice search is not supported in this browser.');
      return;
    }

    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setSpeechMessage('Voice search needs HTTPS or localhost.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechMessage('Listening... speak now');
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
        setSpeechMessage('Microphone permission denied. Please allow mic access.');
      } else if (event?.error === 'no-speech') {
        setSpeechMessage('No speech detected. Try again.');
      } else if (event?.error === 'audio-capture') {
        setSpeechMessage('No microphone detected on this device.');
      } else {
        setSpeechMessage('Voice recognition failed. Please try again.');
      }
    };
    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || '';
      const value = String(transcript).trim();
      if (value) {
        setSearchQuery(value);
        setShowSuggestions(true);
        setSpeechMessage(`Heard: "${value}"`);
      } else {
        setSpeechMessage('Could not understand. Please try again.');
      }
    };
    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
      setSpeechMessage('Could not start microphone. Try again.');
    }
  };

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Hero Heading */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-black">DISCOVER </span>
            <span className="text-red-600">ART</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto text-left">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search artists, art form, city..."
              className="w-full px-6 py-4 pr-24 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-red-600 focus:bg-white transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button
                type="button"
                className={`p-2 transition-colors ${
                  isListening ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
                } ${!speechSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
                onClick={handleMicClick}
                disabled={!speechSupported}
                title={speechSupported ? (isListening ? 'Listening...' : 'Search by voice') : 'Voice search not supported'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            {speechMessage ? (
              <div className="mt-2 px-3 text-xs text-gray-500">{speechMessage}</div>
            ) : null}

            {showSuggestions && searchQuery.trim() && (
              <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                {loading ? (
                  <div className="px-4 py-4 text-sm text-gray-500">Searching artists...</div>
                ) : !hasSuggestions ? (
                  <div className="px-4 py-4 text-sm text-gray-500">No artist suggestions found.</div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {suggestions.map((artist) => (
                      <button
                        key={artist._id}
                        className="w-full px-4 py-4 hover:bg-gray-50 transition-colors flex items-center gap-4 text-left"
                        onClick={() => {
                          setSelectedArtist(artist);
                          setShowSuggestions(false);
                        }}
                      >
                        <img
                          src={artist?.image?.url}
                          alt={artist?.image?.alt || artist?.name}
                          className="w-20 h-20 rounded-xl object-cover bg-gray-100 shadow-sm border border-gray-200 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-gray-900 text-lg leading-tight">{artist.name}</div>
                          <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mt-0.5">{artist.artForm}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {[artist.location?.city, artist.location?.state, artist.location?.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Trending Tags */}
        <div className="flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
            CANVAS
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
            NFTS
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
            MANDALAS
          </span>
        </div>
      </div>

      {selectedArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelectedArtist(null)} />
          <div className="relative bg-white w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl border border-gray-100">
            <div className="p-4 absolute top-0 right-0 z-20">
              <button
                onClick={() => setSelectedArtist(null)}
                className="px-3 py-1 rounded-lg bg-white/90 border hover:bg-white text-sm"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <div className="relative h-40">
                <div className="rounded-3xl overflow-hidden h-full">
                  <img src={profileBg} alt="profile background" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="px-3">
                <div className="-mt-10 relative z-10 flex items-end justify-between">
                  <img
                    src={selectedArtist?.image?.url}
                    alt={selectedArtist?.image?.alt || selectedArtist?.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-gray-100"
                  />
                  <div className="px-3 py-1.5 rounded-full border bg-white shadow-sm text-xs font-semibold text-gray-700">
                    {selectedArtist.artForm}
                  </div>
                </div>

                <div className="mt-3 text-left">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedArtist.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {[selectedArtist.location?.city, selectedArtist.location?.state, selectedArtist.location?.country].filter(Boolean).join(', ')}
                  </div>
                  {selectedArtist.bio ? (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">{selectedArtist.bio}</p>
                  ) : null}
                </div>

                <div className="mt-4 rounded-2xl border p-3 bg-gray-50/60">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {
                          [
                            selectedArtist.social?.instagram,
                            selectedArtist.social?.facebook,
                            selectedArtist.social?.twitter,
                            selectedArtist.social?.linkedin,
                            selectedArtist.social?.website
                          ].filter(Boolean).length
                        }
                      </div>
                      <div className="text-xs text-gray-600">Handles</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{selectedArtist.artForm ? 1 : 0}</div>
                      <div className="text-xs text-gray-600">Art Form</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{selectedArtist.location?.city ? 1 : 0}</div>
                      <div className="text-xs text-gray-600">Location</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {selectedArtist.social?.instagram ? <a href={selectedArtist.social.instagram} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Instagram</a> : null}
                  {selectedArtist.social?.facebook ? <a href={selectedArtist.social.facebook} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Facebook</a> : null}
                  {selectedArtist.social?.twitter ? <a href={selectedArtist.social.twitter} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Twitter</a> : null}
                  {selectedArtist.social?.linkedin ? <a href={selectedArtist.social.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">LinkedIn</a> : null}
                  {selectedArtist.social?.website ? <a href={selectedArtist.social.website} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Website</a> : null}
                </div>

                <button
                  className="mt-5 w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition-colors"
                  onClick={() => setSelectedArtist(null)}
                >
                  View Artist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
