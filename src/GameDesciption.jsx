import React, { useEffect , useState,useCallback} from 'react'
import { LazyLoadComponent,LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
function GameDesciption() {
    const [isLoading, setIsLoading] = useState(true);
    const [GameDesciption, setGameDesciption] = useState({});
    const [hasliked,setHasliked] = useState(false);
    const { id } = useParams();
      const fetchGames = useCallback(async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`https://api.rawg.io/api/games/${id}?key=5fb7eda2d0ba415c8470730f5b1e56d5`);
          const data = await res.json();
          console.log(data);
            setGameDesciption(
              {
                name: data.name,
                description: data.description,
                background_image: data.background_image,
                released: data.released,
                playtime: data.playtime,
                rating: data.rating,
                background_image_additional: data.background_image_additional,
                DescriptionRating: data.playing < 3 ? "Meh" : data.playing > 3 && data.playing < 4 ? "Good" : "Exceptional",
                download: data.added,
              }
            );
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }, [id]);
      useEffect(() => {
        fetchGames();
      }, [id,fetchGames]);
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
        className="min-h-screen bg-cover   flex felx-col bg-center bg-no-repeat "
        style={{
          backgroundImage: `radial-gradient(circle,rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${GameDesciption?.background_image})`,
        }}
      >
               <nav className="flex pl-2 lg:pl-0 items-center fixed top-0 z-50  rounded-b-2xl bg-transparent py-5 backdrop-blur-sm  ">
              <Link to={"/"}><img src="/logo.svg" className="sm:mx-10 h-[45px] cursor-pointer" alt="" /></Link>
              <div className="w-screen">
                <i  className="cursor-pointer fas fa-search text-white relative left-8"></i>
                <input type="text" placeholder="Searh for a game..." className="input " />
              </div>
            </nav>
      <div className=' flex flex-col lg:flex-row   lg:justify-start w-[100%] absolute top-1/5 lg:text-left  sm:px-37 text-center  '>

          <div className=' lg:w-1/2   '>
            <p className=' cursor-pointer font-mono text-[#ffffff6a] mb-7 text-[12px] '>HOME / GAMES /  {  GameDesciption?.name.toUpperCase()}</p>
          <div className='flex justify-center lg:justify-start space-x-1 mb-7 items-center '>
                <p className='bg-white text-[12px] lg:text-[14px] rounded-sm  px-1.5 font-mono mr-3 '>{GameDesciption?.released}</p>
                <LazyLoadImage effect='blur' className='logo' src='/pc.png' ></LazyLoadImage>
                <LazyLoadImage effect='blur' className='logo' src='/xbox.png' ></LazyLoadImage>
                <LazyLoadImage effect='blur' className='logo' src='/play-station.png ' ></LazyLoadImage>
                <p className=' mx-2 text-[13px]  text-white'>AVERAGE PLAYTIME: {GameDesciption?.playtime} HOURES</p>
          </div>
                 <h1 className="font-['Audiowide'] lg:text-6xl text-5xl font-bold lg:max-w-1/1  text-white ">
             {GameDesciption?.name}
                 </h1>
                 <div className='flex my-7 lg:ml-0 space-x-5 justify-center lg:justify-start'>

                   <button className='text-white text-[15px] cursor-pointer font-mono border-[1px] px-5  py-3 rounded-lg hover:bg-white hover:text-black duration-300'>Add to My game  </button>
                                     <button onClick={()=>setHasliked(!hasliked)} className='text-white text-[15px] cursor-pointer font-mono border-[1px] px-5  py-3 rounded-lg hover:bg-white hover:text-black duration-300'>LIKE <span className='text-[18px] top-[1.5px] relative'>{hasliked ? "❤": ""}</span> </button>
                 </div>
                  <div className='flex my-7 lg:ml-0 space-x-5 justify-center lg:justify-start'>

                    <p className='text-white text-2xl font-semibold '> {GameDesciption?.DescriptionRating} <span className='border-l-1 py-2 ml-2 mr-3 opacity-40'></span> <span>{GameDesciption?.rating} <span className='fas fa-star text-[22px]'></span> </span> <span className='border-l-1 py-2 ml-2 mr-3 opacity-40'></span> <span>{GameDesciption?.download} <span className='fas fa-download'></span></span> </p>
                 </div>
          </div>
           <div className='  lg:w-[30%] lg:ml-15 inline-flex flex-col  items-center '>
            <LazyLoadImage effect='blur' className='lg:w-[100%] lg:h-40 rounded-md '  src={GameDesciption?.background_image} />
            <div className='flex h-full mt-5 space-x-2 '>
              <LazyLoadImage effect='blur' className='trailer' src={GameDesciption?.background_image_additional} />
              <LazyLoadImage effect='blur' className='trailer' src={GameDesciption?.background_image_additional} />
            </div>
              <div className='flex h-full mt-5 space-x-2 '>
              <LazyLoadImage effect='blur' className='trailer' src={GameDesciption?.background_image_additional} />
              <LazyLoadImage effect='blur' className='rounded-md cursor-pointer bg-amber-200 backdrop-blur-2xl ' src={GameDesciption?.background_image_additional} />
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