import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation constants
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 10000;
const VALID_ROLES = ["user", "assistant", "system"];
const VALID_TYPES = ["application-adviser", "essay-analyzer", "essay-builder"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages, type } = body;

    // Validate messages array
    if (!Array.isArray(messages)) {
      console.error("Invalid messages format: not an array");
      return new Response(
        JSON.stringify({ error: "Invalid messages format: messages must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (messages.length === 0) {
      console.error("Empty messages array");
      return new Response(
        JSON.stringify({ error: "Messages array cannot be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      console.error(`Too many messages: ${messages.length} > ${MAX_MESSAGES}`);
      return new Response(
        JSON.stringify({ error: `Too many messages. Maximum allowed: ${MAX_MESSAGES}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each message
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      
      if (!msg || typeof msg !== "object") {
        console.error(`Invalid message at index ${i}: not an object`);
        return new Response(
          JSON.stringify({ error: `Invalid message format at index ${i}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!msg.role || !VALID_ROLES.includes(msg.role)) {
        console.error(`Invalid role at index ${i}: ${msg.role}`);
        return new Response(
          JSON.stringify({ error: `Invalid message role at index ${i}. Valid roles: ${VALID_ROLES.join(", ")}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (typeof msg.content !== "string") {
        console.error(`Invalid content type at index ${i}: ${typeof msg.content}`);
        return new Response(
          JSON.stringify({ error: `Message content must be a string at index ${i}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        console.error(`Message too long at index ${i}: ${msg.content.length} > ${MAX_MESSAGE_LENGTH}`);
        return new Response(
          JSON.stringify({ error: `Message at index ${i} exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate type if provided
    if (type && !VALID_TYPES.includes(type)) {
      console.error(`Invalid type: ${type}`);
      return new Response(
        JSON.stringify({ error: `Invalid type. Valid types: ${VALID_TYPES.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "You are a helpful AI assistant.";
    
    if (type === "application-adviser") {
      systemPrompt = `You are Grantly AI, an expert scholarship application adviser. You help students with:
- Finding scholarships that match their profile
- Writing compelling essays and personal statements
- Preparing for scholarship interviews
- Understanding application requirements
- Creating timelines and strategies for applications
- Providing feedback on application materials

Be friendly, encouraging, and provide actionable advice. Use examples when helpful. If asked about specific scholarships, provide general guidance about what to look for.`;
    } else if (type === "essay-analyzer") {
      systemPrompt = `You are an expert essay analyzer specializing in scholarship and college admission essays. Analyze the provided essay and give detailed feedback on:
1. **Strengths**: What works well in the essay
2. **Areas for Improvement**: Specific suggestions for enhancement
3. **Structure & Flow**: How well the essay is organized
4. **Voice & Authenticity**: How genuine and compelling the writing is
5. **Impact & Clarity**: How effectively the message comes across
6. **Grammar & Style**: Technical writing quality

Provide a score out of 100 and actionable recommendations.`;
    } else if (type === "essay-builder") {
      systemPrompt = `You are an expert essay writing assistant specializing in scholarship essays. Help students:
- Brainstorm essay topics and angles
- Create compelling outlines
- Write drafts with strong openings and conclusions
- Refine and polish their writing
- Ensure essays answer the prompt effectively

Be encouraging and help bring out the student's unique voice and experiences.`;
    }

    console.log(`Processing AI chat request with type: ${type || 'default'}, messages: ${messages.length}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
