/**
 * Client-side unsigned upload to Cloudinary.
 *
 * Requires an unsigned upload preset configured in the Cloudinary dashboard
 * (Settings → Upload → Upload presets → add preset → Signing mode: Unsigned),
 * restricted to an "admin-uploads" folder. Unsigned presets are safe to expose
 * publicly (that's their purpose) but should have folder/format/size
 * restrictions configured on the Cloudinary side so it can't be abused.
 */
export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured — set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const resourceType = file.type.startsWith("video") ? "video" : "image";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "admin-uploads");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return { url: data.secure_url, publicId: data.public_id, resourceType };
}
