import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase'

function resizeImage(file, maxWidth = 1200, maxHeight = 1200) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to convert image to JPEG'))
      }, 'image/jpeg', 0.85)
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }
    img.src = objectUrl
  })
}

export async function uploadItemPhoto(itemId, file) {
  try {
    const resized = await resizeImage(file)
    const storageRef = ref(storage, `items/${itemId}.jpg`)
    const snapshot = await uploadBytes(storageRef, resized)
    const url = await getDownloadURL(snapshot.ref)
    return { url, path: `items/${itemId}.jpg` }
  } catch (err) {
    console.error('Photo upload failed:', err)
    throw err
  }
}

export async function deleteItemPhoto(path) {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}
