import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const systemPrompt = `You are G-Support, the AI assistant for G-Squad, a premier digital agency in Addis Ababa, Ethiopia.

RESPONSE STYLE:
- Keep responses SHORT (2-3 sentences max)
- Be warm, professional, and persuasive
- Always guide users toward booking a consultation or requesting a quote
- End with a clear call-to-action

ABOUT G-SQUAD:
- Web Development, 3D Architecture Visualization, AI Automation
- Flagship product: G-Nexus (all-in-one business management platform)
- We blend Ethiopian excellence with cutting-edge technology

SERVICES & STARTING PRICES:
- Websites: From 50,000 ETB
- E-commerce: From 150,000 ETB  
- 3D Renders: From 25,000 ETB/scene
- AI Chatbots: From 100,000 ETB
- G-Nexus: Custom pricing

SALES APPROACH:
- Highlight how we solve their specific problem
- Emphasize our Ethiopian market expertise
- Create urgency: "Let's schedule a free consultation today!"
- Always offer: "Shall I connect you with our team for a personalized quote?"

Contact: hello@g-squad.dev | Book a free consultation!`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, conversationId } = await req.json();

    if (!message) {
      throw new Error('No message provided');
    }

    console.log('Received message:', message, 'Session:', sessionId);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({ session_id: sessionId })
        .select()
        .single();
      
      if (convError) {
        console.error('Error creating conversation:', convError);
      } else {
        convId = newConv.id;
      }
    }

    // Save user message
    if (convId) {
      await supabase.from('chat_messages').insert({
        conversation_id: convId,
        role: 'user',
        content: message
      });
    }

    // Get conversation history
    let messages = [{ role: 'system', content: systemPrompt }];
    
    if (convId) {
      const { data: history } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
        .limit(20);
      
      if (history) {
        messages = [
          { role: 'system', content: systemPrompt },
          ...history.map(m => ({ role: m.role, content: m.content }))
        ];
      }
    } else {
      messages.push({ role: 'user', content: message });
    }

    // Call OpenRouter API with Gemini (with retry for rate limits)
    let response;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://g-squad.dev',
          'X-Title': 'G-Squad Support'
        },
        body: JSON.stringify({
          model: 'xiaomi/mimo-v2-flash:free',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (response.status === 429 && retryCount < maxRetries) {
        console.log(`Rate limited, retrying in ${(retryCount + 1) * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
        retryCount++;
        continue;
      }
      break;
    }

    if (!response!.ok) {
      const errorText = await response!.text();
      console.error('OpenRouter API error:', errorText);
      
      // If still rate limited after retries, return friendly message
      if (response!.status === 429) {
        return new Response(
          JSON.stringify({ 
            response: "I'm experiencing high demand right now. Please wait a moment and try again, or contact us at hello@g-squad.dev for immediate assistance.",
            conversationId: convId 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`OpenRouter API error: ${response!.status}`);
    }

    const data = await response!.json();
    const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    console.log('AI Response:', assistantMessage.substring(0, 100));

    // Save assistant message
    if (convId) {
      await supabase.from('chat_messages').insert({
        conversation_id: convId,
        role: 'assistant',
        content: assistantMessage
      });
    }

    return new Response(
      JSON.stringify({ 
        response: assistantMessage,
        conversationId: convId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in ai-chat function:', errorMessage);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        response: "I apologize, but I'm having trouble connecting right now. Please try again or contact us directly at hello@g-squad.dev"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
