import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALL_SOURCES = [
  { url: "https://scholarships365.info/", name: "Scholarships365" },
  { url: "https://scholarshipscorner.website/", name: "ScholarshipsCorner" },
  { url: "https://opportunitiescorners.info/", name: "OpportunitiesCorners" },
  { url: "https://www.scholarshipsads.com/", name: "ScholarshipsAds" },
  { url: "https://www.afterschoolafrica.com/scholarships/", name: "AfterSchoolAfrica" },
  { url: "https://scholarshiproar.com/", name: "ScholarshipRoar" },
];

const CATEGORIES = ["STEM", "Arts", "Business", "Leadership", "Sports", "Community", "Exchange", "General"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin via JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    if (!firecrawlKey) {
      return new Response(JSON.stringify({ error: "FIRECRAWL_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!lovableKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the caller is admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role client for inserts
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Parse selected sources from request body
    let selectedSourceNames: string[] | null = null;
    try {
      const body = await req.json();
      selectedSourceNames = body?.sources || null;
    } catch {
      // empty body is fine, scrape all
    }

    const SOURCES = selectedSourceNames?.length
      ? ALL_SOURCES.filter((s) => selectedSourceNames!.includes(s.name))
      : ALL_SOURCES;

    const results: { source: string; found: number; added: number; errors: string[] }[] = [];

    for (const source of SOURCES) {
      const sourceResult = { source: source.name, found: 0, added: 0, errors: [] as string[] };

      try {
        // Step 1: Scrape the website with Firecrawl
        console.log(`Scraping ${source.url}...`);
        const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: source.url,
            formats: ["markdown"],
            onlyMainContent: true,
            waitFor: 3000,
          }),
        });

        if (!scrapeResponse.ok) {
          const errText = await scrapeResponse.text();
          sourceResult.errors.push(`Scrape failed: ${scrapeResponse.status} - ${errText}`);
          results.push(sourceResult);
          continue;
        }

        const scrapeData = await scrapeResponse.json();
        const markdown = scrapeData.data?.markdown || scrapeData.markdown || "";

        if (!markdown || markdown.length < 100) {
          sourceResult.errors.push("No meaningful content scraped");
          results.push(sourceResult);
          continue;
        }

        console.log(`Scraped ${markdown.length} chars from ${source.name}`);

        // Step 2: Use AI to extract scholarship data
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content: `You are a scholarship data extraction expert. Extract scholarship listings from the provided website content. For each scholarship, extract: title, description, amount (number in USD, null if not specified), deadline (YYYY-MM-DD format, null if not specified), location (country or region), category (one of: ${CATEGORIES.join(", ")}), link (application URL), requirements, source_name. Only include real scholarships with enough information. Return valid JSON array.`,
              },
              {
                role: "user",
                content: `Extract all scholarships from this ${source.name} content. Return a JSON array of objects with keys: title, description, amount, deadline, location, category, link, requirements. Source is "${source.name}" from "${source.url}".\n\nContent:\n${markdown.slice(0, 15000)}`,
              },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "extract_scholarships",
                  description: "Extract scholarship listings from website content",
                  parameters: {
                    type: "object",
                    properties: {
                      scholarships: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            title: { type: "string", description: "Scholarship title" },
                            description: { type: "string", description: "Brief description" },
                            amount: { type: "number", description: "Award amount in USD, null if unknown" },
                            deadline: { type: "string", description: "Deadline in YYYY-MM-DD format, null if unknown" },
                            location: { type: "string", description: "Eligible location/country" },
                            category: { type: "string", enum: CATEGORIES, description: "Best matching category" },
                            link: { type: "string", description: "Application URL" },
                            requirements: { type: "string", description: "Eligibility requirements" },
                          },
                          required: ["title"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["scholarships"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "extract_scholarships" } },
          }),
        });

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          if (aiResponse.status === 429) {
            sourceResult.errors.push("AI rate limit exceeded. Try again later.");
          } else if (aiResponse.status === 402) {
            sourceResult.errors.push("AI credits exhausted. Please add credits.");
          } else {
            sourceResult.errors.push(`AI extraction failed: ${aiResponse.status} - ${errText}`);
          }
          results.push(sourceResult);
          continue;
        }

        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall) {
          sourceResult.errors.push("AI did not return structured data");
          results.push(sourceResult);
          continue;
        }

        let scholarships: any[];
        try {
          const parsed = JSON.parse(toolCall.function.arguments);
          scholarships = parsed.scholarships || [];
        } catch {
          sourceResult.errors.push("Failed to parse AI response");
          results.push(sourceResult);
          continue;
        }

        sourceResult.found = scholarships.length;
        console.log(`AI extracted ${scholarships.length} scholarships from ${source.name}`);

        // Step 3: Insert into database (skip duplicates via unique_hash)
        for (const s of scholarships) {
          if (!s.title || s.title.trim().length < 3) continue;

          try {
            const scholarshipData = {
              title: s.title.trim().slice(0, 500),
              description: s.description?.trim()?.slice(0, 5000) || null,
              amount: typeof s.amount === "number" && s.amount > 0 ? s.amount : null,
              deadline: s.deadline && /^\d{4}-\d{2}-\d{2}$/.test(s.deadline) ? s.deadline : null,
              location: s.location?.trim()?.slice(0, 100) || null,
              category: CATEGORIES.includes(s.category) ? s.category : "General",
              link: s.link?.startsWith("http") ? s.link.trim() : null,
              requirements: s.requirements?.trim()?.slice(0, 2000) || null,
              source_name: source.name,
              source_url: source.url,
            };

            // Check if scholarship already exists by title + source
            const { data: existing } = await adminClient
              .from("scholarships")
              .select("id")
              .eq("title", scholarshipData.title)
              .eq("source_name", scholarshipData.source_name)
              .maybeSingle();

            if (existing) {
              // Update existing
              await adminClient
                .from("scholarships")
                .update(scholarshipData)
                .eq("id", existing.id);
            } else {
              // Insert new
              const { error: insertErr } = await adminClient
                .from("scholarships")
                .insert(scholarshipData);

              if (insertErr) {
                sourceResult.errors.push(`Insert failed for "${s.title}": ${insertErr.message}`);
              } else {
                sourceResult.added++;
              }
            }
          } catch (e) {
            sourceResult.errors.push(`Error processing "${s.title}": ${e instanceof Error ? e.message : "Unknown"}`);
          }
        }
      } catch (e) {
        sourceResult.errors.push(`Source error: ${e instanceof Error ? e.message : "Unknown"}`);
      }

      results.push(sourceResult);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Scraper error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
