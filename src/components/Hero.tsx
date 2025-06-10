import React from 'react';
import bcg2 from '../images/bcg2.jpg';

export const Hero: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-end justify-end overflow-hidden"
    >
      <img
        src={bcg2}
        alt="Kitchen Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative z-10 text-right p-8 md:p-16 max-w-xl w-full mb-8 md:mb-16">
        <h1 className="text-white text-5xl md:text-7xl font-light mb-4">Kitchen</h1>
        <p className="text-white text-2xl md:text-3xl font-light leading-tight">
          Designed around<br />
          what's truly important
        </p>
      </div>
    </section>
  );
};
