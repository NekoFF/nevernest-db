# Phase 176-190 Contact/Takedown Strategy

Date: 2026-05-18

## Why This Is Needed

A public fan database needs a clear way to receive data corrections, source concerns, privacy concerns, and rights-holder takedown requests. Without a channel, legal/source issues can linger publicly and damage trust.

## Options

| Option | Pros | Cons |
| --- | --- | --- |
| Dedicated email | Clear, private, rights-holder friendly | Requires mailbox ownership, moderation, spam handling |
| GitHub issues | Transparent, easy for technical users | Public by default; poor for private/legal requests |
| Contact form later | Better UX and routing | Requires backend/spam/privacy work |
| Discord channel later | Good community flow | Not ideal for private/legal requests; moderation burden |

## Recommended Minimal Beta Option

Use a dedicated project email for public contact/takedown if ownership is ready. If not ready, use GitHub issues only for non-sensitive bug/data reports and delay public beta until a private takedown channel exists.

Do not publish a personal address. Do not promise support SLAs.

## Privacy Cautions

- Do not collect more personal data than needed.
- Do not ask users to upload private account information.
- Do not post rights-holder or reporter personal details publicly.
- If a contact form is added later, document retention and spam handling.

## UI/Docs Placement After Chosen

- Contact page.
- Disclaimer page asset/takedown section.
- README or public beta launch notes.
- `robots.txt` is not the right place for contact details.

## Phase 176-190 Copy Change

The Contact page now explicitly says a stable public contact and takedown channel should be selected before beta launch. No real email or URL was invented.
