import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const VirtualGallery3D = () => {
  const museumUrl = 'https://extranl-musem.vercel.app/';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-black">
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="mt-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold"><span className="text-black">VIRTUAL </span><span className="text-red-600">3D GALLERY</span></h1>
          </div>
          <a
            href={museumUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 w-fit"
          >
            Open in new tab
            <ExternalLink size={16} />
          </a>
        </div>

        <div className="rounded-2xl border overflow-hidden bg-black">
          <iframe
            title="3D Virtual Gallery"
            src={museumUrl}
            className="w-full h-[78vh]"
          />
        </div>
      </div>
    </div>
  );
};

export default VirtualGallery3D;
