"use client";

import React, { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { API_URL } from "../config";

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveAnnouncement();
  }, []);

  const fetchActiveAnnouncement = async () => {
    try {
      const response = await fetch(`${API_URL}/api/announcements/active`);
      const data = await response.json();
      if (data.success && data.data) {
        setAnnouncement(data.data);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // Store in session storage so it stays closed for this session
    sessionStorage.setItem("announcement_closed", "true");
  };

  // Check if user previously closed this session
  useEffect(() => {
    const isClosed = sessionStorage.getItem("announcement_closed");
    if (isClosed) {
      setIsVisible(false);
    }
  }, []);

  if (loading || !announcement || !isVisible || !announcement.isActive) {
    return null;
  }

  const {
    badge,
    message,
    link,
    backgroundColor = "gray",
    textColor = "gray-800",
    badgeColor = "white",
    badgeTextColor = "gray-800"
  } = announcement;

  // Build dynamic Tailwind classes
  const bgClass = backgroundColor.startsWith("#") 
    ? { backgroundColor }
    : {};
  const textClass = textColor.startsWith("#")
    ? { color: textColor }
    : {};
  const badgeBgClass = badgeColor.startsWith("#")
    ? { backgroundColor: badgeColor }
    : {};
  const badgeTextClass = badgeTextColor.startsWith("#")
    ? { color: badgeTextColor }
    : {};

  const bgColorClass = !backgroundColor.startsWith("#") 
    ? `bg-${backgroundColor}-500/10 border-${backgroundColor}-500/30` 
    : "";
  const textColorClass = !textColor.startsWith("#") 
    ? `text-${textColor}` 
    : "";
  const badgeBgColorClass = !badgeColor.startsWith("#") 
    ? `bg-${badgeColor} border-${backgroundColor}-500/30` 
    : "bg-white border-gray-500/30";
  const badgeTextColorClass = !badgeTextColor.startsWith("#") 
    ? `text-${badgeTextColor}` 
    : "text-gray-800";

  const content = (
    <div 
      className={`flex items-center space-x-2.5 border rounded-full px-1 py-1 text-sm ${bgColorClass} ${textColorClass}`}
      style={bgClass}
    >
      <div 
        className={`border rounded-2xl px-3 py-1 ${badgeBgColorClass}`}
        style={badgeBgClass}
      >
        <p className={`text-xs font-semibold ${badgeTextColorClass}`} style={badgeTextClass}>
          {badge || "New"}
        </p>
      </div>
      <p className={`pr-2 text-sm ${textColorClass}`} style={textClass}>
        {message}
      </p>
    </div>
  );

  return (
    <div className="w-full bg-gray-900 py-2 px-4 flex items-center justify-center relative">
      <div className="flex items-center justify-center">
        {link ? (
          <a 
            href={link} 
            className="hover:opacity-90 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
      
      <button
        onClick={handleClose}
        className="absolute right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        aria-label="Close announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
