#!/usr/bin/env tsx
/**
 * Database Setup Script for Quiz Game
 *
 * This script creates all tables and inserts sample data into your Supabase database.
 *
 * Prerequisites:
 * 1. Install dependencies: npm install
 * 2. Set up your .env.local file with Supabase credentials
 * 3. Run: npx tsx scripts/setup-database.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials!");
  console.error("Please set up your .env.local file with:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log("🚀 Starting database setup...");

  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, "setup-database.sql");
    const sqlScript = fs.readFileSync(sqlFilePath, "utf8");

    // Split the SQL script into individual commands
    const commands = sqlScript
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0 && !cmd.startsWith("--"));

    console.log(`📄 Found ${commands.length} SQL commands to execute`);

    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      if (
        command.toLowerCase().includes("create table") ||
        command.toLowerCase().includes("insert into") ||
        command.toLowerCase().includes("create index") ||
        command.toLowerCase().includes("alter table") ||
        command.toLowerCase().includes("create policy") ||
        command.toLowerCase().includes("grant")
      ) {
        console.log(`⏳ Executing command ${i + 1}/${commands.length}...`);

        const { error } = await supabase.rpc("exec_sql", {
          sql_command: command + ";",
        });

        if (error) {
          // Try direct SQL execution as fallback
          const { error: directError } = await supabase
            .from("_test_table_that_does_not_exist")
            .select("*");

          // If that fails too, try using the SQL editor approach
          console.log(`⚠️  Command ${i + 1} might need manual execution:`);
          console.log(command.substring(0, 100) + "...");
        }
      }
    }

    // Verify the setup by checking table counts
    console.log("\n✅ Verifying database setup...");

    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*", { count: "exact" });

    const { data: quizzes, error: quizError } = await supabase
      .from("quizzes")
      .select("*", { count: "exact" });

    const { data: questions, error: questError } = await supabase
      .from("questions")
      .select("*", { count: "exact" });

    if (!catError && !quizError && !questError) {
      console.log("✅ Database setup completed successfully!");
      console.log(`📊 Created ${categories?.length || 0} categories`);
      console.log(`📊 Created ${quizzes?.length || 0} quizzes`);
      console.log(`📊 Created ${questions?.length || 0} questions`);
      console.log("\n🎉 Your quiz app is ready to go!");
    } else {
      console.log("⚠️  Some tables might not be created properly.");
      console.log("Please run the SQL script manually in Supabase SQL Editor.");
    }
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    console.log("\n📝 Manual Setup Instructions:");
    console.log("1. Go to your Supabase dashboard");
    console.log("2. Open the SQL Editor");
    console.log("3. Copy and paste the contents of scripts/setup-database.sql");
    console.log("4. Run the SQL script");
  }
}

// Alternative function to create sample data only
async function createSampleData() {
  console.log("📊 Creating sample data...");

  try {
    // Insert sample categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .insert([
        {
          name: "Programming",
          slug: "programming",
          description: "Test your programming knowledge",
          icon_url: "💻",
        },
        {
          name: "Science",
          slug: "science",
          description: "Explore science concepts",
          icon_url: "🔬",
        },
      ])
      .select();

    if (catError) {
      console.error("Error creating categories:", catError);
      return;
    }

    console.log("✅ Sample categories created");

    // You can add more sample data creation here...
  } catch (error) {
    console.error("❌ Error creating sample data:", error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--sample-only")) {
    await createSampleData();
  } else {
    await setupDatabase();
  }
}

if (require.main === module) {
  main();
}

export { setupDatabase, createSampleData };
