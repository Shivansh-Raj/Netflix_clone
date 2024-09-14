import React, { useEffect, useState } from 'react'
// import movieTrailer from 'movie-trailer';
import API_KEY from "../../API/API_KEY"
import CancelIcon from '@mui/icons-material/Cancel';
import Youtube from "react-youtube"
import "./Movie_trailer.css"

function Movie_trailers({id,backdrop_path,title,overview,name,release_date,first_air_date,vote_average,setModalVisibility}) {
  const baseUrl =  "https://www.youtube.com/watch?v=";
  const opts = {
    height : "300",
    width : "100%",
    playerVars : {
        autoplay : 1,
        rel: 0, 
        modestbranding: 1,   
        iv_load_policy: 3,
    },
  }
  const randomPorcentaje = ()=>{
      return Math.floor(Math.random() * 100);
  }
  const [trailerUrl ,setTrailerUrl] = useState("") 
  useEffect (() => {
    if(trailerUrl){
      setTrailerUrl('')
    } else {
        const fetchTrailer = async() => {
          try {
            const trailerBaseUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`;
            const response = await fetch(trailerBaseUrl);
            if (response.ok) {
              const data = await response.json();

              if (data.results && data.results.length >= 1) {
                setTrailerUrl(data.results[0].key);  // Set the trailer URL to the first video key
              } else {
                console.error("No trailer found");
              }
            }else {
              console.log("Error in Fetching the data")
            }
          }catch (error) {
            console.error("Error fetching the trailer data: ", error);
          }
        };
        if (id) {
          fetchTrailer();  // Fetch trailer data only if `id` is provided
        }
    }
  },[])
  return (
    <div className="presentation" role="presentation">
            <div className="wrapper-modal">
                <div className="modal">
                    <span onClick={()=>setModalVisibility(false)}className="modal-close"><CancelIcon/></span>
                
                    {trailerUrl ? <Youtube videoId={`${trailerUrl}`} opts={opts}/> :                     
                    (<img
                    className="modal__poster-img"
                    src={`${baseUrl}${backdrop_path}`}
                    />)}

                    <div className="modal__content">
                        <p className="modal__details"><span className="modal__user-perc">{randomPorcentaje()}% for you</span> {release_date ? release_date : first_air_date}</p>
                        <h2 className="modal__title">{title ? title : name}</h2>
                        <p className="modal__overview">{overview}</p>
                        <p className="modal__overview">Vote Average: {vote_average}</p>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Movie_trailers