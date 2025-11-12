import React from 'react';
import Spinner from './Spinner';
import { DownloadIcon } from './icons/DownloadIcon';
import { ImageIcon } from './icons/ImageIcon';

interface ResultDisplayProps {
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  isLoading: boolean;
}

const ImageBox: React.FC<{ title: string; imageUrl: string | null; children?: React.ReactNode }> = ({ title, imageUrl, children }) => (
    <div className="w-full flex-1 flex flex-col">
        <h3 className="text-md font-semibold text-gray-400 mb-2">{title}</h3>
        <div className="relative aspect-square w-full bg-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-700">
            {imageUrl ? (
                <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
            ) : (
                <div className="text-gray-500">
                    <ImageIcon />
                </div>
            )}
            {children}
        </div>
    </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImageUrl, generatedImageUrl, isLoading }) => {
  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = '생성된-목업.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      <ImageBox title="원본" imageUrl={originalImageUrl} />
      <ImageBox title="생성된 이미지" imageUrl={generatedImageUrl}>
        {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <Spinner />
            </div>
        )}
        {generatedImageUrl && !isLoading && (
            <button
              onClick={handleDownload}
              className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-gray-900/60 rounded-md hover:bg-gray-900/80 transition-colors backdrop-blur-sm"
            >
              <DownloadIcon />
              다운로드
            </button>
        )}
      </ImageBox>
    </div>
  );
};

export default ResultDisplay;