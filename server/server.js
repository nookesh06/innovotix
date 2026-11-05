import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '12kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 25, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use((req, res, next) => req.path.startsWith('/server/') ? res.sendStatus(404) : next());
app.use(express.static(path.resolve(__dirname, '..'), { dotfiles: 'deny' }));

const clean = value => String(value ?? '').trim().slice(0, 1200);
app.post('/api/enquiry', async (req, res) => {
  const name = clean(req.body.name), phone = clean(req.body.phone), email = clean(req.body.email);
  const interest = clean(req.body.interest), message = clean(req.body.message);
  if (!name || !phone || !email || !interest || req.body.consent !== true) {
    return res.status(400).json({ message: 'Please complete the required fields and consent.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+()\d\s-]{7,22}$/.test(phone)) {
    return res.status(400).json({ message: 'Please enter a valid phone number and email address.' });
  }
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_RECIPIENT_NUMBER, WHATSAPP_TEMPLATE_NAME, WHATSAPP_TEMPLATE_LANGUAGE = 'en', META_GRAPH_VERSION = 'v22.0' } = process.env;
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_RECIPIENT_NUMBER || !WHATSAPP_TEMPLATE_NAME) {
    return res.status(503).json({ message: 'The WhatsApp Business message service has not been configured yet. Please contact Innovotix by phone or email.' });
  }
  // An approved WhatsApp Business template is required for a business-initiated notification.
  // Configure its BODY with six text placeholders in this exact order.
  const parameters = [name, phone, email, interest, message || 'No additional message', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })];
  const payload = {
    messaging_product: 'whatsapp', to: WHATSAPP_RECIPIENT_NUMBER.replace(/\D/g, ''), type: 'template',
    template: { name: WHATSAPP_TEMPLATE_NAME, language: { code: WHATSAPP_TEMPLATE_LANGUAGE }, components: [{ type: 'body', parameters: parameters.map(text => ({ type: 'text', text: String(text).slice(0, 1024) })) }] }
  };
  try {
    const api = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST', headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const result = await api.json().catch(() => ({}));
    if (!api.ok) {
      console.error('WhatsApp API rejected enquiry:', JSON.stringify(result.error || result).slice(0, 1500));
      return res.status(502).json({ message: 'WhatsApp could not accept the enquiry. Please call Innovotix directly.' });
    }
    return res.status(200).json({ ok: true, messageId: result.messages?.[0]?.id || null });
  } catch (error) {
    console.error('WhatsApp send failed:', error.message);
    return res.status(502).json({ message: 'The message service is temporarily unavailable. Please call Innovotix directly.' });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Innovotix website running at http://localhost:${port}`));
