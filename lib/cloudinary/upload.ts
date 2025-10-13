// Cloudinary configuration
const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  // Only return true if we have actual environment variables set
  return !!(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
};

// Fallback function to convert file to data URL (for local use)
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

// Upload file to Cloudinary
export const uploadToCloudinary = async (
  file: File,
  options?: {
    folder?: string;
    publicId?: string;
    transformation?: any;
    tags?: string[];
  }
): Promise<{ url: string; publicId: string }> => {
  // Check if Cloudinary is configured
  if (!isCloudinaryConfigured()) {
    console.warn(
      "Cloudinary is not configured. Using local data URL fallback."
    );
    // Use fallback: convert to data URL
    const dataURL = await fileToDataURL(file);
    return {
      url: dataURL,
      publicId: `local_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    };
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    if (options?.folder) {
      formData.append("folder", options.folder);
    }

    if (options?.publicId) {
      formData.append("public_id", options.publicId);
    }

    if (options?.tags) {
      formData.append("tags", options.tags.join(","));
    }

    // Add transformations if provided
    // Handle transformations properly for Cloudinary
    if (options?.transformation) {
      const { width, height, crop } = options.transformation;
      if (width) formData.append("width", width.toString());
      if (height) formData.append("height", height.toString());
      if (crop) formData.append("crop", crop);
    }
    fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Cloudinary error response:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          console.error("Cloudinary API error:", data.error);
          reject(new Error(data.error.message));
        } else {
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
          });
        }
      })
      .catch((error) => {
        console.error("Cloudinary upload error:", error);
        reject(new Error(`Upload failed: ${error.message}`));
      });
  });
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  const formData = new FormData();
  formData.append("public_id", publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }
};

// Generate Cloudinary URL with transformations
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
    gravity?: string;
  }
): string => {
  let url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  if (transformations) {
    const transformParts: string[] = [];

    if (transformations.width)
      transformParts.push(`w_${transformations.width}`);
    if (transformations.height)
      transformParts.push(`h_${transformations.height}`);
    if (transformations.crop) transformParts.push(`c_${transformations.crop}`);
    if (transformations.quality)
      transformParts.push(`q_${transformations.quality}`);
    if (transformations.format)
      transformParts.push(`f_${transformations.format}`);
    if (transformations.gravity)
      transformParts.push(`g_${transformations.gravity}`);

    if (transformParts.length > 0) {
      url += `/${transformParts.join(",")}`;
    }
  }

  url += `/${publicId}`;

  return url;
};

// Hook for file upload with progress
export const useFileUpload = () => {
  const uploadFile = async (
    file: File,
    options?: {
      folder?: string;
      publicId?: string;
      transformation?: any;
      tags?: string[];
      onProgress?: (progress: number) => void;
    }
  ): Promise<{ url: string; publicId: string }> => {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      console.warn(
        "Cloudinary is not configured. Using local data URL fallback."
      );
      // Use fallback: convert to data URL
      const dataURL = await fileToDataURL(file);
      return {
        url: dataURL,
        publicId: `local_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      };
    }

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      if (options?.folder) {
        formData.append("folder", options.folder);
      }

      if (options?.publicId) {
        formData.append("public_id", options.publicId);
      }

      if (options?.tags) {
        formData.append("tags", options.tags.join(","));
      }

      // Handle transformations properly for Cloudinary
      if (options?.transformation) {
        const { width, height, crop } = options.transformation;
        if (width) formData.append("width", width.toString());
        if (height) formData.append("height", height.toString());
        if (crop) formData.append("crop", crop);
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && options?.onProgress) {
          const progress = (event.loaded / event.total) * 100;
          options.onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.error) {
            console.error("Cloudinary API error:", data.error);
            reject(new Error(data.error.message));
          } else {
            resolve({
              url: data.secure_url,
              publicId: data.public_id,
            });
          }
        } else {
          console.error("Cloudinary error response:", xhr.responseText);
          reject(
            new Error(
              `Upload failed with status: ${xhr.status}, response: ${xhr.responseText}`
            )
          );
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed due to network error"));
      });

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
      );
      xhr.send(formData);
    });
  };

  return { uploadFile };
};
