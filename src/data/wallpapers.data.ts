// Wallpaper configuration. `path` is the full-size wallpaper used as the
// desktop background; `thumb` is a tiny (~5-10 KB) 256×160 JPEG used in the
// menu-bar picker so opening the wallpaper menu doesn't decode multi-hundred-
// KB full-size images just to render 32-px squares.
export const wallpapers = [1, 2, 3, 4, 5, 6, 7].map(id => ({
  id,
  path: `/wallpapers/${id}.jpg`,
  thumb: `/wallpapers/thumb/${id}.jpg`,
  alt: `Wallpaper ${id}`,
}));

export const defaultWallpaper = '/wallpapers/3.jpg';
