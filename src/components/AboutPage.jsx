import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Globe, Award, Heart, Zap, ChevronRight, Calendar } from 'lucide-react';
import dscf9962 from './dscf9962-dJobNl5GE4tzKV9B.jpg';
import logoCircle from './aa logos_20250926_144624_0000.png';
import { artistsAPI, galleryAPI } from '../services/api';
import './team-cards.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  const [preview, setPreview] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const stats = [
    { number: "10,000+", label: "Artists" },
    { number: "50,000+", label: "Artworks" },
    { number: "100+", label: "Cities" },
    { number: "1M+", label: "Art Lovers" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Art",
      description: "We believe in the transformative power of art and its ability to inspire, connect, and enrich lives."
    },
    {
      icon: Users,
      title: "Artist First",
      description: "We prioritize artists' success, providing them with tools, exposure, and fair compensation for their creativity."
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Building a worldwide network of artists, collectors, and art enthusiasts united by their love for creativity."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to maintaining the highest standards in art curation, user experience, and service quality."
    }
  ];

  const milestones = [
    { year: "2020", title: "ArtArtist Founded", description: "Started with a vision to democratize art access" },
    { year: "2021", title: "1,000 Artists", description: "Reached our first major milestone" },
    { year: "2022", title: "NFT Launch", description: "Pioneered digital art marketplace" },
    { year: "2023", title: "Global Expansion", description: "Expanded to 50+ countries" },
    { year: "2024", title: "Artist Hub", description: "Launched comprehensive artist support program" }
  ];

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setGalleryLoading(true);
        const res = await galleryAPI.getGallery({ limit: 60 });
        if (!cancelled) setGalleryItems(res.items || []);
      } catch (e) {
        console.error('About gallery error:', e);
        if (!cancelled) setGalleryItems([]);
      } finally {
        if (!cancelled) setGalleryLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchTeam = async () => {
      try {
        const res = await artistsAPI.getTeamArtists({ limit: 12 });
        const team = res.artists || [];
        if (team.length) {
          if (!cancelled) setTeamMembers(team);
          return;
        }
        // Fallback: show active artists so admin changes are visible even if team flag wasn't set.
        const allArtists = await artistsAPI.searchArtists({ limit: 12 });
        if (!cancelled) setTeamMembers(allArtists.artists || []);
      } catch (e) {
        console.error('About team fetch error:', e);
        if (!cancelled) setTeamMembers([]);
      }
    };
    fetchTeam();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasGallery = useMemo(() => galleryItems.length > 0, [galleryItems.length]);

  const renderGalleryGrid = (items, emptyText) => {
    if (!items.length) {
      return <div className="text-center text-gray-500">{emptyText}</div>;
    }

    const cardLayouts = [
      'col-span-12 sm:col-span-6 lg:col-span-8 row-span-2',
      'col-span-12 sm:col-span-6 lg:col-span-4 row-span-1',
      'col-span-12 sm:col-span-6 lg:col-span-4 row-span-1',
      'col-span-12 sm:col-span-6 lg:col-span-4 row-span-2',
      'col-span-12 sm:col-span-6 lg:col-span-8 row-span-1',
      'col-span-12 sm:col-span-6 lg:col-span-4 row-span-1'
    ];

    return (
      <div className="grid grid-cols-12 auto-rows-[140px] md:auto-rows-[160px] gap-4">
        {items.map((item, index) => (
          <button
            key={item._id}
            onClick={() => setPreview(item)}
            className={`group relative text-left rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 hover:shadow-xl transition-all duration-300 ${cardLayouts[index % cardLayouts.length]}`}
            title={item.name}
          >
            <div className="absolute inset-0 bg-gray-100 overflow-hidden">
              {item.image?.url ? (
                <img
                  src={item.image.url}
                  alt={item.image?.alt || item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              ) : null}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
              <div className="text-white text-base md:text-lg font-semibold line-clamp-1">
                {item.name}
              </div>
              <div className="text-white/85 text-xs md:text-sm mt-1 line-clamp-2">
                {item.bio || item.image?.alt || 'Click to preview artwork'}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative py-32 px-4">
        <div className="absolute inset-0">
          <img 
            src={dscf9962} 
            alt="Art Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              We are one by blood,<br />
              Blood group is <span className="text-red-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Art+</span>.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Join us to celebrate creativity and connect with fellow artists in our vibrant community.
            </p>
            <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-lg">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ArtArtist Story Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            About <span className="text-red-600">ArtArtist</span>
          </h2>
          <div className="text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              ArtArtist was founded by an artist who deeply understood the challenges creatives face in getting visibility and building real connections. It was started with a simple yet powerful vision — to create a vibrant community where artists across India can showcase their work, collaborate, learn, and grow together. At ArtArtist, we host regular meetups, art markets, exhibitions, and discussions, providing a platform for artists of all ages to express themselves, network, and find new opportunities. It's a space where creativity meets community, and every artist finds their voice.
            </p>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Inspiring community of artists.
            </h2>
            <p className="text-xl text-gray-600">
              Creative Community
            </p>
            <p className="text-lg text-gray-700 mt-4 max-w-3xl mx-auto">
              Join a vibrant community where artists connect, share, and grow through creativity and collaboration.
            </p>
          </div>

          {/* Meetups Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Calendar className="text-red-600" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Meetups</h3>
                <p className="text-gray-600">Regular gatherings to connect and create together</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">Monthly</div>
                <p className="text-gray-700">Artist meetups in major cities</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
                <p className="text-gray-700">Cities with active communities</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">1000+</div>
                <p className="text-gray-700">Artists connected monthly</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg text-gray-700 mb-6">
                Discover and connect with talented artists in our creative and supportive network community.
              </p>
              <button 
                onClick={() => navigate('/events')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                View Upcoming Meetups
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Our <span className="text-red-600">Values</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                    <value.icon className="text-red-600" size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Our <span className="text-red-600">Journey</span>
          </h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
                {index < milestones.length - 1 && (
                  <ChevronRight className="text-red-400" size={24} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Meet Our <span className="text-red-600">Team</span>
          </h2>
          <div className="team-members-grid grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
            {teamMembers.map((member, index) => (
              <article key={member._id || index} className="card">
                <section
                  className="card__hero"
                  style={{
                    backgroundImage: `url("${member.image?.url || member.image || ''}")`
                  }}
                >
                  <div className="card__hero-overlay" />
                  <header className="card__hero-header">
                    <span>{member.teamRole || member.role || member.artForm || 'Team Member'}</span>
                    <div className="card__icon">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <Zap className="text-white" size={14} />
                      </div>
                    </div>
                  </header>
                  <p className="card__job-title">{member.name}</p>
                </section>

                <footer className="card__footer">
                  <div className="card__job-summary">
                    <div className="card__job-icon">
                      <img
                        src={logoCircle}
                        alt="ArtArtist logo"
                        className="w-16 h-16 rounded-full object-cover border border-gray-200"
                      />
                    </div>
                    <div className="card__job">
                      <p className="card__job-title">
                        {member.teamRole || member.role || member.artForm || 'Team Member'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {member.bio || member.description || 'No bio added yet.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/artist/${member._id}`)}
                    className="card__btn"
                  >
                    View
                  </button>
                </footer>
              </article>
            ))}
          </div>
          {!teamMembers.length ? (
            <div className="text-center text-gray-500 mt-6">No team members yet. Add from Admin Artists.</div>
          ) : null}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gallery <span className="text-red-600">Preview</span>
            </h2>
            <p className="text-lg text-gray-600">
              Post images + names from Admin to show here.
            </p>
          </div>

          {galleryLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : !hasGallery ? (
            <div className="text-center text-gray-500">
              No gallery items yet.
            </div>
          ) : renderGalleryGrid(galleryItems, 'No gallery items yet.')}
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPreview(null)} />
          <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-4 md:p-5 border-b flex items-center justify-between">
              <div className="font-semibold text-gray-900 truncate pr-4 text-lg">{preview.name}</div>
              <button
                onClick={() => setPreview(null)}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50 text-sm"
              >
                Close
              </button>
            </div>
            <div className="bg-black max-h-[72vh] overflow-auto">
              <img
                src={preview.image?.url}
                alt={preview.image?.alt || preview.name}
                className="w-full max-h-[72vh] object-contain"
              />
            </div>
            <div className="p-4 md:p-5 bg-white">
              <p className="text-gray-800 mt-2 leading-relaxed">
                {preview.bio || preview.image?.alt || preview.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our <span className="text-red-600">Creative Community</span>
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Whether you're an artist, collector, or art enthusiast, there's a place for you at ArtArtist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/artist-hub')}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Join as Artist
            </button>
            <button 
              onClick={() => navigate('/events')}
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
