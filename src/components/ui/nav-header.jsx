"use client"; 

import React, { useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const location = useLocation();

  const navItems = useMemo(() => [
    { to: '/art', label: 'Art' },
    { to: '/', label: 'Artists' },
    { to: '/events', label: 'Events' },
    { to: '/nft', label: 'NFT' },
    { to: '/virtual-gallery', label: 'Virtual Gallery' }
  ], []);

  // Set initial position for active link
  React.useEffect(() => {
    const activeItem = navItems.find(item => location.pathname === item.to);
    if (activeItem) {
      // Find the active tab element and set its position
      const activeTab = document.querySelector(`[href="${activeItem.to}"]`);
      if (activeTab) {
        const tabLi = activeTab.closest('li');
        if (tabLi) {
          const { width } = tabLi.getBoundingClientRect();
          setPosition({
            width,
            opacity: 1,
            left: tabLi.offsetLeft,
          });
        }
      }
    }
  }, [location.pathname, navItems]);

  return (
    <ul
      className="relative mx-auto flex flex-nowrap items-center rounded-full border border-gray-200 bg-white/90 backdrop-blur-md p-1.5 shadow-lg overflow-hidden"
      onMouseLeave={() => {
        const activeItem = navItems.find(item => location.pathname === item.to);
        if (activeItem) {
          const activeTab = document.querySelector(`[href="${activeItem.to}"]`);
          if (activeTab) {
            const tabLi = activeTab.closest('li');
            if (tabLi) {
              const { width } = tabLi.getBoundingClientRect();
              setPosition({ width, opacity: 1, left: tabLi.offsetLeft });
            }
          }
        } else {
          setPosition((pv) => ({ ...pv, opacity: 0 }));
        }
      }}
    >
      {navItems.map((item) => (
        <Tab 
          key={item.to}
          setPosition={setPosition}
          to={item.to}
          isActive={location.pathname === item.to}
        >
          {item.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  to,
  isActive,
}) => {
  const ref = useRef(null);
  
  // Update position when tab becomes active
  React.useEffect(() => {
    if (isActive && ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setPosition({
        width,
        opacity: 1,
        left: ref.current.offsetLeft,
      });
    }
  }, [isActive, setPosition]);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs font-medium uppercase transition-all duration-200 whitespace-nowrap md:px-4 md:py-2 md:text-sm"
    >
      <Link 
        to={to}
        className={`relative z-20 block ${isActive ? 'text-white font-semibold' : 'text-gray-700 hover:text-gray-900'}`}
      >
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="absolute z-0 top-1.5 bottom-1.5 rounded-full bg-brand"
    />
  );
};

export default NavHeader;
