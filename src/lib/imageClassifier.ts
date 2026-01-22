import { HfInference } from "@huggingface/inference";

const hf = new HfInference(); // Free tier - no API key needed for public models

export async function isDrawingOrMeme(imageUrl: string): Promise<boolean> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) return false;

    const imageBlob = await response.blob();

    // Use image classification to detect if it's a drawing/illustration
    const result = await hf.imageClassification({
      model: "microsoft/resnet-50",
      data: imageBlob,
    });

    // Check for labels that indicate real photos (people, faces, etc.)
    const realPhotoLabels = [
      "person", "man", "woman", "people", "face", "portrait",
      "selfie", "photograph", "photo", "human", "crowd",
      "suit", "dress", "shirt", "tie"
    ];

    const topLabels = result.slice(0, 5).map((r) => r.label.toLowerCase());

    // If any top label suggests real person photo, filter it out
    const isRealPhoto = topLabels.some((label) =>
      realPhotoLabels.some((realLabel) => label.includes(realLabel))
    );

    return !isRealPhoto;
  } catch (error) {
    console.error("Image classification error:", error);
    // Default to keeping the image if classification fails
    return true;
  }
}

export async function filterDrawingsOnly(
  images: { url: string; id: string }[]
): Promise<string[]> {
  const results = await Promise.allSettled(
    images.map(async (img) => {
      const isDrawing = await isDrawingOrMeme(img.url);
      return isDrawing ? img.id : null;
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<string | null> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((id): id is string => id !== null);
}
