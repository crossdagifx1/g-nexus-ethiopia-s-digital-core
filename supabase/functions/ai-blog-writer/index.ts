import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const PRIMARY_MODEL = 'arcee-ai/trinity-large-preview:free';
const FALLBACK_MODEL = 'arcee-ai/trinity-mini:free';

const systemPrompt = `You are a professional blog writer for G-Squad, a digital agency specializing in web development, 3D architecture visualization, and AI automation based in Addis Ababa, Ethiopia.

Write high-quality, engaging blog posts. Return your response as valid JSON with this exact structure:
{
  "title": "Blog Post Title",
  "excerpt": "A compelling 1-2 sentence summary",
  "content": "Full blog post content in markdown format with headings, paragraphs, and formatting",
  "category": "Suggested category"
}

Guidelines:
- Write in a professional but approachable tone
- Include relevant headings (##, ###)
- Use bullet points and lists where appropriate
- Keep content between 500-1500 words depending on requested length
- Make content SEO-friendly with natural keyword usage
- Always return valid JSON only, no extra text`;

async function callOpenRouter(messages: any[], model: string) {
  return await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://g-squad.dev',
      'X-Title': 'G-Squad Blog Writer'
    },
    body: JSON.stringify({ model, messages, temperature: 0.7 }),
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, tone = 'Professional', keywords = '', length = 'medium' } = await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userPrompt = `Write a ${length} blog post about: "${topic}"
Tone: ${tone}
${keywords ? `Keywords to include naturally: ${keywords}` : ''}
Length guide: ${length === 'short' ? '400-600 words' : length === 'long' ? '1200-1800 words' : '700-1000 words'}

Return ONLY valid JSON.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    let response = await callOpenRouter(messages, PRIMARY_MODEL);
    if (!response.ok) {
      console.error('Primary model failed:', response.status);
      response = await callOpenRouter(messages, FALLBACK_MODEL);
    }

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    let blogPost;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      blogPost = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      blogPost = {
        title: topic,
        excerpt: `A blog post about ${topic}`,
        content: content,
        category: 'General'
      };
    }

    return new Response(JSON.stringify(blogPost), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in ai-blog-writer:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
