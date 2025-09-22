import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { LazyLoadComponent, LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';

function GameDesciption() {
    const [isLoading, setIsLoading] = useState(true);
    const [GameDesciption, setGameDesciption] = useState({});
    const [hasliked, setHasliked] = useState(false);
    const { id } = useParams();

    const fetchGames = useCallback(async () => {
        try {
          setIsLoading(true);
          
          // Use Promise.all for parallel API calls
          const [gameResponse, storesResponse] = await Promise.all([
            fetch(`https://api.rawg.io/api/games/${id}?key=5fb7eda2d0ba415c8470730f5b1e56d5`),
            fetch(`https://api.rawg.io/api/games/${id}/stores?key=5fb7eda2d0ba415c8470730f5b1e56d5`)
          ]);
          
          const [data, storesData] = await Promise.all([
            gameResponse.json(),
            storesResponse.json()
          ]);
          
          setGameDesciption({
            name: data.name,
            description: data.description,
            background_image: data.background_image,
            released: data.released,
            playtime: data.playtime,
            rating: data.rating,
            background_image_additional: data.background_image_additional,
            DescriptionRating: data.playing < 3 ? "Meh" : data.playing > 3 && data.playing < 4 ? "Good" : "Exceptional",
            download: data.added,
            gameURl: {
              steam: storesData.results?.[0]?.url,
              xbox: storesData.results?.[3]?.url,
              playstation: storesData.results?.[1]?.url,
              epic: storesData.results?.[2]?.url
            }
          });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
    }, [id]);
//test
    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    // Memoize background image style
    const backgroundStyle = useMemo(() => ({
        backgroundImage: `radial-gradient(circle,rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${GameDesciption?.background_image})`
    }), [GameDesciption?.background_image]);

    // Memoize like button handler
    const handleLikeClick = useCallback(() => {
        setHasliked(prev => !prev);
    }, []);
  return (
  <>
  {
  isLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-[#151515]">
      <img src="/loading.svg" className="h-20" alt="Loading..." />
    </div>
  ) : (
    <LazyLoadComponent   threshold={0.95}>

      <div
        className="min-h-screen bg-cover flex felx-col bg-center bg-no-repeat"
        style={backgroundStyle}
      >
               <nav className="flex pl-2 items-center fixed top-0 z-50 rounded-b-2xl bg-transparent py-5 backdrop-blur-sm">
              <Link to={"/"}><img src="/logo.svg" className="sm:mx-10 h-[45px] cursor-pointer" alt="" /></Link>
              <div className="w-screen">
                <i  className="cursor-pointer fas fa-search text-white relative left-8"></i>
                <input type="text" placeholder="Searh for a game..." className="input " />
              </div>
            </nav>
      <div className='flex flex-col w-[100%] absolute top-1/5 text-center sm:px-37'>

          <div className='w-full'>
            <p className=' cursor-pointer font-mono text-[#ffffff6a] mb-7 text-[12px] '>HOME / GAMES /  {  GameDesciption?.name.toUpperCase()}</p>
          <div className='flex justify-center space-x-1 mb-7 items-center'>
                <p className='bg-white text-[12px] rounded-sm px-1.5 font-mono mr-3'>{GameDesciption?.released}</p>
                
                <a href={GameDesciption?.gameURl?.steam} target="_blank" rel="noopener noreferrer" title="Download on Steam">
                  <LazyLoadImage effect='blur' className='logo cursor-pointer hover:opacity-80 transition-opacity' src='/steam.png' />
                </a>
                
                <a href={GameDesciption?.gameURl?.xbox} target="_blank" rel="noopener noreferrer" title="Download on Xbox Store">
                  <LazyLoadImage effect='blur' className='logo cursor-pointer hover:opacity-80 transition-opacity' src='/xbox.png' />
                </a>
                
                <a href={GameDesciption?.gameURl?.playstation} target="_blank" rel="noopener noreferrer" title="Download on PlayStation Store">
                  <LazyLoadImage effect='blur' className='h-[22px] mx-0.5 cursor-pointer hover:scale-120 ' src='/play-station.png' />
                </a>
                
                <p className=' mx-2 text-[13px]  text-white'>AVERAGE PLAYTIME: {GameDesciption?.playtime} HOURES</p>
          </div>
                 <h1 className="font-['Audiowide'] text-5xl font-bold text-white">
             {GameDesciption?.name}
                 </h1>
                 <div className='flex my-7 space-x-5 justify-center'>

                   <button className='text-white text-[15px] cursor-pointer font-mono border-[1px] px-5  py-3 rounded-lg hover:bg-white hover:text-black duration-300'>Add to My game  </button>
                   <button onClick={handleLikeClick} className='text-white text-[15px] cursor-pointer font-mono border-[1px] px-5  py-3 rounded-lg hover:bg-white hover:text-black duration-300'>LIKE <span className='text-[18px] top-[1.5px] relative'>{hasliked ? "❤": ""}</span> </button>
                 </div>
                  <div className='flex my-7 space-x-5 justify-center'>

                    <p className='text-white text-2xl font-semibold '> {GameDesciption?.DescriptionRating} <span className='border-l-1 py-2 ml-2 mr-3 opacity-40'></span> <span>{GameDesciption?.rating?.toFixed(1)} <span className='fas fa-star text-[22px]'></span> </span> <span className='border-l-1 py-2 ml-2 mr-3 opacity-40'></span> <span>{GameDesciption?.download} <span className='fas fa-download'></span></span> </p>
                 </div>
          </div>
          
    

      </div>

      </div>
      
    </LazyLoadComponent>
  )
  }
  </>
);
}

export default GameDesciption;