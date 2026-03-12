import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "919425156801"; // owner number from env usually
  const message = "Hi Achyutam Organics, I have a question about your products.";
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 active:scale-95 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-8 w-8" />
      <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-800 shadow-xl opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
        Chat with us
      </span>
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
      </span>
    </button>
  );
};

export default WhatsAppButton;
