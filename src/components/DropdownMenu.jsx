import React, { useState, useRef, useEffect } from "react";

export default function DropdownMenu({ trigger, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white border border-gray-100 ring-1 ring-black ring-opacity-5 z-50 animate-fade-in origin-top-right">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {React.Children.map(children, child => 
              React.cloneElement(child, {
                onClick: (e) => {
                  if(child.props.onClick) child.props.onClick(e);
                  setIsOpen(false);
                }
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick} 
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 cursor-pointer transition-colors ${className}`}
    >
      {children}
    </div>
  );
}
