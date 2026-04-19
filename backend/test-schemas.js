require("dotenv").config();
const mongoose = require("mongoose");

// Import models
const Question = require("./models/Question");
const Answer = require("./models/Answer");
const Session = require("./models/Session");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/chat-widget";

async function testSchemas() {
  try {
    console.log("🔌 Connecting to MongoDB:", MONGODB_URI);

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully\n");

    // Test Session insertion
    console.log("📝 Testing Session Schema...");
    const session = await Session.create({
      sessionId: "test-session-" + Date.now(),
      animalIcon: "tiger",
    });
    console.log("✅ Session created:", session._id);
    const sessionId = session.sessionId;

    // Test Question insertion
    console.log("\n📝 Testing Question Schema...");
    const question = await Question.create({
      text: "What is the meaning of life?",
      sessionId: sessionId,
      status: "open",
      aiSummary: "",
    });
    console.log("✅ Question created:", question._id);
    const questionId = question._id;

    // Test Answer insertion
    console.log("\n📝 Testing Answer Schema...");
    const answer = await Answer.create({
      questionId: questionId,
      text: "The meaning of life is 42.",
      sessionId: sessionId,
      senderIcon: "panda",
      status: "open",
      reactions: {
        helpful: 5,
        clear: 3,
        smart: 2,
      },
    });
    console.log("✅ Answer created:", answer._id);

    // Verify data retrieval
    console.log("\n🔍 Verifying stored data...");
    const retrievedSession = await Session.findById(session._id);
    const retrievedQuestion = await Question.findById(question._id);
    const retrievedAnswer = await Answer.findById(answer._id);

    console.log("✅ Session retrieved:", retrievedSession.sessionId);
    console.log("✅ Question retrieved:", retrievedQuestion.text);
    console.log("✅ Answer retrieved:", retrievedAnswer.text);

    console.log("\n🎉 All schemas are working correctly!");

    console.log("\n📊 Document IDs for verification in MongoDB:");
    console.log("   Session ID:", session._id);
    console.log("   Question ID:", question._id);
    console.log("   Answer ID:", answer._id);

    // Cleanup (optional: comment out to keep test data)
    // console.log("\n🧹 Cleaning up test data...");
    // await Session.deleteOne({ _id: session._id });
    // await Question.deleteOne({ _id: question._id });
    // await Answer.deleteOne({ _id: answer._id });
    // console.log("✅ Test data removed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

testSchemas();
