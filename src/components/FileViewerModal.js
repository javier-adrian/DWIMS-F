/**
 * Global File Viewer Modal Component
 * Opens PDFs, images, text files, and attachments in-browser for viewing rather than immediate download.
 */

export const getMimeType = (fileName = '', blobType = '') => {
  if (blobType && blobType !== 'application/octet-stream') {
    return blobType;
  }
  const ext = (fileName || '').split('.').pop().toLowerCase();
  const mimeMap = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    txt: 'text/plain',
    log: 'text/plain',
    json: 'application/json',
    csv: 'text/csv',
    html: 'text/html',
    htm: 'text/html',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg'
  };
  return mimeMap[ext] || blobType || 'application/octet-stream';
};

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const openFileViewer = async ({ title, fileName, blob, mimeType }) => {
  // Close any existing viewer modal first
  const existingModal = document.getElementById('activeFileViewerModal');
  if (existingModal) {
    existingModal.remove();
  }

  const displayName = fileName || title || 'Document Preview';
  const resolvedMime = mimeType || getMimeType(displayName, blob?.type);

  // Wrap blob with correct MIME type so browsers render inline
  const typedBlob = (blob && resolvedMime && blob.type !== resolvedMime)
    ? new Blob([blob], { type: resolvedMime })
    : blob;

  const objectUrl = window.URL.createObjectURL(typedBlob);

  const isPdf = resolvedMime === 'application/pdf' || displayName.toLowerCase().endsWith('.pdf');
  const isImage = resolvedMime.startsWith('image/');
  const isVideo = resolvedMime.startsWith('video/');
  const isAudio = resolvedMime.startsWith('audio/');
  const isText = resolvedMime.startsWith('text/') || resolvedMime === 'application/json';

  let iconClass = 'fa-file';
  if (isPdf) iconClass = 'fa-file-pdf text-red-500';
  else if (isImage) iconClass = 'fa-file-image text-emerald-500';
  else if (isVideo) iconClass = 'fa-file-video text-blue-500';
  else if (isAudio) iconClass = 'fa-file-audio text-amber-500';
  else if (isText) iconClass = 'fa-file-lines text-violet-500';

  const modalContainer = document.createElement('div');
  modalContainer.className = 'fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in';
  modalContainer.id = 'activeFileViewerModal';

  let previewContentHtml = '';
  if (isPdf) {
    previewContentHtml = `
      <iframe src="${objectUrl}#toolbar=1" class="w-full h-full rounded-2xl border-0 bg-gray-100" title="${escapeHtml(displayName)}"></iframe>
    `;
  } else if (isImage) {
    previewContentHtml = `
      <div class="w-full h-full flex items-center justify-center p-4 overflow-auto bg-gray-900/5 rounded-2xl">
        <img src="${objectUrl}" alt="${escapeHtml(displayName)}" class="max-w-full max-h-full object-contain rounded-xl shadow-lg transition-transform">
      </div>
    `;
  } else if (isVideo) {
    previewContentHtml = `
      <div class="w-full h-full flex items-center justify-center p-4 bg-black rounded-2xl">
        <video src="${objectUrl}" controls autoplay class="max-w-full max-h-full rounded-xl"></video>
      </div>
    `;
  } else if (isAudio) {
    previewContentHtml = `
      <div class="w-full h-full flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl">
        <div class="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl mb-6 shadow-inner">
          <i class="fa-solid fa-music"></i>
        </div>
        <p class="text-base font-bold text-gray-800 mb-6">${escapeHtml(displayName)}</p>
        <audio src="${objectUrl}" controls class="w-full max-w-md"></audio>
      </div>
    `;
  } else if (isText) {
    try {
      const text = await typedBlob.text();
      previewContentHtml = `
        <div class="w-full h-full overflow-auto p-6 bg-gray-50 font-mono text-xs text-gray-800 rounded-2xl whitespace-pre-wrap selection:bg-primary/20">${escapeHtml(text)}</div>
      `;
    } catch {
      previewContentHtml = `
        <iframe src="${objectUrl}" class="w-full h-full rounded-2xl border-0 bg-white" title="${escapeHtml(displayName)}"></iframe>
      `;
    }
  } else {
    previewContentHtml = `
      <div class="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-gray-50/50 rounded-2xl">
        <div class="w-20 h-20 rounded-3xl bg-gray-100 text-gray-400 flex items-center justify-center text-3xl mb-6 shadow-inner">
          <i class="fa-solid fa-file"></i>
        </div>
        <h4 class="text-lg font-bold text-gray-800 mb-2">${escapeHtml(displayName)}</h4>
        <p class="text-xs text-gray-400 font-medium max-w-sm mb-6 uppercase tracking-wider">Browser preview is not available for this file type.</p>
        <button id="viewerOpenTabBtnFallback" class="ui-button-primary px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest inline-flex items-center gap-2">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open in New Tab
        </button>
      </div>
    `;
  }

  modalContainer.innerHTML = `
    <div class="relative w-full max-w-6xl h-[90vh] bg-white rounded-[32px] shadow-2xl border border-white/80 flex flex-col overflow-hidden animate-scale-in">
      <!-- HEADER -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-white/80 backdrop-blur-md flex-shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
            <i class="fa-solid ${iconClass}"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-black text-gray-900 truncate tracking-tight">${escapeHtml(displayName)}</h3>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${resolvedMime}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <button id="viewerOpenTabBtn" class="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all" title="Open in dedicated tab">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
            <span class="hidden sm:inline">Open in Tab</span>
          </button>
          <button id="viewerCloseBtn" class="w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all" title="Close preview">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>

      <!-- VIEWER BODY -->
      <div class="flex-1 p-3 sm:p-5 overflow-hidden flex flex-col min-h-0 bg-gray-50/30">
        <div class="w-full h-full flex-1 min-h-0 rounded-2xl overflow-hidden shadow-inner bg-white border border-gray-100">
          ${previewContentHtml}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalContainer);

  const cleanup = () => {
    modalContainer.remove();
    document.removeEventListener('keydown', handleKeydown);
    // Keep objectUrl alive briefly in case new tab was opened
    setTimeout(() => {
      try { window.URL.revokeObjectURL(objectUrl); } catch {}
    }, 60000);
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      cleanup();
    }
  };
  document.addEventListener('keydown', handleKeydown);

  modalContainer.querySelector('#viewerCloseBtn')?.addEventListener('click', cleanup);
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      cleanup();
    }
  });

  const openInTab = () => {
    window.open(objectUrl, '_blank');
  };

  modalContainer.querySelector('#viewerOpenTabBtn')?.addEventListener('click', openInTab);
  modalContainer.querySelector('#viewerOpenTabBtnFallback')?.addEventListener('click', openInTab);
};
