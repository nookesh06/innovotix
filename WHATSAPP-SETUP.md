# Innovotix — WhatsApp enquiry notifications

## Where you receive enquiries

After the WhatsApp Business Cloud API is configured and the website is deployed, a new enquiry will arrive as a WhatsApp message in the WhatsApp account registered to **+91 93984 99975**.

The message is sent from a separate WhatsApp Business Platform sender number connected to Meta. The customer only fills in the website form and clicks **Send enquiry**. The customer's WhatsApp app does not open.

## Important before setup

- The recipient number is `+91 93984 99975` (`919398499975` in the server configuration).
- You need a separate sender number connected to the WhatsApp Business Platform. The sender number and recipient number cannot be the same Cloud API sender.
- The website needs a Node.js backend on an HTTPS host. GitHub Pages and VS Code Live Server alone cannot send a server-side WhatsApp message.
- Meta credentials must remain on the server. Never paste the access token into HTML or `script.js`.
- Meta may require recipient opt-in and an approved template for this business-initiated notification.

## Setup steps

### 1. Create the WhatsApp API connection

1. Sign in to Meta Business Suite / Meta for Developers with the business administrator account.
2. Create or select the Meta Business Portfolio for Innovotix.
3. Create a developer app and add the WhatsApp product.
4. Complete the WhatsApp API setup and connect a dedicated sender phone number.
5. Verify the sender number as instructed by Meta.
6. In the WhatsApp API setup panel, copy the **Phone Number ID**. This is an ID, not the displayed sender phone number.
7. Generate a suitable access token with WhatsApp messaging permission. For production, use a properly managed system-user token and rotate it securely.

### 2. Create the message template

In WhatsApp Manager, create a Utility notification template with this name:

`website_enquiry_notification`

Use English (`en`) and this body with six placeholders in the exact order:

```text
New Innovotix website enquiry

Name: {{1}}
Phone: {{2}}
Email: {{3}}
Interest: {{4}}
Message: {{5}}
Submitted: {{6}}
```

Submit the template for review and wait until its status is **Approved**. If you choose a different template name, language, or placeholder order, update the `.env` settings and server code to match.

### 3. Add the credentials to the backend

1. Open the extracted website folder.
2. Open the `server` folder.
3. Copy `.env.example` and name the copy `.env`.
4. Fill in the real values:

```env
PORT=3000
WHATSAPP_ACCESS_TOKEN=YOUR_META_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID=YOUR_SENDER_PHONE_NUMBER_ID
WHATSAPP_RECIPIENT_NUMBER=919398499975
WHATSAPP_TEMPLATE_NAME=website_enquiry_notification
WHATSAPP_TEMPLATE_LANGUAGE=en
META_GRAPH_VERSION=v22.0
```

Do not upload `.env` to GitHub or share it publicly. It contains a secret token.

### 4. Test on your computer

1. Install the current Node.js LTS release.
2. Open a terminal in the `server` folder.
3. Run:

```bash
npm install
npm start
```

4. The server should show that it is running on `http://localhost:3000`.
5. Open `http://localhost:3000` in your browser. Do not use the VS Code Live Server port for this API test.
6. Fill in the enquiry form and click **Send enquiry**.
7. Check the WhatsApp account **+91 93984 99975** for a notification from the API sender number.

For initial testing with a Meta test sender, add your destination number to Meta's permitted test recipients and complete any verification/opt-in steps Meta requests.

### 5. Put the website online

Deploy the complete project to a Node.js hosting provider that supports environment variables and HTTPS.

- Set the start command to `npm start` with the working directory set to `server`.
- Add the same environment variables in the host's private environment-variable settings.
- Ensure the website pages and `/api/enquiry` endpoint are served from the same domain, or configure a secure reverse proxy.
- Do not expose `.env` or the access token in public files.
- Submit a test enquiry after deployment and check the WhatsApp account.

## What happens after a customer clicks Send?

1. The browser sends the form data to the website's `/api/enquiry` endpoint over HTTPS.
2. The Node.js server validates the required fields and consent.
3. The server sends a WhatsApp template message through Meta's Cloud API to `919398499975`.
4. The form shows success only if Meta accepts the API request.
5. You receive the enquiry in the WhatsApp account associated with +91 93984 99975.

An API acceptance response does not always prove final delivery. If the message does not arrive, check the server log and Meta's message status.

## Troubleshooting

| What you see | What to check |
|---|---|
| WhatsApp service is not configured | Check that all four required WhatsApp values are present in `.env`; restart the server after editing. |
| Invalid token / permission error | Check token validity and WhatsApp messaging permission. |
| Phone number ID error | Copy the sender **Phone Number ID** from Meta, not the visible phone number or WABA ID. |
| Template error | Confirm the exact template name, language, approved status and six body placeholders. |
| No message appears in your WhatsApp | Confirm the destination number, opt-in/test-recipient eligibility, sender configuration and Meta message status. |
| Form says service unavailable | Confirm the Node backend is running and `/api/enquiry` is routed to it. |

## Official setup references

- [Meta for Developers — WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Meta for Developers — WhatsApp Cloud API getting started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Meta for Developers — WhatsApp message templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/)

Meta's onboarding screens, permissions and policies can change. Follow the current instructions in your Meta Business and Developer accounts.
