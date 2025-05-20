'use client';

import Image from 'next/image';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de l'image</h1>
      
      {/* Test avec Image component */}
      <div className="mb-8">
        <h2 className="text-xl mb-2">Test avec Image component:</h2>
        <div className="relative w-[600px] h-[400px]">
          <Image
            src="/images/house.jpg"
            alt="Test image"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Test avec background-image */}
      <div className="mb-8">
        <h2 className="text-xl mb-2">Test avec background-image:</h2>
        <div 
          className="w-[600px] h-[400px] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/house.jpg')" }}
        />
      </div>

      {/* Test avec img tag */}
      <div>
        <h2 className="text-xl mb-2">Test avec img tag:</h2>
        <img 
          src="/images/house.jpg" 
          alt="Test image"
          className="w-[600px] h-[400px] object-cover"
        />
      </div>
    </div>
  );
} 