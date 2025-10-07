<h1>🚑 Code Green Quiz</h1>

Code Green Quiz is an interactive web app designed for paramedics and students in prehospital care.
It delivers realistic case-based quizzes that help users practise decision-making and clinical reasoning in emergency scenarios. Each quiz follows a progressive format, mirroring how real ambulance cases unfold.

<h2>🌐 Overview</h2>

The platform is built as a full-stack web application consisting of:<ul>

<li>Frontend: React (Vite)</li>

<li>Backend: Laravel (PHP)</li>

<li>Database: MySQL</li></ul>

The client and server communicate via RESTful JSON APIs using Axios. Authentication is handled by Laravel Sanctum, which uses Bearer tokens rather than cookies — avoiding GDPR complications while keeping the app secure.

The site is live at codegreenquiz.com, with separate versions for formative and summative submissions hosted under:

formative.codegreenquiz.com

summative.codegreenquiz.com

<h2>🧰 Technologies</h2>
<h3>Frontend</h3>

⚛️ React (Vite) – fast and modular single-page application

🌐 React Router – smooth client-side navigation

💬 Axios – communication with backend API

🎨 Custom CSS – styled using the NHS Green colour palette

<h3>Backend</h3>

🧱 Laravel (PHP) – handles routes, authentication, and API logic

🔒 Laravel Sanctum – token-based authentication (no cookies)

🗄️ MySQL – relational database for users, quizzes, and answers

<h2>⚙️ Features</h2>

✅ User registration and login

✅ Progressive case-based quiz flow

✅ Flag/unflag questions for review

✅ View past attempts and scores

✅ Responsive design (mobile & desktop)

✅ Professional NHS-inspired look and feel
