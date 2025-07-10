import supabase from "./supabase";

export async function login(loginDetails) {
  const { email, password } = loginDetails;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getLoggedUser() {
  // local-storage gets session of user.. when user logs in
  const { data: sessionData } = await supabase.auth.getSession(); // check if there is any active session inside "LOCAL-STORAGE"

  if (!sessionData.session) return null; // checking of active-session, if "NO" returns a "null"

  // else.. 
  // re-download / fetch 'user' from 'supabase' [instead we can get from above-sessionData but that will not be a secure-way]
  const { data, error } = await supabase.auth.getUser();
  console.log(data);

  if (error) {
    throw new Error(error.message);
  }
  return data?.user;
}
