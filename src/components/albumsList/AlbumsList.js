import styles from "./albumsList.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "react-spinner-material";

// firebase imports
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

// components imports
import { AlbumForm } from "../albumForm/AlbumForm";
import { ImagesList } from "../imagesList/ImagesList";

// mock data
// import { albumsData } from "../../static/mock";

export const AlbumsList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const [albumAddLoading, setAlbumAddLoading] = useState(false);
  const getAlbums = async () => {
    setLoading(true);
    const albumsRef = collection(db, "albums");
    const albumsSnapshot = await getDocs(
      query(albumsRef, orderBy("created", "desc"))
    );

    const albumsData = albumsSnapshot.docs.map((doc) =>({
      id: doc.id,
      ...doc.data(),
    }));

    setAlbums(albumsData);
    setLoading(false);

  
  // const deleteentry = async (id) => { 
  //     await deleteDoc(doc(db, "albums", `${id}`));
  }

  console.log(albums)
  useEffect(() => {
    getAlbums();
  }, []);

  const handleAdd = async (name) => {
    if (albums.find((a) => a.name === name))
      return toast.error("Album name already in use.");
  
    setAlbumAddLoading(true);
  
    // Create a temporary album (without adding to Firebase)
    const tempAlbum = {
      id: `temp-${Date.now()}`, // Unique temporary ID
      name,
    };
  
    // Add it to UI only
    setAlbums((prev) => [tempAlbum, ...prev]);
  
    toast.success("Album added successfully.");
    setAlbumAddLoading(false);
  };

  const [createAlbumIntent, setCreateAlbumIntent] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState(null);

  const handleClick = (name) => {
    if (activeAlbum === name) return setActiveAlbum(null);
    setActiveAlbum(name);
  };

  const handleBack = () => setActiveAlbum(null);

  if (albums.length === 0 && !loading) {
    return (
      <>
        <div className={styles.top}>
          <h3>No albums found.</h3>
          <button onClick={() => setCreateAlbumIntent(!createAlbumIntent)}>
            {!createAlbumIntent ? "Add album" : "Cancel"}
          </button>
        </div>
        {createAlbumIntent && <AlbumForm onAdd={handleAdd} />}
      </>
    );
  }
  if (loading) {
    return (
      <div className={styles.loader}>
        <Spinner color="#0077ff" />
      </div>
    );
  }

  return (
    <>
      {createAlbumIntent && !activeAlbum && (
        <AlbumForm loading={albumAddLoading} onAdd={handleAdd} />
      )}
      {!activeAlbum && (
        <div>
          <div className={styles.top}>
            <h3>Your albums</h3>
            <button
              className={`${createAlbumIntent && styles.active}`}
              onClick={() => setCreateAlbumIntent(!createAlbumIntent)}
            >
              {!createAlbumIntent ? "Add album" : "Cancel"}
            </button>
          </div>
          <div className={styles.albumsList}>
            {albums.map((album) => (
              <div
                key={album.id}
                className={styles.album}
                onClick={() => handleClick(album.name)}
              >
                <img src="/assets/photos.png" alt="images" />
                <span>{album.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeAlbum && (
        <ImagesList
          albumId={albums.find((a) => a.name === activeAlbum).id}
          albumName={activeAlbum}
          onBack={handleBack}
        />
      )}
    </>
  );
};
