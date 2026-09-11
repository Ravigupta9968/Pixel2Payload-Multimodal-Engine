import React, { useState } from 'react';
import { UploadCloud, Loader2, Cpu, Activity, LayoutTemplate, ShieldAlert } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !query) {
      setError('Please provide both an image and extraction instructions.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const response = await fetch('https://pixel2payload-multimodal-engine.onrender.com/extract', {
         method: 'POST',
          body: formData,
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-2">
            <LayoutTemplate className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Pixel<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-blue-300">2</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Payload</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Enterprise Multimodal Extraction Engine. Upload complex architecture diagrams, charts, or renders to extract structured telemetry.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${previewUrl ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-600 bg-slate-800/50 group-hover:border-blue-400/50 group-hover:bg-slate-700/50'}`}>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="h-48 object-contain rounded-lg shadow-lg mb-4" />
                    ) : (
                      <UploadCloud className="w-12 h-12 text-slate-400 mb-4 group-hover:text-blue-400 transition-colors" />
                    )}
                    <p className="text-sm font-medium text-slate-300 text-center">
                      {file ? file.name : 'Drag & drop or click to upload target visual'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    Extraction Protocol
                  </label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'Identify all microservices and database nodes. Classify their connections and suggest redundancy updates.'"
                    rows={4}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-semibold text-lg flex justify-center items-center gap-3 transition-all duration-300 ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'}`}
                >
                  {loading ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Processing Telemetry...</>
                  ) : (
                    'Initialize Analysis'
                  )}
                </button>
                
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          
          <div className="lg:col-span-7">
            {result ? (
              <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-2xl h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                
                <div className="space-y-3">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Activity className="w-6 h-6 text-emerald-400" />
                    System Summary
                  </h2>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    {result.summary}
                  </p>
                </div>

               
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Extracted Components</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.identified_entities.map((entity, idx) => (
                      <div key={idx} className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 hover:border-slate-500 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-slate-100">{entity.entity_name}</h4>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {entity.entity_type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                          {entity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-auto">
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${entity.confidence_score > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${entity.confidence_score * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-slate-500">
                            {(entity.confidence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {result.suggested_actions && result.suggested_actions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Strategic Recommendations</h3>
                    <ul className="space-y-3">
                      {result.suggested_actions.map((action, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                          <span className="text-blue-400 mt-0.5">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[400px] border border-dashed border-slate-700/50 rounded-3xl flex flex-col items-center justify-center text-slate-500 space-y-4 bg-slate-800/10">
                <LayoutTemplate className="w-16 h-16 opacity-20" />
                <p>Awaiting visual telemetry for processing...</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}