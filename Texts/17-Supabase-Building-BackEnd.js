//! Supabase- Building BackEnd !
//------------------------------
/**
 * ! 1. Section Overview
 * ---------------------
 * (free backend service' - library)
 * 
 * - "plan" application data
 * - model "relationships" between data-tables
 * - load data into App via "Supabase-API"
 * 
 * ! 2. What is Supabase?
 * ----------------------
 * * Supabase
 * - SERVICE allows devs to easily create a "back-end with Postgres database"
 * 
 * - automatically creates a "DB" & "API" so that we can easily request and receive data from a server
 * - so, NO backend development needed!
 * 
 * ADV
 * - Supabase also has easy-to-use "user authentication" and "file-storage"
 * 
 * 
 * ! 3. Creating a New Database
 * ----------------------------
 * => open "https://supabase.com/" 
 * 
 * - can build 2 projects "FOR FREE!!!"
 * - create an account => create a project
 * 
 * ! 4. Modeling Application State
 * -------------------------------
 * (in-order to fig out which tables we should create inside "SupaBase", then we have to model our Application-State)
 * ? How to model state ?
 * >>>   STATE DOMAIN / STATE SLICES         FEATURE CATEGORIES
 *                     --+--------------------  #1 Bookings
 *                      /
 *          -1 BOOKINGS --------------------    #2 Dashboard
 *                      \
 *                     --+--------------------  #3 Check-In and Check-Out
 *          -2 CABINS       ----------------    #4 Cabins
 *          -3 GUESTS       ----------------    #5 Guests
 *          -4 SETTINGS     ----------------    #6 App Settings
 *          -5 USERS        ----------------    #7 Authentication
 * 
 * $ NOTE:
 * - all these 5 states are going to be "global-remote-state" >>> stored within "SUPABASE"
 * - allocating one "table" for each "state-slice" inside database
 * (state slices === data tables)
 * 
 * >>> DB-tables:
 * - so, we need to create following data-base-tables
 * { bookings | cabins | guests | settings | users }
 * 
 * >>> The Bookings Tables:
 * - booking, which is a guest "renting" a cabin 
 * - so, booking needs info about which "guest" is booking which "cabin": so we need to connect "guest-table" and "cabin-table" to "booking-table"
 * 
 * >>> Technically:
 * - "SUPABASE" uses a "POSTGRES" database!
 *      - which is an SQL >>> a "RELATIONAL" database
 *          - so we have to join tables using "FOREIGN-KEYS"
 * 
 *               >>>  BOOKING
 *          id - guestId - cabinId - ...
 *                  /          \
 *     +-----------+            +--+
 *    /                            |
 *  id - email - ...              id - name - ...
  *>>>   GUEST                       CABIN
 * 
 * - here we store "guestId" & "cabinId" inside "BOOKING-Data-Table" 
 * >>> these two ids act as "foreign-keys"
 * 
 * * primary-key and foreign-key:
 * - connect a "BOOKING-Table" with "CABIN-Table" by storing "cabin's-id" (as primary key in cabin) inside "BOOKING-Table" >>> cabinId as "foreign-key"
 * (similarly with "guestId")
 * 
 * 
 * ! 5. Creating Tables
 * --------------------
 * (creating tables inside "supabase")
 * >>> Process:
 * - provide a name to the "table"
 * - while creating select check-box: "Enable Row Level Security (RLS)"
 * - specify names of columns that we want in that data-table
 * 
 * ? designing tables
 * ---
 * >>> cabin-Table:
 *   int8    timestamp      text         int2            int2           int2           text         text
 * |--id--|--created_at--|--name--|--maxCapacity--|--regularPrice--|--discount--|--description--|--image--|
 * => save it!
 * 
 * - NOTE: here "image-field" is also a "text-type" >>> cause a URL for every image >>> we upload inside storage "buckets" of supabase (where we can upload images too..)
 * (so we upload images into those buckets and store URL as "text" inside "image-field") 
 * 
 * >>> guests-Table:
 *   int8    timestamp        text       text         text            text           text       
 * |--id--|--created_at--|--fullName--|--email--|--nationalID--|--nationality--|--countryFlag--|
 * => save it!
 * 
 * >>> settings-Table:
 *   int8    timestamp        int2(nights)             int2                 int2              float4(ex: 9.99)           
 * |--id--|--created_at--|--minBookingLength--|--minBookingLength--|--maxGuestsPerBooking--|--breakfastPrice--|
 * => save it!
 *                          
 * 
 * ! 6. Relationships Between Tables
 * ---------------------------------
 * (complicated table design >>> set up relations)
 * 
 * >>> bookings-Table:
 *   int8    timestamp      timestamp    timestamp        int2         int2         float4          float4         float4        text          bool          bool          text        int8(F-K)   int8(F-K)                    
 * |--id--|--created_at--|--startDate--|--endDate--|--numNights--|--numGuests--|--cabinPrice--|--extrasPrice--|--totalPrice--|--status--|--hasBreakfast--|--isPaid--|--observations--|--cabinId--|--guestId--|
 * => save it!
 * 
 * - NOTE:
 * - here cabinId and guestId are "foreign-keys" link them using "link-option" beside field-name (while-creating-table)
 * 
 * - so while creating rows under this booking table.. 
 *      - supabase asks us to select a cabinId that need a booking and guestId (who is booking a cabin)
 * 
 * - as booking can be done for a cabin by a guest.. but a cabin can be booked as many times and by so many number of guests when they visit!  
 * (this represents number of "entities that can be involved")
 *  
 * - so Booking-Table reference other row from another table
 * (that's why we used "cabinId" and "guestId")
 * 
 * $ NOTE:
 * - USERS-table is automatically created by SUPABASE
 * 
 * ! 7. Adding Security Policies (RLS)
 * -----------------------------------
 * (ACCESS: data from supabase on local-machine | LEARN: row-level-security)
 * 
 * - inside supabase => on left-sidebar => navigate to "API docs"
 * (here supabase automatically creates documentation for all tables that were created till now)
 * 
 * - in [ Tables and Views ] => select a "table" (if we selected "guests-table") 
 * - so for each "table-column" we have respective code in terms of [ JS and Bash ]
 * (guest-table)
 * >>> JS >>> Select fullName
let { data: guests, error } = await supabase
  .from('guests')
  .select('fullName')
 * 
 * >>> bash >>> Select fullName
curl 'https://tnyqooxosavmcfmyoweh.supabase.co/rest/v1/guests?select=fullName' \
-H "apikey: SUPABASE_KEY" \
-H "Authorization: Bearer SUPABASE_KEY"
 *
 * $ NOTE: 
 * - on top-right-corner of the page => there will be an option "Project API Key" => we can select three options "hide keys" | "anon" | "service_role"
 * - select "anon" => which shows a "Project-Key" for every "column-field" and also for "READ ALL ROWS"
 *      - "key": we can use that on client-side to access data from SUPABASE  
 * 
 * (PROCESS-CONTINUES..)
 * - on bottom of that same page => there will be an option of "READ ALL ROWS"
 * >>> Under- "Read all rows"
 * ---
curl 'https://tnyqooxosavmcfmyoweh.supabase.co/rest/v1/guests?select=*' \-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueXFvb3hvc2F2bWNmbXlvd2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Njg1ODMsImV4cCI6MjA2NzE0NDU4M30.b33SURAgOCqIWfK02zxDmji5H54WjSNYP4LI1Q9FxCA" \-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ0.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueXFvb3hvc2F2bWNmbXlvd2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Njg1ODMsImV4cCI6MjA2NzE0NDU4M30.b33SURAgOCqIWfK02zxDmji5H54WjSNYP4LI1Q9FxCA"
 * 
 * (SECURITY_REASONS: above curl code with key is dummy)
 * 
 * - CURL: used to make HTTP-Req inside a terminal
 * - paste this type of code inside terminal.. as this is a "curl-req" >>> we get no errors but an empty array: []
 *      - cause of "ROW-LEVEL-SECURITY" that we enabled while creating tables 
 * 
 * >>> RLS:
 * - this prevents users who owns the key from accessing our DB
 *      - so whoever has this key can edit/delete our databases
 * - but we shall not allow this to happen.. so that is why we set RLS to "active" while table-creation
 * 
 * ? How to enable RLS ?
 * - inside "supabase" on left-sidebar => navigate to "Authentication" => click on "policies"  
 *      - every table has "RLS-enabled" => there will be an option for every table >>> "Create Policy" (click on it!)
 *          - "SELECT ~ Enable read access for all users" => click on "Save policy"  
 * 
 * - now, open terminal => run the curl-code that was copied inside terminal 
 *      - now we can observe that we can read data from respective table
 * 
 * - so, enable "Enable read access for all users" for every table => so that we can read data
 *      - if only enabled.. then we can read data from React-App
 * 
 * $ SUMMARY - on RLS:
 * - for every CRUD operation.. on every table.. we have create a new policy
 * 
 * 
 * ! 8. Connecting Supabase With Our React App
 * -------------------------------------------
 * - nav to "API Docs" => inside "intro" => we have a section called "connect to your project"
 * 
 * - follow:
 *    - npm install --save @supabase/supabase-js
 *    - inside "services" folder of our project: create a file called "supabase.js"
 * 
 * - paste:
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tnyqooxosavmcfmyoweh.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
 * 
 * $ NOTE:
 * - now we can import this [--exported: "supabase"--] into other files where "querying" is required!
 * 
 * * PROJECT-API-KEY
 * - from this file.. we have to extract the "key" 
 *    - navigate to "settings" => then API and copy that "anon-PUBLIC_API_KEY"
 * 
 * - there will be NO_PROBLEM >>> even if we exposed that key.. 
 *    - we had allowed only "Enable read access for all users" inside RLS-Policies for every table
 * (by this policy: users can only read data from available tables inside DB)
 * 
 * - then:
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tnyqooxosavmcfmyoweh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueXFvb3hvc2F2bWNmbXlvd2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Njg1ODMsImV4cCI6MjA2NzE0NDU4M30.b33SURAgOCqIWfK02zxDmji5H54WjSNYP4LI1Q9FxCA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
 * 
 * - now we create a separate file for every Table that we created!
 *    - naming convention: "api[<table_name>].js"
 * 
 * - to read all the rows
 *    - navigate to API-DOCS => under "Tables and Views" => navigate to "cabins" => go to "read all rows" section
 * [CODE]
 * ------
import supabase from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    return "Cabins could not be loaded";
  } 
  return data;
}
 * 
 * >>> select('*') means:
 * - selecting all [select('*')] the fields from cabins_table: [from('cabins')] 
 * 
 * 
 * ! 9. Setting Up Storage Buckets
 * -------------------------------
 * (set-up these storage-buckets: where we can upload large files)
 * 
 * - inside "supabase.com" => on left-sidebar => select "storage" and click on "New bucket" 
 * 
 * - create buckets "avatars" and "cabin-images"
 *    - make every bucket as a "Public bucket" [RLS: only users can read URLs of images]
 * 
 * - after creating "buckets" upload images into those "buckets" 
 *    - now we can get URLs for every image that we uploaded there!
 * 
 * - so again inside "supabase.com" => navigate to: "Table Editor" => click on "cabins" => "INSERT" a row and as image-field is a "text" => now we can upload URLs in there!
 * 
 * => next lectures..
 *    - we can upload images into "buckets" programmatically (we learn: in upcoming lectures!)
 * 
 * 
 * 
 * ! COMPLETED !
 * 
 * 
 */