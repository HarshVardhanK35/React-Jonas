import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tnyqooxosavmcfmyoweh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueXFvb3hvc2F2bWNmbXlvd2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Njg1ODMsImV4cCI6MjA2NzE0NDU4M30.b33SURAgOCqIWfK02zxDmji5H54WjSNYP4LI1Q9FxCA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
