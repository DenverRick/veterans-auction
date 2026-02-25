import { useState, useRef } from 'react'

export default function PhotoUpload({ currentUrl, onUpload, onUploadingChange }) {
  const [preview, setPreview] = useState(currentUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function setUploadState(val) {
    setUploading(val)
    if (onUploadingChange) onUploadingChange(val)
  }

  async function handleFile(file) {
    if (!file) return
    setError('')
    setPreview(URL.createObjectURL(file))
    setUploadState(true)
    try {
      await onUpload(file)
    } catch (err) {
      console.error('Photo upload error:', err)
      setError(err.message || 'Upload failed — check Firebase Storage rules')
    } finally {
      setUploadState(false)
    }
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          uploading ? 'border-gold opacity-70 cursor-wait' : 'border-gray-300 cursor-pointer hover:border-gold'
        }`}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
        ) : (
          <div className="py-8 text-gray-400">
            <p className="text-sm">Click to upload photo</p>
          </div>
        )}
        {uploading && <p className="text-xs text-gold mt-2 animate-pulse">Uploading...</p>}
      </div>
      {error && (
        <p className="text-red-600 text-xs mt-2">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}
