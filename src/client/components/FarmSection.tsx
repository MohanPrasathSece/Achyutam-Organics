import { useState, useEffect } from 'react';

// Import farm images from assets
import farm1 from '@/assets/farm imags/farm.png';
import farm2 from '@/assets/farm imags/farm2.png';
import cowImage from '@/assets/farm imags/cow.png';

// Farm images array
const farmImages = [
  { src: farm1, alt: 'Our Beautiful Farm Landscape' },
  { src: farm2, alt: 'Sustainable Farming Practices' },
  { src: cowImage, alt: 'Our Healthy Gir Cows' },
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

  return (
    <section className="py-12 md:py-24 bg-gradient-to-br from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-cormorant font-bold text-slate-800 mb-6">
              Visit Our Farm
            </h2>
            <div className="space-y-4 text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
              <p>
                Our farm specializes in indigenous Gir cows that provide the pure A2 milk used in our traditional ghee making process. We are proud to have only this single, exceptional breed.
              </p>
              <p>
                We maintain sustainable farming practices, ensuring our Gir cows graze on natural grass and receive the best care possible. This single-breed focus is our specialty and commitment to quality.
              </p>
              <p>
                Every day, our skilled artisans follow the ancient Bilona method to create ghee that's rich in nutrients and flavor from our indigenous Gir cows' pure A2 milk.
              </p>
              <p>
                From pasture to pantry, we maintain complete transparency in our production process, ensuring you get the purest ghee available from our specialty Gir cow farm.
              </p>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl max-w-lg mx-auto lg:max-w-none">
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
