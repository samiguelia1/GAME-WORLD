import React, { useEffect , useState,useCallback} from 'react'
import { LazyLoadComponent,LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams } from 'react-router-dom'
function GameDesciption() {
    const [GameDesciption, setGameDesciption] = useState({});
    const { id } = useParams();
      const fetchGames = useCallback(async () => {
        try {        
          const res = await fetch(`https://api.rawg.io/api/games/${id}?key=5fb7eda2d0ba415c8470730f5b1e56d5`);
          const data = await res.json();
          console.log(data);
            setGameDesciption(
              {
                name: data.name,
                description: data.description,
                background_image: data.background_image_additional,
                released: data.released,
                rating: data.rating,
              }
            );

        } catch (error) {
          console.log(error)
        }
      }, []);
      useEffect(() => {
        fetchGames();
      }, [fetchGames]);
  return (
    <LazyLoadComponent threshold={0.95}>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5)), url(${GameDesciption.background_image})`
      }}
      >
      <h1 className="font-['Inter'] text-5xl font-bold text-white p-8 leading-tight">
        {GameDesciption.name}
      </h1>
      </div>

    </LazyLoadComponent>
  )
}

export default GameDesciption