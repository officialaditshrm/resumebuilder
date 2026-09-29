# Resolute front-end update

Front-end only. No backend files were changed.

## Not changed at all
- The resume itself: src/components/Preview.jsx, src/components/Preview2.jsx, src/components/HiddenResume.jsx (byte-identical), including how it sizes itself at each screen width
- The PDF export sends exactly the same HTML as before
- Tested: every element of the resume has the same computed styles and size as before, on the resume page and the edit page, at 5 screen sizes in light and dark mode.

## Changed
- New responsive layout: sidebar on desktop, top bar with slide-out menu on phones. Dark mode is remembered.
- Redesigned Home, My resumes, Community (with search), Profile, login/sign-up and new-resume dialogs.
- Edit resume form: section list with summaries, clearer editors for each section. All original editing logic is kept as-is.
- Login no longer stores an invalid token when a login fails; clearer error messages.
- Footer: "Thank you for making this useful to yourself - Adi".

## Resume page
- New header with the resume name, owner and last edit, and clear Edit, Make a copy and Download PDF buttons.
- Public / Private switch with a note on who can see it.
- The job-description check is now a tidy panel beside the resume on wide screens (below it on smaller ones), with the score, category bars, keyword chips and before/after rewrites.
- Delete moved to its own section and waits for the server before leaving the page. PDF export shows progress and reports failures.

## Safeguards
- Buttons that call the server are disabled and show progress ("Saving…", "Deleting…") until the request finishes; double clicks and repeated Enter presses send only one request.
- Save resume, New resume and Delete wait for the server before moving on. If the request fails you stay where you are, with your changes intact and a clear message.
- While something is saving, the sidebar and top-bar links are paused so the page can't change mid-request, and closing the tab asks for confirmation.
- Updates to the same resume are sent in order; overlapping list refreshes are combined into one.
- Profile edits save one at a time and the form stays open if the server rejects a change.

## Motion
- Pages settle in on navigation; dialogs slide up on phones and lift in on larger screens, with matching exit motion.
- The phone menu slides with eased timing; buttons respond to presses; new entries in the editors fade in.
- Loading lists show placeholders instead of text. All motion is switched off for people who prefer reduced motion.

## Home page
- Signed in: a clean dashboard with your recent resumes and a New resume button.
- Signed out: one short description, Create an account / Log in, and an example resume. Promotional sections were removed.

## New files
src/components/ui.jsx, src/components/AtsPanel.jsx, src/lib/auth.js, src/pages/sampleResume.js
