
export const fileToGenerativePart = async (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is a data URL: "data:image/jpeg;base64,...."
      const base64Data = result.split(',')[1];
      if (!base64Data) {
        reject(new Error("Could not parse base64 data from file."));
        return;
      }
      resolve({
        mimeType: file.type,
        data: base64Data
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
