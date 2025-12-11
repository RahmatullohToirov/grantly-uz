import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
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
