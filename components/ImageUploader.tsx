
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string, mimeType: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result, file.type);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  // Handle clipboard paste
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              handleFile(blob);
              break; // Handle only the first image found
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full max-w-2xl h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
        isDragging
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-slate-700 hover:border-blue-400 hover:bg-slate-800/50'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="hidden"
      />
      <div className="text-blue-400 text-5xl mb-4">
        <i className="fas fa-cloud-upload-alt"></i>
      </div>
      <p className="text-xl font-medium text-slate-200">
        Drop or Paste your photo here
      </p>
      <p className="text-sm text-slate-400 mt-2">
        or click to browse from your device
      </p>
      <div className="mt-4 flex gap-2">
         <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">Drag & Drop</span>
         <span className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">Ctrl/Cmd + V</span>
      </div>
    </div>
  );
};

export default ImageUploader;
