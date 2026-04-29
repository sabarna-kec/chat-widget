

# 📌 Project Title 

**Chat-widget**
*(Anonymous Question–Answer Platform in a Chat Interface)*

---

# 🧠 Project Description

Chat-widget is a **chatbot-based anonymous Q&A platform** that allows students to ask questions and receive answers from multiple peers in a **WhatsApp-like chat interface**.
Each question acts as an independent chat thread where multiple anonymous users can contribute answers in real time.

The platform removes fear of judgment by enforcing **complete anonymity**, while maintaining quality through **AI moderation, reactions, and summaries**.

---

# 🎯 Problem Statement

Students often hesitate to ask questions due to:

* Fear of judgment
* Identity exposure
* Complex interfaces of existing Q&A platforms

Existing solutions lack:

* Conversational UI
* True anonymity
* Real-time discussion

---

# ✅ Solution

A **chat-first anonymous Q&A widget** embedded into websites or platforms, where:

* Asking a question feels like sending a message
* Answering feels like chatting
* Identity is never revealed

---

# ⚙️ Core Functionalities

## 1️⃣ Anonymous Question Creation

* Users create questions directly through chat
* No login or profile required
* System assigns a random anonymous identity per session

---

## 2️⃣ Question-Based Chat Threads

* Each question opens as a dedicated chat
* Multiple users can answer the same question
* Messages appear in real time

---

## 3️⃣ Anonymous Answers

* All answers are anonymous
* No usernames, profile photos, or history
* Participants are identified only by icons (animals)

---

## 4️⃣ Message Reactions (Quality Control)

* Users can react to answers using:

  * 👍 Helpful
  * ❤️ Clear
  * 🔥 Smart
* Reactions help surface high-quality answers

---

## 5️⃣ AI-Powered Answer Summary

* AI generates a concise summary of answers
* Displayed at the top of the chat
* Updates dynamically as new answers arrive

---

## 6️⃣ Question Lifecycle Management

* Questions have states:

  * Open
  * Active
  * Archived
* Archived questions become read-only

---

## 7️⃣ AI Moderation

* Filters abusive or irrelevant content
* Flags spam automatically
* Maintains a safe environment without revealing identities

---

## 8️⃣ Real-Time Updates

* New answers appear instantly
* Users receive non-intrusive notifications

---

## 9️⃣ Widget-Based Integration

* Can be embedded into:

  * College portals
  * Learning platforms
  * Company intranets
* Lightweight and responsive

---

# 🖥️ UI Screens & Descriptions

## Screen 1: Chat Widget Launcher

**Description**

* Floating chat icon at bottom-right
* Opens the main chat interface

**Purpose**

* Easy access
* Familiar chatbot interaction

---

## Screen 2: Question Inbox Screen

**Description**

* List of active questions
* Each question displayed as a chat preview

**UI Elements**

* Question text
* Number of answers
* Status indicator (Open / Active / Archived)

---

## Screen 3: Create Question Screen

**Description**

* Chat-based input flow
* Bot prompts user to type a question

**Flow**

```
Bot: What’s your question?
User: How to manage time during exams?
Bot: Post anonymously?
```

---

## Screen 4: Question Chat Screen

**Description**

* WhatsApp-style message layout
* All answers displayed as chat bubbles

**UI Elements**

* Anonymous user icons
* Message timestamps
* Reaction buttons

---

## Screen 5: AI Summary Panel

**Description**

* Highlighted section at the top
* Shows AI-generated key points

**Purpose**

* Quick understanding
* Reduces reading overload

---

## Screen 6: Archived Question View

**Description**

* Read-only chat
* Displays all previous answers
* AI summary remains visible

---

## Screen 7: Notification Prompt

**Description**

* Small alert inside widget
* Shows count of new answers

---

# 🧱 Non-Functional Requirements

* High availability
* Low latency for real-time updates
* Secure content handling
* Scalable architecture
* Mobile-responsive design

---

# 🛠️ Technology Stack (Suggested)

| Layer       | Technology              |
| ----------- | ----------------------- |
| Frontend    | React (Javascripts)  |
| Backend     | Node.js + Express js      |
| Realtime    | WebSockets              |
| Database    |  MongoDB      |

---
# Backend Structure
'''
server/
 ├── controllers/
 │    ├── question.controller.js
 │    └── answer.controller.js
 ├── models/
 │    ├── Question.js
 │    └── Answer.js
 ├── routes/
 │    ├── question.routes.js
 │    └── answer.routes.js
 ├── websocket/
 │    └── socket.js
 ├── app.js
 └── server.js

'''

---
# 🔒 Privacy & Security

* No personal data stored
* Session-based anonymous IDs
* Encrypted message storage
* AI-based abuse detection

---

# 🚀 Future Enhancements

* Voice-based questions
* Multilingual support
* AI-suggested answers
* Topic-based question tagging
* Admin analytics dashboard

---

# 🧪 MVP Scope

**Minimum Viable Product includes:**

* Anonymous question creation
* Question-based chat threads
* Real-time anonymous answers
* Reaction system
* AI summaries
