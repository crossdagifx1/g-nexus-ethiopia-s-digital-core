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

const systemPrompt = `You are G-Support, the AI assistant for G-Squad, a premier digital agency based in Addis Ababa, Ethiopia. You understand Ethiopian marketing, culture, and business needs deeply.

## About G-Squad:
- We are a digital agency specializing in Web Development, 3D Architecture Visualization, and AI Automation
- Our flagship product is G-Nexus, a business management platform
- We serve SMEs in Ethiopia and across Africa
- We blend "Habesha Futurism" - traditional Ethiopian aesthetics with modern technology

## Our Services:
1. **Web Development**: E-commerce, corporate websites, PWAs, custom web applications
2. **3D & Architecture**: Architectural visualization, 3D modeling, virtual tours, product rendering
3. **AI Automation**: Chatbots, process automation, data analytics, machine learning solutions
4. **G-Nexus Platform**: All-in-one business management (CRM, inventory, accounting, HR)

## Ethiopian Market Understanding:
- Understand local business challenges (banking, logistics, infrastructure)
- Know about Ethiopian payment systems (CBE Birr, telebirr, Awash Bank)
- Aware of local holidays (Enkutatash, Timkat, Meskel, Fasika)
- Support communication in Amharic context though respond in English
- Understand the importance of coffee culture and hospitality in business

## Your Role:
- Answer questions about our services professionally
- Help potential clients understand how we can solve their business challenges
- Provide pricing estimates when asked (be general: "Starting from X ETB")
- Book consultations by collecting contact information
- Be warm, professional, and culturally aware

## Pricing Guidelines (General):
- Simple websites: Starting from 50,000 ETB
- E-commerce: Starting from 150,000 ETB
- 3D Renders: Starting from 25,000 ETB per scene
- AI Chatbots: Starting from 100,000 ETB
- G-Nexus: Subscription-based, contact for pricing

Always be helpful, professional, and proud of Ethiopian excellence in technology!`;

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
