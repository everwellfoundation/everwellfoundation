export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    
    const name = formData.get('name') || 'Unknown';
    const email = formData.get('email') || '';
    const subject = formData.get('subject') || 'New message from Everwell Foundation website';
    const message = formData.get('message') || '';

    const emailContent = `New message received via everwellfoundation.com

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Reply directly to this email to respond to ${name}.`;

    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'hello@everwellfoundation.com', name: 'Everwell Foundation' }],
          reply_to: { email: email, name: name }
        }],
        from: { email: 'contact@everwellfoundation.com', name: 'Everwell Foundation' },
        subject: `New message — ${subject}`,
        content: [{
          type: 'text/plain',
          value: emailContent
        }]
      })
    });

    if (response.ok || response.status === 202) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      const error = await response.text();
      console.error('MailChannels error:', error);
      return new Response(JSON.stringify({ success: false, error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
