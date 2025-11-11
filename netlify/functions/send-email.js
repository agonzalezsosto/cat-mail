const sgMail = require("@sendgrid/mail");

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Parse the request body
    const { email, message } = JSON.parse(event.body);

    // Validate inputs
    if (!email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email and message are required" }),
      };
    }

    // Set SendGrid API key from environment variable
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Fetch a random poem
    let poemHtml = '';
    try {
      const poemResponse = await fetch('https://poetrydb.org/random');
      const poemData = await poemResponse.json();

      if (poemData && poemData[0]) {
        const poem = poemData[0];
        const poemLines = poem.lines.join('<br>');
        poemHtml = `
          <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #4a90e2; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px;">${poem.title}</h3>
            <p style="font-style: italic; color: #666; margin-bottom: 15px;">by ${poem.author}</p>
            <div style="color: #444; line-height: 1.8; font-family: Georgia, serif;">
              ${poemLines}
            </div>
          </div>
        `;
      }
    } catch (poemError) {
      console.error('Error fetching poem:', poemError);
      // Continue without poem if fetch fails
    }

    // Configure the email
    const msg = {
      to: email, // Recipient email from the form
      from: process.env.FROM_EMAIL, // Must be verified in SendGrid
      subject: "Aren't cats the greatest?",
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p style="font-size: 16px; line-height: 1.5; color: #333;">
            ${message}
          </p>
          <img
            src="https://cataas.com/cat"
            alt="Cat"
            style="max-width: 400px; width: 100%; height: auto; border-radius: 8px; margin-top: 20px;"
          />
          ${poemHtml}
        </div>
      `,
    };

    // Send the email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to send email",
        details: error.message,
      }),
    };
  }
};
