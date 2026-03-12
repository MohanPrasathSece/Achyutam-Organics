import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import farm images from assets
import farmLandscape from '../assets/hero-farm.jpg';
import gheeHero from '../assets/ghee-hero.jpg';
import bilonaProcess from '../assets/bilona-process.jpg';
import aboutProcess from '../assets/about-process.jpg';

// Farm images array
const farmImages = [
  { src: farmLandscape, alt: 'Our Beautiful Farm Landscape' },
  { src: gheeHero, alt: 'Premium Desi Cow Ghee Products' },
  { src: bilonaProcess, alt: 'Traditional Bilona Method' },
  { src: aboutProcess, alt: 'Farm Production Process' },
];

const FarmSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-change images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === farmImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? farmImages.length - 1 : currentImageIndex - 1);
  };

  const goToNext = () => {
    setCurrentImageIndex(currentImageIndex === farmImages.length - 1 ? 0 : currentImageIndex + 1);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-cormorant font-bold text-slate-800 mb-6">
              Visit Our Farm
            </h2>
            <div className="space-y-4 text-lg text-slate-600">
              <p>
                Our farm is home to healthy Gir cows that provide the pure A2 milk used in our traditional ghee making process.
              </p>
              <p>
                We maintain sustainable farming practices, ensuring our cows graze on natural grass and receive the best care possible.
              </p>
              <p>
                Every day, our skilled artisans follow the ancient Bilona method to create ghee that's rich in nutrients and flavor.
              </p>
              <p>
                From pasture to pantry, we maintain complete transparency in our production process, ensuring you get the purest ghee available.
              </p>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="aspect-[4/3] relative">
                {farmImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-slate-700" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {farmImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmSection;
