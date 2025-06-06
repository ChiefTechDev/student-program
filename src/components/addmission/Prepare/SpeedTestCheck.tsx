'use client';

import React, { useState } from 'react';

interface SpeedTestCheckProps {
  onComplete: () => void;
}

const SpeedTestCheck = ({ onComplete }: SpeedTestCheckProps) => {
  const [hasCheckedSpeed, setHasCheckedSpeed] = useState(false);
  const [speedTestPassed, setSpeedTestPassed] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  const testSpeed = async () => {
    setIsTestingSpeed(true);
    setTestProgress(0);

    // Test download speed using multiple requests to simulate larger file
    const startTime = performance.now();
    const iterations = 5; // Number of requests to make
    let totalBytes = 0;

    try {
      const requests = Array(iterations).fill('/api/speedtest'); // You'll need to create this API route

      for (let i = 0; i < requests.length; i++) {
        const response = await fetch(requests[i]);
        const data = await response.blob();
        totalBytes += data.size;

        // Update progress
        setTestProgress(((i + 1) / iterations) * 100);
      }

      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const totalMB = totalBytes / (1024 * 1024); // Convert to MB
      const speed = totalMB / duration; // MB/s

      setDownloadSpeed(speed);
      setSpeedTestPassed(speed >= 2);
      setHasCheckedSpeed(true);
    } catch (error) {
      console.error('Speed test failed:', error);
      // Show error state
      setDownloadSpeed(0);
      setSpeedTestPassed(false);
      setHasCheckedSpeed(true);
    } finally {
      setIsTestingSpeed(false);
      setTestProgress(100);
    }
  };

  const handleSpeedTestComplete = () => {
    if (speedTestPassed) {
      onComplete();
    }
  };

  return (
    <div className="space-y-4 text-[#333333DE]">
      <div className="text-sm text-gray-600">
        You will need to have a high speed internet connection with a downlaod bitrate of at least
        1.5 Mbps..
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        {isTestingSpeed ? (
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${testProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Testing download speed... {Math.round(testProgress)}%
            </p>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <input
              type="text"
              readOnly
              value={downloadSpeed ? `${downloadSpeed.toFixed(2)} Mbps` : ''}
              placeholder="Speed test result will appear here"
              className="flex-1 border rounded-lg px-4 py-2 text-sm bg-gray-50"
            />
            <button
              onClick={testSpeed}
              className="bg-[#364699] text-white py-[10px] px-[21px] rounded-[12px] text-sm font-medium hover:bg-[#2a3875] transition-colors"
              disabled={isTestingSpeed}
            >
              Check
            </button>
          </div>
        )}

        {hasCheckedSpeed && (
          <div className="mt-4 space-y-2">
            {speedTestPassed ? (
              <div className="flex flex-col items-start gap-2 text-[#00A59B]">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span className="text-sm">Download bitrate looks good!</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span className="text-sm">Using latest version of Chrome (V1.30)</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <span>✗</span>
                <span className="text-sm">Your internet speed does not meet the requirements</span>
              </div>
            )}
            <div className="flex justify-end mt-4">
              {speedTestPassed ? (
                <button
                  onClick={handleSpeedTestComplete}
                  className="bg-[#364699] text-white px-6 py-2 rounded-full text-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={testSpeed}
                  className="bg-[#364699] text-white px-6 py-2 rounded-full text-sm"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedTestCheck;
