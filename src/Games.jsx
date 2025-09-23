import React, { useCallback, useEffect,  useState } from "react";
import { LazyLoadComponent, LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
function Games(){ 

  const [hasDataFetched, setHasDataFetched] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [games, setGames] = useState([]);
  const API_KEY = "5fb7eda2d0ba415c8470730f5b1e56d5";
  const [page, setPage] = useState(1);

  const fetchGames = useCallback(async (link) => {
    setIsLoading(true);
    try {        
      const res = await fetch(link);
      const data = await res.json();
      setGames(data.results);
      setHasDataFetched(true); 
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    } 
  }, []);

  useEffect(() => {
    const URL_PAGE = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=20`;
    fetchGames(URL_PAGE);
  }, [page,fetchGames]);

  function SerachForGame(e){
    if((e.type === "keydown" && e.key==="Enter") || e.type==="click" ){
      if(gameName===""){
        window.alert("Oops You forget to type a game name Try again !!");
      } else {
        fetchGames(`https://api.rawg.io/api/games?key=${API_KEY}&search=${gameName}`);      
      }
    }
  }

  function setgamename(e){
    setGameName(e.target.value);
  }

  return(
    <div className="min-h-screen bg-[#1e222b3c] relative overflow-hidden">   
      <nav className="relative mx-4 my-2 z-50 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between px-6 py-4">
          
          <Link to={"/"} className="flex items-center">
            <img src="public/logo.svg" className="h-10 cursor-pointer hover:scale-105 transition-transform" alt="Logo" />
          </Link>

          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <i 
                onClick={SerachForGame} 
                className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-sm cursor-pointer hover:text-white transition-colors"
              ></i>
              <input 
                onChange={setgamename} 
                onKeyDown={SerachForGame} 
                type="text" 
                placeholder="Search . . ." 
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
              />
            </div>
          </div>

         
          <div className="w-10"></div>
        </div>
      </nav>
     
      <div className="flex justify-center items-center mt-8 mb-6 relative z-10">
        <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl shadow-black/20">
          <button 
            onClick={() => page === 1 ? setPage(page) : setPage(page-1)} 
            className={`${page == 1 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:bg-white/20"} 
              transition-all duration-300 rounded-xl p-3 flex items-center justify-center w-12 h-12`}
            disabled={page === 1}
          >
            <i className="fas fa-chevron-left text-white text-lg"></i>
          </button>
          
          <div className="flex items-center space-x-2 px-4">
            <span className="text-white font-semibold">Page</span>
            <span className="bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-1 rounded-lg text-white font-bold">{page}</span>
          </div>
          
          <button 
            onClick={() => setPage(page+1)} 
            className="opacity-100 hover:bg-white/20 transition-all duration-300 rounded-xl p-3 flex items-center justify-center w-12 h-12"
          >
            <i className="fas fa-chevron-right text-white text-lg"></i>
          </button>
        </div>
      </div>

      {
        isLoading ? (
          <div className="flex w-screen h-[60vh] justify-center items-center">
            <img src="public/loading.svg" className="lg:h-[40%] h-[20%] sm:30%" alt="" />
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 px-4 sm:px-6 py-6">
            {games.map((game, index) => (             
              <LazyLoadComponent key={game?.id} threshold={0.5}>
                <Link to={`/games/${game?.id}`} className="group block">
                  <div className="bg-[#22252b] border-2 border-gray-600/50 hover:border-gray-500/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover:bg-[#2a2d35]">
                    
                    <div className="relative w-full h-48 overflow-hidden">
                      <LazyLoadImage 
                        effect="blur" 
                        threshold={0.9} 
                        role="Game Img" 
                        className="w-full h-full object-cover"  
                        src={game?.background_image}
                      />
                      
                     
                      <div className="absolute top-3 right-3">
                        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                          <i className="fas fa-star text-yellow-400 text-xs"></i>
                          <span className="text-white text-xs font-bold">{Math.floor(game?.rating*10)/10}</span>
                        </div>
                      </div>

                      
                      <div className="absolute top-3 left-3">
                        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <span className="text-white text-xs font-bold">{game?.released?.split("-")[0]}</span>
                        </div>
                      </div>
                    </div>

                    
                    <div className="p-4">
                      
                      <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
                        {game?.name}
                      </h3>

                     
                      <div className="flex items-center justify-between text-xs">
                        
                        <div className="flex items-center space-x-3">
                          
                          <div className="flex items-center space-x-1">
                            <i className={`${game?.ratings?.[0]?.title === "exceptional" ? "fas fa-fire text-orange-500" : "fas fa-thumbs-up text-green-400"} text-xs`}></i>
                            <span className={`font-semibold ${game?.ratings?.[0]?.title === "exceptional" ? "text-orange-500" : "text-green-400"}`}>
                              {game?.ratings?.[0]?.title === "exceptional" ? "Hot" : "Good"}
                            </span>
                          </div>

                         
                          <div className="flex items-center space-x-1 text-gray-300">
                            <i className="fas fa-download text-xs"></i>
                            <span className="font-mono">{game?.added_by_status?.playing || 0}</span>
                          </div>
                        </div>

                        
                        <div className="flex items-center space-x-1 text-gray-400">
                          <i className="fas fa-clock text-xs"></i>
                          <span className="font-mono text-xs">{game?.released?.split("-")[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </LazyLoadComponent>
            ))}
          </ul> 
        )
      }
    </div>
  );
}

export default Games;