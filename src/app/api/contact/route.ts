import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
  fullName: string;
  email: string;
  company?: string;
  teamSize?: string;
  interestedPlan?: string;
  timeline?: string;
  message: string;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ContactPayload | null;

    if (!payload) {
      return NextResponse.json(
        { error: "Request body is required." },
        { status: 400 }
      );
    }

    const { fullName, email, message } = payload;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required." },
        { status: 400 }
      );
    }

    const backendEndpoint = process.env.CONTACT_API_ENDPOINT;
    const backendApiKey = process.env.CONTACT_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const salesTeamRecipients = process.env.SALES_TEAM_EMAIL;
    const salesFromAddress =
      process.env.SALES_FROM_EMAIL || "CloudCrew Sales <sales@cloudcrew.academy>";

    if (backendEndpoint) {
      const apiResponse = await fetch(backendEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(backendApiKey ? { "x-api-key": backendApiKey } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!apiResponse.ok) {
        const data = await apiResponse.json().catch(() => ({}));
        throw new Error(
          data.error ||
            `Backend contact endpoint failed with status ${apiResponse.status}`
        );
      }
    } else if (resendApiKey && salesTeamRecipients) {
      const html = `
        <h2>New CloudCrew Sales Inquiry</h2>
        <p><strong>Name:</strong> ${fullName || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${payload.company ? `<p><strong>Company:</strong> ${payload.company}</p>` : ""}
        ${payload.teamSize ? `<p><strong>Team Size:</strong> ${payload.teamSize}</p>` : ""}
        ${payload.interestedPlan ? `<p><strong>Interested Plan:</strong> ${payload.interestedPlan}</p>` : ""}
        ${payload.timeline ? `<p><strong>Timeline:</strong> ${payload.timeline}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br/>")}</p>
      `;

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: salesFromAddress,
          to: salesTeamRecipients.split(",").map((recipient) => recipient.trim()),
          subject: "New CloudCrew Sales Inquiry",
          html,
          reply_to: email,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || `Email provider error (HTTP ${response.status})`
        );
      }
    } else {
      console.warn(
        "Contact API received submission but no delivery method is configured."
      );
      throw new Error(
        "Contact delivery is not configured. Set CONTACT_API_ENDPOINT or RESEND_API_KEY."
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact route error:", error);
    return NextResponse.json(
      { error: "Unable to process your request right now." },
      { status: 500 }
    );
  }
}
