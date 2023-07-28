const userTab= document.querySelector('[data-userWeather]') 
const searchTab=document.querySelector('[data-searchWeather]') 
const userContainer= document.querySelector('.weather-container') 
const grantAccessConatiner=document.querySelector('.grant-access-container') 
const searchForm= document.querySelector('[data-searchForm]') 
const loadingScreen=document.querySelector('.loading-container') 
const userInfoContainer=document.querySelector('.user-info-container')  
const errorContainer=document.querySelector('.error-container')
 
// initial variable  


let currentTab= userTab 
const API_KEY="d1845658f92b31c64bd94f06f7188c9c" 
currentTab.classList.add('current-tab')  
getfromSessionStrorage()

function switchTab(clickedTab){
  if(clickedTab!=currentTab){
    currentTab.classList.remove('current-tab')  
    currentTab=clickedTab 
    currentTab.classList.add('current-tab') 

    if(!searchForm.classList.contains('active')){
      userInfoContainer.classList.remove('active') 
      grantAccessConatiner.classList.remove('active') 
      searchForm.classList.add('active')
    } 
    else{
      // search form visible hai 
      searchForm.classList.remove('active') 
      userInfoContainer.classList.remove('active') 
      getfromSessionStrorage();
    }
    
  }
}
userTab.addEventListener('click',()=>{
  // passing clicked tab as parameter 
  switchTab(userTab)
}) 

searchTab.addEventListener('click',()=>{
  // passing clicked tab as parameter 
  switchTab(searchTab)
}) 

// check if coordinates are already present in the session storage 
function getfromSessionStrorage(){
  const localCoordinates= sessionStorage.getItem('user-coordinates') 
  if(!localCoordinates){ 
    // if coordinates are not availabe
    grantAccessConatiner.classList.add('active')
  } 
  else{
    const userCoordinates=JSON.parse(localCoordinates) 
    fetchUserWeatherInfo(userCoordinates)
  }
} 

 async function fetchUserWeatherInfo(coordinates){
  const {lat,lon}=coordinates; 
  // make grantAcces conatiner invisilbe 
  grantAccessConatiner.classList.remove('active') 
 
  // make loader visible 
  loadingScreen.classList.add('active') 
 
  // API call 

  try{
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`); 
    const data= await response.json() 
    loadingScreen.classList.remove('active') 
    userInfoContainer.classList.add('active') 
    renederWeatherInfo(data); 
    } 
    catch(err){
      loadingScreen.classList.remove('active')
    }
}
 
function renederWeatherInfo(weather){
  // fetching elemet 
  const cityName=document.querySelector('[data-cityName]') 
  const countryIcon=document.querySelector('[data-countryIcon]') 
  const desc=document.querySelector('[data-weatherDesc]') 
  const weatherIcon=document.querySelector('[data-weatherIcon]') 
  const windSpeed=document.querySelector('[data-windSpeed]') 
  const temperature=document.querySelector('[data-temperature]')  
  const humidity=document.querySelector('[data-humidity]')  
  const cloud=document.querySelector('[data-cloudiness]')
  // adding value to the element from fetched data
  cityName.innerText=weather?.name;  
  countryIcon.src=`https://flagcdn.com/48x36/${weather?.sys?.country.toLowerCase()}.png`
  desc.innerText=weather?.weather[0]?.description; 
  weatherIcon.src= `https:openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png` 
  temperature.innerText= `${weather?.main?.temp} °C`; 
  windSpeed.innerText=`${weather?.wind?.speed}m/s`; 
  cloud.innerText=`${weather?.clouds?.all}%`;  
  humidity.innerText=`${weather?.main?.humidity}%`;
  
  
}    
function getLocation(){
  if(navigator.geolocation){
   navigator.geolocation.getCurrentPosition(showPosition)
  } 
  else{
    alert('geolocation not supported')
  }
} 

function showPosition(position){ 
  const userCoordinates={
    lat:position.coords.latitude, 
    lon:position.coords.longitude
  }
  sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates)) 
  fetchUserWeatherInfo(userCoordinates)
}


const grantAccessbtn=document.querySelector('[ data-grantAccess]');  
grantAccessbtn.addEventListener('click',getLocation)
 

const searchInput=document.querySelector('[data-seachInput]')  

searchForm.addEventListener("submit",(e)=>{ 
  e.preventDefault()
  const cityName=searchInput.value  
  if(cityName==''){ 
    return; 
  } 
  else{
    fetchSearchWeatherInfo(cityName) 
    searchInput.value=''
  }
}) 
 
async function fetchSearchWeatherInfo(city){  
  loadingScreen.classList.add('active') 
  userContainer.classList.remove('active') 
  grantAccessConatiner.classList.remove('active') 

  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`) 
    const data= await response.json() 
    loadingScreen.classList.remove('active') 
    userInfoContainer.classList.add('active') 
    renederWeatherInfo(data)
  } 
  catch(err){
   loadingScreen.classList.remove('active') 
   userInfoContainer.classList.remove('active') 
   errorContainer.classList.add('active')
  }

}
