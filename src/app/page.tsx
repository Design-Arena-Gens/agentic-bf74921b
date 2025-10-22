"use client";

import { useState, useEffect } from "react";

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
}

export default function Home() {
  const [senderEmail, setSenderEmail] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderEmail, keywords }),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      setSuccess(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchEmails = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/emails");
      if (!response.ok) {
        throw new Error("Failed to fetch emails");
      }
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/config");
        if (response.ok) {
          const config = await response.json();
          setSenderEmail(config.senderEmail);
          setKeywords(config.keywords);
        }
      } catch (error) {
        console.error("No config found");
      }
    };
    fetchConfig();
    fetchEmails();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Email Agent Configuration
            </h1>
            <p className="text-center text-gray-600">
              Configure your email agent to get notified about specific emails.
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <label
                  htmlFor="senderEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sender's Email
                </label>
                <input
                  id="senderEmail"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., john.doe@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="keywords"
                  className="block text-sm font-medium text-gray-700"
                >
                  Keywords
                </label>
                <input
                  id="keywords"
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., important, urgent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Comma-separated keywords to look for in the email subject or
                  body.
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-2 mt-4 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </button>
            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}
            {success && (
              <p className="text-sm text-center text-green-500">
                Configuration saved successfully!
              </p>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Notifications
            </h1>
            <button
              onClick={fetchEmails}
              disabled={isChecking}
              className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isChecking ? "Checking..." : "Check for new emails"}
            </button>
            <div className="mt-4 space-y-4">
              {emails.length > 0 ? (
                emails.map((email) => (
                  <div
                    key={email.id}
                    className="p-4 border border-gray-200 rounded-md"
                  >
                    <p className="font-bold">{email.subject}</p>
                    <p className="text-sm text-gray-600">From: {email.from}</p>
                    <p className="mt-2 text-gray-800">{email.body}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(email.date).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No new emails.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}