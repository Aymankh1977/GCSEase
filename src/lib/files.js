// Prepare an uploaded file into an Anthropic content block.
// Images are downscaled (to keep uploads fast and token-cheap) and re-encoded
// as JPEG. PDFs are passed through as document blocks.

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Could not read that file.'));
    r.readAsDataURL(file);
  });
}

function downscaleImage(dataUrl, maxDim = 1568, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('That image could not be processed.'));
    img.src = dataUrl;
  });
}

// Returns { block, preview }. block goes to the API; preview is for the UI.
export async function fileToAttachment(file) {
  const MB = 1024 * 1024;

  if (file.type === 'application/pdf') {
    if (file.size > 25 * MB) throw new Error('That PDF is large — please upload one under 25 MB (a few pages is plenty).');
    const dataUrl = await readAsDataURL(file);
    return {
      block: { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: dataUrl.split(',')[1] } },
      preview: { kind: 'pdf', name: file.name },
    };
  }

  if (file.type.startsWith('image/')) {
    const original = await readAsDataURL(file);
    const jpeg = await downscaleImage(original);
    return {
      block: { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: jpeg.split(',')[1] } },
      preview: { kind: 'image', url: jpeg, name: file.name },
    };
  }

  throw new Error('Please upload a photo (JPG or PNG) or a PDF.');
}
