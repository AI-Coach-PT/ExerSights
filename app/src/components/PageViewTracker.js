import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "../firebaseConfig";
import { logEvent } from "firebase/analytics";

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    logEvent(analytics, "page_view", {
      page_path: location.pathname,
      page_title: document.title,
    });
    console.log(`Logging analytics event: ${location.pathname}, ${document.title}`);
  }, [location, analytics]);

  return null;
}

export default PageViewTracker;
