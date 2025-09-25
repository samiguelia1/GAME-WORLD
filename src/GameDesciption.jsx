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
          
          const [gameResponse, storesResponse] = await Promise.all([
            fetch(`https://api.rawg.io/api/games/${id}?key=5fb7eda2d0ba415c8470730f5b1e56d5`),
            fetch(`https://api.rawg.io/api/games/${id}/stores?key=5fb7eda2d0ba415c8470730f5b1e56d5`)
          ]);
          
          const [data, storesData] = await Promise.all([
            gameResponse.json(),
            storesResponse.json(),
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
            }
          });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchGames();
    }, [fetchGames]);


    const backgroundStyle = useMemo(() => ({
        
    }), []);

   
    const handleLikeClick = useCallback(() => {
        setHasliked(prev => !prev);
    }, []);
  return (
  <>
  {
  isLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <img src="/loading.svg" className="h-20" alt="Loading..." />
    </div>
  ) : (
    <div className="min-h-screen bg-[#1e222b3c] relative">

      <nav className="sticky top-2 mx-4 z-50 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to={"/"} className="flex items-center">
            <img src="/logo.svg" className="h-10 cursor-pointer hover:scale-105 transition-transform" alt="Logo" />
          </Link>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-sm"></i>
              <input 
                type="text" 
                placeholder="Search . . ." 
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
              />
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </nav>

      
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-mono mb-2 sm:mb-0">
                HOME / GAMES / {GameDesciption?.name?.toUpperCase()}
              </p>
            </div>
            
            <Link to="/"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl text-white transition-all duration-300 flex items-center w-fit mt-3 sm:mt-0 group"
            >
              <i className="fas fa-home mr-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-sm sm:text-base">Back to Home</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-8">
            <div className="xl:col-span-3">
              <div className="bg-[#22252b] border-2 border-gray-600/50 hover:border-gray-500/80 rounded-3xl overflow-hidden shadow-lg transition-all duration-300">
                <LazyLoadImage
                  src={GameDesciption?.background_image}
                  alt={GameDesciption?.name}
                  className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover"
                  effect="blur"
                />
              </div>
              
              <Link 
                to={`/games/${id}/screenshots`}
                className="mt-4 bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl h-[100px] w-full overflow-hidden cursor-pointer flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:bg-white/20 hover:border-white/40"
              >
                <div className="flex space-x-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-white/90 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-white/90 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-white/90 animate-pulse delay-200"></div>
                </div>
                <span className="text-white text-sm font-medium tracking-wide">VIEW ALL SCREENSHOTS</span>
              </Link>
            </div>

           
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-[#22252b] border-2 border-gray-600/50 hover:border-gray-500/80 rounded-3xl p-6 shadow-lg transition-all duration-300">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  {GameDesciption?.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-white">{GameDesciption?.rating?.toFixed(1)}</span>
                    <i className="fas fa-star text-yellow-400 text-xl"></i>
                  </div>
                  <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {GameDesciption?.DescriptionRating}
                  </span>
                  <span className="text-gray-300 text-sm">{GameDesciption?.download} downloads</span>
                </div>

               
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Released</p>
                    <p className="text-white font-semibold">{GameDesciption?.released}</p>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-gray-400 text-xs uppercase tracking-wide">Playtime</p>
                    <p className="text-white font-semibold">{GameDesciption?.playtime} hours</p>
                  </div>
                </div>

                
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Available on</h3>
                  <div className="flex flex-wrap gap-3">
                    {GameDesciption?.gameURl?.steam && (
                      <a href={GameDesciption.gameURl.steam} target="_blank" rel="noopener noreferrer" 
                         className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-xl flex items-center space-x-2">
                        <LazyLoadImage effect='blur' src='/steam.png' className="h-5" alt="Steam" />
                        <span className="text-white font-medium">Steam</span>
                      </a>
                    )}
                    {GameDesciption?.gameURl?.xbox && (
                      <a href={GameDesciption.gameURl.xbox} target="_blank" rel="noopener noreferrer"
                         className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-xl flex items-center space-x-2">
                        <LazyLoadImage effect='blur' src='/xbox.png' className="h-5" alt="Xbox" />
                        <span className="text-white font-medium">Xbox</span>
                      </a>
                    )}
                    {GameDesciption?.gameURl?.playstation && (
                      <a href={GameDesciption.gameURl.playstation} target="_blank" rel="noopener noreferrer"
                         className="bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded-xl flex items-center space-x-2">
                        <LazyLoadImage effect='blur' src='/play-station.png' className="h-5" alt="PlayStation" />
                        <span className="text-white font-medium">PlayStation</span>
                      </a>
                    )}
                  </div>
                </div>

                
                <div className="space-y-3">
                  <button className="w-full bg-slate-700 hover:bg-slate-800 text-white py-4 px-6 rounded-xl font-semibold shadow-lg">
                    Add to My Games
                  </button>
                  <button 
                    onClick={handleLikeClick}
                    className={`w-full py-4 px-6 rounded-xl font-semibold shadow-lg ${
                      hasliked 
                        ? 'bg-red-700/70 backdrop-blur-sm hover:bg-red-800/70 text-white' 
                        : 'bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 text-white'
                    }`}
                  >
                    {hasliked ? '❤️ Loved' : '🤍 Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          
          <div className="bg-[#22252b] border-2 border-gray-600/50 hover:border-gray-500/80 rounded-3xl p-8 shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">About this game</h2>
            <div 
              className="text-gray-300 leading-relaxed prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: GameDesciption?.description }}
            />
          </div>
        </div>
      </div>
    </div>
  )
  }
  </>
);
}

export default GameDesciption;