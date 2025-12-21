// ============================================================
// FILE PATH: src/services/upload.service.js
// ============================================================
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

export const uploadService = {
  // Upload image
  async uploadImage(file, path = 'images', onProgress = null) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${path}/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) {
              onProgress(Math.round(progress));
            }
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload multiple images
  async uploadMultiple(files, path = 'images', onProgress = null) {
    const uploadPromises = files.map(file => this.uploadImage(file, path, onProgress));
    return Promise.all(uploadPromises);
  },
};

export default uploadService;

