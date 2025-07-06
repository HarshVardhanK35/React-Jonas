import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

export async function createEditCabin(newCabin, id) {
  // https://tnyqooxosavmcfmyoweh.supabase.co/storage/v1/object/public/cabin-images//cabin-001.jpg
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // 0. format image storage-URL
  // 0.1 unique image-name
  const imgName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", ""); // supabase create new folders if this name may contains slashes

  // 0.2 image-path
  const img = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imgName}`;

  // 1. Create/Edit cabin
  let query = supabase.from("cabins");

  // A. CREATE
  if (!id) query = query.insert([{ ...newCabin, image: img }]);

  // B. EDIT
  if (id) query = query.update({ ...newCabin, image: img }).eq("id", id);

  const { data, error } = await query.select();
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }

  // 2. uploading image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imgName, newCabin.image);

  // 3. Delete cabin if there was an ERROR uploading an image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.log(storageError);
    throw new Error(
      "Cabin images could not be uploaded and cabin was not created!"
    );
  }
  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }
}
