// Wallpaper configuration
export const wallpapers = [1, 2, 3, 4, 5].map(id => ({
  id,
  path: `/wallpapers/${id}.jpg`,
  alt: `Wallpaper ${id}`
}));

export const defaultWallpaper = '/wallpapers/1.jpg';
