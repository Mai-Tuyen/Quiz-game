#!/usr/bin/env tsx
/**
 * Test Supabase Connection
 *
 * This script tests your Supabase connection and shows sample data.
 * Run: npx tsx scripts/test-connection.ts
 */

import { createClient } from "@supabase/supabase-js";

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase credentials!");
  console.error("Please set up your .env.local file with:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("🔗 Testing Supabase connection...");
  console.log(`📍 URL: ${supabaseUrl}`);

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .limit(5);

    if (error) {
      console.error("❌ Connection failed:", error.message);
      console.log("\n💡 Troubleshooting:");
      console.log("1. Check your Supabase URL and keys in .env.local");
      console.log("2. Make sure your Supabase project is active");
      console.log("3. Run the database setup script first");
      return;
    }

    console.log("✅ Connection successful!");
    console.log(`📊 Found ${data?.length || 0} categories`);

    if (data && data.length > 0) {
      console.log("\n📋 Sample categories:");
      data.forEach((cat: any) => {
        console.log(`  ${cat.icon_url} ${cat.name} - ${cat.description}`);
      });
    }

    // Test quizzes
    const { data: quizzes, error: quizError } = await supabase
      .from("quizzes")
      .select("title, slug, category:categories(name)")
      .eq("is_published", true)
      .limit(3);

    if (!quizError && quizzes) {
      console.log("\n🎯 Sample quizzes:");
      quizzes.forEach((quiz: any) => {
        console.log(`  📝 ${quiz.title} (${quiz.category?.name})`);
      });
    }

    // Test questions
    const { data: questions, error: questError } = await supabase
      .from("questions")
      .select("question_text, question_type")
      .limit(3);

    if (!questError && questions) {
      console.log("\n❓ Sample questions:");
      questions.forEach((q: any, index: number) => {
        console.log(
          `  ${index + 1}. [${q.question_type}] ${q.question_text.substring(
            0,
            60
          )}...`
        );
      });
    }

    console.log(
      "\n🎉 Your database is ready! Start your app with: npm run dev"
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

testConnection();
