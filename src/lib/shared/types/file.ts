export async function ImagesToBase64(images: File[]): Promise<string[]> {
  const imagesBase64 = await Promise.all(
    images.map(async (image) => {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      return base64;
    }),
  );
  return imagesBase64 as string[];
}
