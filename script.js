const usertab=document.querySelector("[data-userweather]");
const searchtab=document.querySelector("[data-searchweather]");
const usercont=document.querySelector(".weather-container");

const grant=document.querySelector(".grant-loc-container");
const searchform=document.querySelector("[data-searchform]");
const loading=document.querySelector(".loading-container");
const userinfo=document.querySelector(".user-info-container");

let currenttab=usertab;
const API_KEY="f035dd8d5535accca2ea112fd84dd98e";
currenttab.classList.add("current-tab");

function showposition(position){
    const usercoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    console.log("hello");
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchinfo(usercoordinates);
}
const text=document.querySelector("[error-text]");
const grantbtn=document.querySelector("[data-grant]");
getStorage();
grantbtn.addEventListener("click",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
        console.log("hello3");
    }
    else{
        alert("not found");
    }
})

function getStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grant.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchinfo(coordinates);
        
    }
}

function switchtab(clickedtab){
    err.classList.remove("active");
    text.classList.remove("active");
    if(currenttab!=clickedtab){
     currenttab.classList.remove("current-tab");
     clickedtab.classList.add("current-tab");
     currenttab=clickedtab;
     if(!searchform.classList.contains("active")){
         grant.classList.remove("active")
         searchform.classList.add("active");
         userinfo.classList.remove("active");
     }
     else{
         userinfo.classList.remove("active");
         searchform.classList.remove("active");
         getStorage();
     }
    }
   
    
 }

const searchinput=document.querySelector("[data-searchinput]");
searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    
    let cityName = searchinput.value;

    if(cityName === "")
        return;
    else 
     fetchweatherinfo(searchinput.value);

});


async function fetchinfo(coordinates){
    grant.classList.remove("active");
    const {lat,lon}=coordinates;
    loading.classList.add("active");

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        loading.classList.remove("active");
        userinfo.classList.add("active");
        render(data); 
    }
    catch(e){
    }
}

const err=document.querySelector("[error-img]");
async function fetchweatherinfo(city){
    loading.classList.add("active");
    userinfo.classList.remove("active");
    grant.classList.remove("active");

    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        loading.classList.remove("active");
        userinfo.classList.add("active");
        render(data);
    }
    catch(e){
        err.classList.add("active");
        text.classList.add("active")
        
    }
}

function render(data){
    const cityname=document.querySelector("[data-cityname]");
    const desc=document.querySelector("[data-weathericon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloud]");

    
    if (!data?.name || data.name === "undefined") {
        err.classList.add("active");
        userinfo.classList.remove("active");
        
        text.classList.add("active")
        return; // Exit the function early
    }  
    err.classList.remove("active");
    text.classList.remove("active")

    cityname.innerText=data?.name;   
    desc.innerText=data?.weather?.[0]?.description;
    temp.innerText=data?.main?.temp+" °C";
    windspeed.innerText=data?.wind?.speed+" Kmph";
    humidity.innerText=data?.main?.humidity+" %";
    cloudiness.innerText=data?.clouds?.all;
}
usertab.addEventListener("click",()=>{
    switchtab(usertab);
});
searchtab.addEventListener("click",()=>{
    switchtab(searchtab);
});