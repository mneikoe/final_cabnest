// inside a component like App.jsx or a navbar component
import React, { useEffect, useState } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Prevent auto prompt
      setDeferredPrompt(e); // Save the event so we can trigger it later
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Show install dialog
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response to install:", outcome);

    setDeferredPrompt(null); // Reset the prompt
    setIsInstallable(false);
  };

  return (
    isInstallable && (
      <button
        onClick={handleInstallClick}
        className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
      >
        Install App
      </button>
    )
  );
};

export default InstallPWA;
