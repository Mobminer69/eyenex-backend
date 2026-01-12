export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // CONTACT FORM
    if (url.pathname === "/api/contact") {
      const data = await request.json();

      await env.DB.prepare(
        `INSERT INTO contacts (name, email, phone, subject, message)
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(
          data.name,
          data.email,
          data.phone,
          data.subject,
          data.message
        )
        .run();

      return new Response(
        JSON.stringify({ success: true }),
        { headers: corsHeaders }
      );
    }

    // BOOKING FORM
    if (url.pathname === "/api/book") {
      const data = await request.json();

      await env.DB.prepare(
        `INSERT INTO bookings
         (name, email, phone, service, date, time, address, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          data.name,
          data.email,
          data.phone,
          data.service,
          data.date,
          data.time,
          data.address,
          data.message
        )
        .run();

      return new Response(
        JSON.stringify({ success: true }),
        { headers: corsHeaders }
      );
    }

    return new Response("Not Found", { status: 404 });
  },
};
