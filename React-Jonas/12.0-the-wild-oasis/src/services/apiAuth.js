import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        fullName: fullName,
        avatar: "",
      },
    },
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

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

  if (error) {
    throw new Error(error.message);
  }
  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. UPDATE fullName OR password [can't update fullName and password at a time]
  let updateData;
  if (password) updateData = { password: password }; // either one of (password OR fullName) are true
  if (fullName) updateData = { data: { fullName: fullName } };

  const { data: updateUserData, error: errorWithUpdateUser } =
    await supabase.auth.updateUser(updateData); // this knows which user is currently logged-in [we need to pass in an obj >>> for every field that needs to be updated]

  if (errorWithUpdateUser) {
    throw new Error(errorWithUpdateUser.message);
  }
  if (!avatar) return updateUserData;

  // 2. UPLOAD avatar image
  const fileName = `avatar-${updateUserData.user.id}-${Math.random()}`; // making "avatar" unique!  [meanwhile create-policy for avatar inside supabase] #1

  const hasImage = updateUserData.user.user_metadata.avatar;
  // console.log(hasImage);

  if (hasImage) {
    const existingFilePath = updateUserData.user.user_metadata.avatar
      .split("/")
      ?.at(-1);

    const { data: imageDeleteData, error: imageDeleteError } =
      await supabase.storage.from("avatars").remove([existingFilePath]);

    if (imageDeleteError) throw new Error(imageDeleteError.message);
    // console.log("Deleted image ", imageDeleteData);
  }

  const { error: errorWithStorage } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (errorWithStorage) {
    throw new Error(errorWithStorage.message);
  }

  // 3. UPDATE avatar in user DB details
  const { data: updatedUserAvatarData, error: errorWithUpdateUserAvatar } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });
  if (errorWithUpdateUserAvatar) {
    throw new Error(errorWithUpdateUserAvatar.message);
  }
  return updatedUserAvatarData;
}
