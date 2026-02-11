
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import { ImageState, ActionType, ProcessingState } from './types';
import { processImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    original: null,
    modified: null,
    mimeType: null,
  });

  const [processing, setProcessing] = useState<ProcessingState>({
    isLoading: false,
    status: '',
  });

  const handleImageUpload = (base64: string, mimeType: string) => {
    setImageState({
      original: base64,
      modified: null,
      mimeType: mimeType,
    });
  };

  const handleAction = async (action: ActionType) => {
    if (!imageState.original || !imageState.mimeType) return;

    setProcessing({
      isLoading: true,
      status: action === ActionType.LIKE ? 'Creating a Like gesture...' : 'Creating a Dislike gesture...',
    });

    try {
      const result = await processImageWithGemini(
        imageState.original,
        imageState.mimeType,
        action
      );
      setImageState(prev => ({ ...prev, modified: result }));
    } catch (error) {
      alert("Failed to process image. Please try again.");
    } finally {
      setProcessing({ isLoading: false, status: '' });
    }
  };

  const handleDownload = () => {
    if (!imageState.modified) return;
    const link = document.createElement('a');
    link.href = imageState.modified;
    link.download = `like-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setImageState({ original: null, modified: null, mimeType: null });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center">
      <Header />

      <main className="w-full max-w-5xl px-4 py-8 flex flex-col items-center gap-8">
        {!imageState.original ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex flex-col items-center">
             <div className="text-center mb-8 max-w-xl">
               <h2 className="text-3xl font-bold text-white mb-4">Turn Your Photos into Reactions</h2>
               <p className="text-slate-400">Upload a photo, and our AI will transform it into a professional thumbs-up or thumbs-down reaction with the background removed.</p>
             </div>
             <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Display Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Original Preview */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Original Photo</span>
                <div className="aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
                   <img 
                    src={imageState.original} 
                    alt="Original" 
                    className="w-full h-full object-cover"
                   />
                </div>
              </div>

              {/* Modified Preview */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Result</span>
                <div className="aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative flex items-center justify-center">
                  {processing.isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-blue-400 font-medium animate-pulse">{processing.status}</p>
                    </div>
                  ) : imageState.modified ? (
                    <img 
                      src={imageState.modified} 
                      alt="Modified" 
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-slate-600 text-center px-8">
                      <i className="fas fa-magic text-4xl mb-4 opacity-20"></i>
                      <p>Click Like or Dislike to see the magic</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="sticky bottom-8 w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleAction(ActionType.LIKE)}
                disabled={processing.isLoading}
                className="flex-1 min-w-[120px] bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-thumbs-up"></i>
                Like
              </button>

              <button
                onClick={() => handleAction(ActionType.DISLIKE)}
                disabled={processing.isLoading}
                className="flex-1 min-w-[120px] bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-thumbs-down"></i>
                Dislike
              </button>

              {imageState.modified && (
                <button
                  onClick={handleDownload}
                  className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  Download
                </button>
              )}

              <button
                onClick={reset}
                className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all"
                title="Upload New"
              >
                <i className="fas fa-redo-alt"></i>
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-slate-600 text-sm">
        Powered by Gemini AI • Create Like Photo 2024
      </footer>
    </div>
  );
};

export default App;
