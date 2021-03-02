export const mkInstance = (window as any).MusicKit.getInstance();

export function fetchChart() {
  const searchTypes = ['songs', 'albums', 'playlists'];
  return mkInstance.api
    .charts(null, {
      types: searchTypes,
      limit: 30,
    })
    .then((res: any) => ({
      albums: res.albums[0].data,
      playlists: res.playlists[0].data,
      songs: res.songs[0].data,
    }));
}
function fetchAlbum(id: string) {
  return mkInstance.api.album(id);
}
function fetchPlaylist(id: string) {
  return mkInstance.api.playlist(id);
}
export function fetchAlbumOrPlaylist(id: string, type: string) {
  if (type === 'playlist') {
    return fetchPlaylist(id);
  } else {
    return fetchAlbum(id);
  }
}

export function search(query: string): Promise<any> {
  const searchTypes = ['songs', 'albums', 'playlists'];
  return mkInstance.api
    .search(query, {
      types: searchTypes,
      limit: 50,
    })
    .then((res: any) => ({
      albums: res?.albums.data,
      songs: res?.songs?.data ?? null,
      playlists: res?.playlists?.data ?? null,
    }));
}
