"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useElection } from '@/contexts/election-context';
import { useBackButtonStore } from '@/stores/back-button-store';

const SurveyPage = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const { election } = useElection();
  const { setBackPath } = useBackButtonStore();

  useEffect(() => {
      if (election?.id) {
        setBackPath(`/elections/${election?.id}`);
      } else {
        setBackPath("/");
      }
    }, [election?.id, setBackPath]);
  

    if (!election) {
      return null;
    }
  
  
  // Replace with your actual survey URL
  const surveyUrl = "https://ivv7edulime.uni-muenster.de/index.php/551219";

  if (!showSurvey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Optional Survey</h1>
          <p className="text-muted-foreground max-w-md">
            Help us improve by taking a quick survey. Your feedback is valuable to us.
          </p>
          <Button onClick={() => setShowSurvey(true)}>
            Take Survey
          </Button>
          <div>
            <Button variant="ghost" size="sm">
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-lg font-medium">Survey</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSurvey(false)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close survey</span>
        </Button>
      </div>

      {/* Fullscreen Iframe */}
      <div className="flex-1">
        <iframe
          src={surveyUrl}
          className="w-full h-full border-0"
          title="Survey"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default SurveyPage;
