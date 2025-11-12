
import React, { useState, useCallback } from 'react';
import { editImageWithGemini } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { MagicWandIcon } from './components/icons/MagicWandIcon';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    setOriginalImage(file);
    setGeneratedImage(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalImagePreview(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imagePart = await fileToGenerativePart(originalImage);
      const generatedImageData = await editImageWithGemini(
        imagePart.data,
        imagePart.mimeType,
        prompt
      );
      setGeneratedImage(`data:image/png;base64,${generatedImageData}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">
            AI Merch Mockup Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload a logo, describe the mockup, and let Gemini AI create it for you instantly.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Column */}
          <div className="flex flex-col gap-6 p-6 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm">
            <div>
              <label className="text-lg font-semibold mb-2 block text-gray-300">1. Upload Your Logo/Design</label>
              <ImageUploader onImageSelect={handleImageSelect} previewUrl={originalImagePreview} />
            </div>
            
            <div>
              <label htmlFor="prompt" className="text-lg font-semibold mb-2 block text-gray-300">2. Describe Your Mockup</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Place this logo on a black t-shirt held by a mannequin' or 'Add a retro 80s filter to this image'"
                className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors placeholder-gray-500"
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={!originalImage || !prompt || isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-lg hover:from-cyan-600 hover:to-indigo-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
            >
              <MagicWandIcon />
              {isLoading ? 'Generating...' : 'Generate Mockup'}
            </button>
          </div>

          {/* Output Column */}
          <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">3. Your Result</h2>
            <ResultDisplay
              originalImageUrl={originalImagePreview}
              generatedImageUrl={generatedImage}
              isLoading={isLoading}
            />
          </div>
        </div>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Google Gemini 2.5 Flash Image</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
