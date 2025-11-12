import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';


interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageSelect(null);
  };

  return (
    <div className="w-full">
      <label
        onDrop={handleDrop}
        onDragEnter={handleDragEvents}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragEvents}
        className={`relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
          ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'}`}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="미리보기" className="max-w-full max-h-full object-contain rounded-md p-2" />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-gray-900/50 rounded-full text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors"
              aria-label="이미지 제거"
            >
              <XCircleIcon />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
            <UploadIcon />
            <p className="mb-2 text-sm"><span className="font-semibold text-cyan-400">클릭하여 업로드</span>하거나 드래그 앤 드롭하세요</p>
            <p className="text-xs">최대 10MB의 PNG, JPG, GIF</p>
          </div>
        )}
        <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ImageUploader;