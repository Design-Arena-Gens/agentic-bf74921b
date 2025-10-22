import { NextResponse } from "next/server";

export async function GET() {
  // This is a mock implementation.
  // In the future, this will fetch emails from the Gmail API.
  const mockEmails = [
    {
      id: "1",
      from: "jane.doe@example.com",
      subject: "Re: Project Update",
      body: "Just wanted to follow up on the project update. Let me know if you have any questions.",
      date: "2025-10-22T10:00:00Z",
    },
    {
      id: "2",
      from: "john.doe@example.com",
      subject: "Important: Meeting Reminder",
      body: "This is a reminder for our meeting tomorrow at 10 AM. Please be prepared to discuss the quarterly report.",
      date: "2025-10-22T09:00:00Z",
    },
  ];

  return NextResponse.json(mockEmails);
}
