import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Photo tipini tanımlayalım
export interface FavoritePhoto {
  userId: number;
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// Post tipini de tanımlayalım (gelecekte kullanacağız)
export interface FavoritePost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Store'un tipini tanımlayalım
interface FavoritesState {
  photos: FavoritePhoto[];
  posts: FavoritePost[];
  
  // Foto favorilere ekleme/çıkarma fonksiyonları
  addPhotoToFavorites: (photo: FavoritePhoto) => void;
  removePhotoFromFavorites: (photoId: number) => void;
  isPhotoFavorite: (photoId: number) => boolean;
  
  // Post favorilere ekleme/çıkarma fonksiyonları (gelecekte)
  addPostToFavorites: (post: FavoritePost) => void;
  removePostFromFavorites: (postId: number) => void;
  isPostFavorite: (postId: number) => boolean;
}

// Zustand store'u oluşturalım - localStorage ile persist edelim
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Başlangıç state'i
      photos: [],
      posts: [],
      
      // Photo için fonksiyonlar
      addPhotoToFavorites: (photo: FavoritePhoto) => {
        const currentPhotos = get().photos;
        // Zaten favorilerde var mı kontrol et
        const isAlreadyFavorite = currentPhotos.some(p => p.id === photo.id);
        
        if (!isAlreadyFavorite) {
          set((state) => ({
            photos: [...state.photos, photo]
          }));
        }
      },
      
      removePhotoFromFavorites: (photoId: number) => {
        set((state) => ({
          photos: state.photos.filter(photo => photo.id !== photoId)
        }));
      },
      
      isPhotoFavorite: (photoId: number) => {
        return get().photos.some(photo => photo.id === photoId);
      },
      
      // Post için fonksiyonlar (şimdilik boş, sonra dolduracağız)
      addPostToFavorites: (post: FavoritePost) => {
        const currentPosts = get().posts;
        const isAlreadyFavorite = currentPosts.some(p => p.id === post.id);
        
        if (!isAlreadyFavorite) {
          set((state) => ({
            posts: [...state.posts, post]
          }));
        }
      },
      
      removePostFromFavorites: (postId: number) => {
        set((state) => ({
          posts: state.posts.filter(post => post.id !== postId)
        }));
      },
      
      isPostFavorite: (postId: number) => {
        return get().posts.some(post => post.id === postId);
      },
    }),
    {
      name: 'favorites-storage', // localStorage key'i
      // Sadece photos ve posts'u persist et
      partialize: (state) => ({ 
        photos: state.photos, 
        posts: state.posts 
      }),
    }
  )
);