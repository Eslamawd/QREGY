"use client";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Detect iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    // Detect if app is already installed
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Handle Android install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User choice:", outcome);
    setDeferredPrompt(null);
  };

  if (isStandalone) return null; // App is already installed

  return (
    <div className="p-4 mt-4 border rounded-2xl shadow-sm bg-white text-center">
      <h3 className="text-lg font-semibold mb-2">Install App</h3>

      {isIOS ? (
        <p className="text-sm text-gray-600">
          On iOS, tap the{" "}
          <span role="img" aria-label="share" className="mx-1">
            ⎋
          </span>
          then select <strong>Add to Home Screen</strong>{" "}
          <span role="img" aria-label="plus" className="mx-1">
            ➕
          </span>
        </p>
      ) : deferredPrompt ? (
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Add to Home Screen
        </button>
      ) : (
        <p className="text-sm text-gray-500">
          Install prompt not available yet. Try refreshing the page.
        </p>
      )}
    </div>
  );
}
