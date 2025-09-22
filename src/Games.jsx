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
    <div>
      <nav className="flex items-center sticky top-0 z-50  bg-[#2e2e2e0d] py-5 backdrop-blur-sm   ">
        <Link to={"/"}><img src="public/logo.svg" className="sm:mx-10  h-[45px] cursor-pointer" alt="" /></Link>
        <div className="w-screen">
          <i onClick={SerachForGame} className="cursor-pointer fas fa-search text-white relative left-8"></i>
          <input onChange={setgamename} onKeyDown={SerachForGame} type="text" placeholder="Searh for a game..." className="input" />
        </div>
      </nav>
      <div className="w-screen flex justify-center">
        <img src="public/prev.png" onClick={ () => page === 1 ? setPage(page) : setPage(page-1)} className={`${page == 1 ? "opacity-30" : "opacity-100"} cursor-pointer hover:bg-[#343434] duration-300 rounded-full mx-3 h-[40px] w-[40px]`} alt="" />
        <img src="public/next.png" onClick={ () => setPage(page+1)} className="cursor-pointer hover:bg-[#343434] duration-300 rounded-full mx-3 h-[40px] w-[40px]" alt="" />
      </div>

      {
        isLoading ? (
          <div className="flex w-screen h-[60vh] justify-center items-center">
            <img src="public/loading.svg" className="lg:h-[40%] h-[20%] sm:30%" alt="" />
          </div>
        ) : (
          <ul  className=" sm:flex flex-wrap grid sm:flex-row">
            {games.map((game, index) => (
             
              <LazyLoadComponent key={game?.id} threshold={0.8} >
              <Link to={`/games/${game?.id}`} className=" game-card flex flex-col my-5 overflow-hidden text-white w-1/1 sm:w-1/4 lg:w-1/6 hover:scale-110 lg:ml-8 sm:ml-15 rounded-lg pb-2 cursor-pointer duration-300 hover:bg-[#515050] bg-[#2e2e2e]">              
                <LazyLoadImage effect="blur" delayTime={3000} threshold={0.8} role="Game Img" className="  object-cover w-full h-full sm:h-25"  src={game?.background_image}></LazyLoadImage>
                <p className="text-xl mx-2 mt-2 max-w-[100%] font-bold text-shadow-lg/20 text-shadow-black">{game?.name}</p>
                <div className="flex items-center mt-5 sm:justify-around mx-2">
                  <p className={`text-[13px] font-semibold ${game?.ratings?.[0]?.title === "exceptional" ? "text-[#ff4d00]" : "text-[#0fd20fd2]"} ${game?.ratings?.[0]?.title == "exceptional" ? "fas fa-fire" : "fas fa-thumbs-up"}`}></p>
                  <i className="fas fa-download ml-2 mr-1 text-[13px]"></i>
                  <span className="text-[12px] font-semibold font-mono">{game?.added_by_status?.playing}</span>
                  <i className="fas fa-star ml-2 text-[13px] text-amber-300"></i>
                  <span className="text-[12px] font-semibold font-mono mx-1">{Math.floor(game?.rating*10)/10}</span>
                  <p className="text-[12px] font-semibold font-mono mx-1">
                    <span className="ml-2 mr-1 fas fa-clock"></span>
                    {game?.released?.split("-")[0]}
                  </p>
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