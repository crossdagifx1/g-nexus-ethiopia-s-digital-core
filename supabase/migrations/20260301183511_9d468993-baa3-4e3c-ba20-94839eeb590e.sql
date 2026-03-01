
-- Allow admins to delete chat conversations
CREATE POLICY "Admins can delete conversations"
ON public.chat_conversations
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete chat messages
CREATE POLICY "Admins can delete messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update chat messages (for marking read)
CREATE POLICY "Admins can update messages"
ON public.chat_messages
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
