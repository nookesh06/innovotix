# Innovotix — redesigned multi-page website

A fresh responsive website with three separate pages:

- `index.html` — company homepage, services, experience, partner collaboration and the two main modules.
- `robotics.html` — robotics lab services, class-wise illustrative learning path, six kit categories and interactive rover.
- `smart-home.html` — smart home systems, lighting scene simulator, device controls and installation process.

## Run locally

1. Extract the ZIP.
2. Open this folder in VS Code.
3. For a static preview, run Live Server on `index.html`.
4. GSAP is loaded from cdnjs. If it is unavailable, a CSS whole-rover float and the functional lighting controls remain available. The rover is animated as one rigid SVG character: its head, arms, wheels and body are never independently transformed, so the parts stay visually attached. Cursor-follow moves the complete rover wrapper only. The layouts include desktop, tablet and narrow-phone breakpoints.

## Enquiry form / WhatsApp delivery

The form is designed to submit to `/api/enquiry` and never opens the visitor's WhatsApp. To send an enquiry message to the Innovotix number in the WhatsApp Business account, deploy the Node server and configure Meta WhatsApp Business Cloud API credentials.

1. Create an approved WhatsApp message template named `website_enquiry_notification` (or set another name in `.env`). The template BODY must contain six text placeholders in this order: name, phone, email, interest, message, submitted date/time.
2. Copy `server/.env.example` to `server/.env` and set the Meta access token, sender Phone Number ID, recipient number `919398499975`, template name, and language.
3. Keep `.env` private; never commit it or place the access token in browser JavaScript.
4. Run `cd server && npm install && npm start`.
5. Deploy the whole project behind HTTPS on a Node-capable host. Serve the frontend and `/api/enquiry` from the same origin, or configure a secure reverse proxy. Do not use Live Server alone to test the real WhatsApp API.

The included endpoint sends an approved template message via Meta Graph API. It does not pretend to send when credentials are missing. Meta approval, business verification/eligibility and WhatsApp policy requirements apply. Use a number registered as the WhatsApp Business Platform sender; the destination should be the business account number you want to receive notifications on. Test with Meta's permitted recipient list before production.

## Content and factual accuracy

The Innovotix robotics content uses the details supplied in this project and the public Innovotix pages: robotics lab setup, curriculum, teacher training, Bayooka Mini, Goma, IoT Kit, AI Kit, Booyaka Blocks, Electronics Kit, Atal Tinkering Labs, Nitish Reddy's stated three years of robotics-lab experience, Leap Robots partnership, T-Works announcement, Kids Wonder Fest and the Nellore contact details.

No founder title, additional employee identities, smart-home brand affiliation, product price, warranty duration or installation territory is invented. Smart-home descriptions are illustrative service categories, not a claim of current stock or brand partnership. Class bands are an illustrative pathway to be agreed with each school.

## Assets

The four photos supplied by the user are used in the robotics gallery and collaboration area. The supplied photos are not used as robot character artwork. The robot is drawn as an original SVG rover with wheels, head, eyes, arms and animated core.


## WhatsApp lead notifications — setup guide

The enquiry form submits to the website server. The server then asks Meta's WhatsApp Business Cloud API to send a notification to the business recipient number `919398499975`. A visitor does not need to open WhatsApp. This feature will not deliver messages until the Meta setup below is complete and the site is deployed on a Node.js host with HTTPS.

### Where the messages arrive

When configured successfully, new enquiry notifications appear as a WhatsApp conversation in the WhatsApp account registered to `+91 93984 99975`. The message is sent from the separate WhatsApp Business Platform sender number that you connect to Meta. The customer's phone number and email are included in the notification so your team can follow up.

### Setup steps

1. **Use or create a Meta Business Portfolio.** Sign in to Meta Business Suite / Meta for Developers with the business administrator account. Create a Meta developer app and add the WhatsApp product.
2. **Connect a WhatsApp Business Platform sender number.** In the WhatsApp setup area, add and verify the number that will send the notifications. This sender is separate from the destination number `+91 93984 99975`. Record the **Phone Number ID** shown by Meta; do not confuse it with the visible phone number or WhatsApp Business Account ID.
3. **Create an approved notification template.** In WhatsApp Manager, create a Utility template named `website_enquiry_notification` in English. Its body should contain six placeholders in this exact order:

   `New website enquiry`
   `Name: {{1}}`
   `Phone: {{2}}`
   `Email: {{3}}`
   `Interest: {{4}}`
   `Message: {{5}}`
   `Submitted: {{6}}`

   Submit it for review and wait until Meta shows **Approved**. If the template name, language, or placeholder count differs, update the `.env` values or server parameter list to match.
4. **Allow the destination recipient.** Make sure `+91 93984 99975` is a valid WhatsApp number and that it has provided any opt-in Meta requires for receiving business-initiated messages. For initial testing, add it to the test recipient list if you are using a Meta test sender.
5. **Create a secure environment file.** Copy `server/.env.example` to `server/.env`. Fill in the real values:

   - `WHATSAPP_ACCESS_TOKEN`: a valid access token with WhatsApp messaging permission (keep it secret).
   - `WHATSAPP_PHONE_NUMBER_ID`: the sender Phone Number ID from Meta.
   - `WHATSAPP_RECIPIENT_NUMBER=919398499975`: your destination number, country code included, digits only.
   - `WHATSAPP_TEMPLATE_NAME=website_enquiry_notification`: the approved template name.
   - `WHATSAPP_TEMPLATE_LANGUAGE=en`: the approved language code.

   Never paste the access token into `script.js`, HTML, GitHub, or a public chat. Do not share it with anyone.
6. **Run the backend locally.** Install Node.js LTS. Open a terminal in the `server` folder and run `npm install`, then `npm start`. The server should report `http://localhost:3000`. Open `http://localhost:3000` in your browser (not Live Server on port 5500) and submit a test enquiry.
7. **Deploy the whole project.** Use a Node.js hosting service that supports environment variables and HTTPS. Deploy the complete project, set the same environment variables in the host dashboard, and set the start command to `npm start` from the `server` directory (or the host's equivalent). The frontend and `/api/enquiry` endpoint must share the same origin, or a secure reverse proxy must route `/api/enquiry` to the Node server.
8. **Test end to end.** Submit a test enquiry from a different phone/email. Check the server logs for errors and check WhatsApp on `+91 93984 99975` for a message from the API sender number. The browser shows success only when Meta accepts the API request. An accepted API request is not a guarantee of final delivery; check the WhatsApp conversation and Meta message status if it does not appear.

### If no WhatsApp message arrives

- `The WhatsApp Business message service has not been configured yet`: one or more `.env` values are missing, or the host was not restarted after setting them.
- `WhatsApp could not accept the enquiry`: check the server log for Meta's error, token permissions/expiry, sender Phone Number ID, recipient number, template approval, template language and exact placeholder count.
- Message appears in the Meta test recipient but not the business account: check the destination number format, recipient eligibility/opt-in and whether you are using the production sender.
- Do not put a permanent token in the website frontend to troubleshoot. Keep credentials only in the server environment.

**Important:** a static GitHub Pages deployment or VS Code Live Server cannot send these WhatsApp notifications by itself. The Node backend must be hosted and configured. WhatsApp Business Platform template and messaging policies apply; use Meta's current official setup instructions and confirm the account's eligibility before going live.


For a separate step-by-step notification guide, read [`WHATSAPP-SETUP.md`](WHATSAPP-SETUP.md).

## Robot photo animation update (5 Nov 2026)
- The homepage hero now uses the supplied blue tracked robot photo.
- On scroll, that same hero image travels into the left-side dock in the Robotics module card (GSAP ScrollTrigger; respects reduced-motion preferences).
- The Robotics page showcases the supplied mecanum-wheel platform, with the supplied illustrated robot as a gently animated companion.
- These are the user's supplied robot photos/illustration; no stock robot image has been substituted.


## Homepage robot entrance animation
The homepage hero uses a transparent PNG sprite sheet of the orange-and-yellow biped robot. Eight gait poses create a short walking cycle as the complete robot enters from the right edge and settles into the hero stage. After landing, it holds a neutral pose with a subtle whole-character idle movement. The entrance is responsive and respects `prefers-reduced-motion`. This is a 2D sprite animation, not a live 3D model or physics simulation.


## Cinematic robot journey

The homepage now draws the orange/yellow biped from a transparent PNG sprite sheet into a canvas (no photo rectangle or image card). GSAP drives the entrance, the eight-frame walk cycle, and a scroll-linked path from the hero to the Robotics module card. At the destination, the canvas fades into the same transparent robot cutout in the card. Opening Robotics carries a one-session arrival flag so the same character animates into its place beside the mecanum platform. The animation uses the supplied generated robot artwork; it is not a physically simulated 3D model or an exact copy of the Instagram Reel.

## Official Innovotix website content and photo preservation (November 2026)
The homepage has been expanded to retain the published Innovotix information while keeping the existing redesign, original project photos, robotics artwork and smart-home module. The added content includes the official Robotics Lab for Enhanced STEM Skills positioning; Kids Wonder Fest at MGB Mall with Next Generation School, Scratch programming, sensor-based robot building and certificate presentation; the original Bayooka Mini, Goma, IoT Kit, AI Kit, Booyaka Blocks and Electronics Kit descriptions; Atal Tinkering Lab and school STEM-lab information; Nitish Reddy's three-year robotics-lab experience in Hyderabad; the Leap Robots / T-Works collaboration; and the Viswasai DR SRK School demonstration.

The homepage gallery preserves every local student/project image shipped with this package and also references the original photographs hosted on Innovotix's official Wix media CDN. Those official-site photographs are remote image URLs and therefore require an internet connection; the local project photographs remain bundled under `assets/`. The official address, phone, email and published office hours are retained in the footer/contact area.

## Robot flight behaviour
The NEXBOT-style robot starts at the enlarged top-right launch crate, then uses a scroll-scrubbed sequence: slow take-off, Superman-style flight with bent knees, a crouched landing, and an upright dock inside the Robotics module artwork. `ScrollTrigger` progress controls both its position and rendered pose; it is not an independent autoplay animation. The transparent sprite frames are normalized so the robot fills the launch crate more closely. The canvas endpoint is calculated against the Robotics artwork at the scroll trigger's end, then cross-fades to the stationary module artwork.


## NEXBOT scroll behaviour

On the homepage, NEXBOT stays in one upright standing pose. As the visitor scrolls from the hero toward the Robotics module, the transparent robot follows the scroll position and docks inside the Robotics artwork. The animation does not switch to flight poses, rotate, jump, or animate independently of scrolling. The robot is handed off to the module image at the end of the scroll interval.


## Homepage robot display
The homepage now features the mecanum-wheel robot as a static image in the hero display and in the Robotics module card. The previous biped scroll-to-module canvas animation has been removed. The orange biped image and supporting assets remain in the package for other pages or future use.
#   i n n o v o t i x  
 