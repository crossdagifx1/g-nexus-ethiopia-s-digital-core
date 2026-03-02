-- Update admin settings with G-Nexus branding
UPDATE public.admin_settings
SET value = jsonb_set(
    value,
    '{greeting_message}',
    '"Hi! I am Tsion, your AI assistant from G-Nexus. How can I help you today?"'
)
WHERE key = 'chat_settings';

UPDATE public.admin_settings
SET value = jsonb_set(
    value,
    '{name}',
    '"G-Nexus"'
)
WHERE key = 'company_settings';
