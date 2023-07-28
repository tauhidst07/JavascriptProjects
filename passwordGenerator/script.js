const slider= document.querySelector("[data-lengthslider]"); 
const lengthDisplay= document.querySelector("[data-lengthNumber]") 
const displayPassword= document.querySelector("[data-displayPassword]") 
const copyMsg= document.querySelector("[data-copyMsg]")  
const copyBtn=document.querySelector("[data-copy]")
const uppercaseCheck=document.querySelector("#uppercase") 
const lowercaseCheck=document.querySelector("#lowercase") 
const numberCheck=document.querySelector("#number") 
const symbolCheck=document.querySelector("#symbol") 
const indicator= document.querySelector("[data-strengthIndicator]") 
const generateBtn=document.querySelector(".generate-button") 
const allCheckBox=document.querySelectorAll("input[type=checkbox]") 

const symbols='~`!@#$%^&*()_-+={}[]\|?/";:<>,.'
let password=""; 
let passwordLength=10;  
let checkCount=0 

setIndicator("#ccc") 

console.log(slider.min,slider.max)

function handleSlider(){
    slider.value= passwordLength; 
    lengthDisplay.innerText=passwordLength  
    const min= slider.min; 
    const max= slider.max;
    slider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"; 
    
}  
handleSlider();  

function setIndicator(color){
    indicator.style.backgroundColor=color; 
    indicator.style.boxShadow= `0px 0px 10px 1px ${color}`; 
} 
function handleCheckBoxChange(){
    checkCount=0; 
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    }) 
    if(passwordLength<checkCount){
        passwordLength=checkCount 
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min
}  

function generateNumbers(){
    return getRndInteger(0,10)
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91))
} 

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123))
}  

function generateSymbol(){
   return symbols.charAt(getRndInteger(0,symbols.length))
}

function calcStrength(){
    let hasUpper= false 
    let hasLower= false 
    let hasSymbol=false 
    let hasNumber=false 
   
    if(uppercaseCheck.checked) {hasUpper=true} 
    if(lowercaseCheck.checked) {hasLower=true} 
    if(symbolCheck.checked) {hasSymbol=true} 
    if(numberCheck.checked){hasNumber=true} 

    if(hasUpper && hasLower ||(hasNumber || hasSymbol) && password.length>=8){
        setIndicator("#0f0")
    } 

   else if(hasUpper || hasLower &&(hasNumber || hasSymbol) && password.length>=6){
        setIndicator("#ff0")
    } 
    else{
        setIndicator("#f00")
    } 

 }
 
 async function copyContent(){
    try{
        await navigator.clipboard.writeText(displayPassword.value) 
        copyMsg.innerText="Copied"
    } 
    catch(e){
       copyMsg.innerText="Failed"
    } 
    copyMsg.classList.add('active') 
    setTimeout(() => {
        copyMsg.classList.remove('active')
    }, 2000);
 }  

 function shufflePassword(arr){ 
   for(let i=arr.length-1;i>0;i--){
    let j= Math.floor(Math.random()*(i+1)) 
    let temp=arr[i] 
    arr[i]=arr[j]  
    arr[j]=temp
   }  
   let str="" 
   arr.forEach((ele)=>str+=ele) 
   return str
}
 

 slider.addEventListener('input',(e)=>{
   passwordLength=e.target.value; 
   handleSlider();
 }) 

 copyBtn.addEventListener('click',()=>{
    if(displayPassword.value){
        copyContent();
    }
 }) 

 generateBtn.addEventListener('click',()=>{
    if(checkCount<=0){ 
        displayPassword.value=""
        return
    } 
    if(passwordLength<checkCount){
        passwordLength=checkCount 
        handleSlider()
    }  

    password=""  

    let funcArr=[]

    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }  
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }  
    // if(numberCheck.checked){
    //     password+=generateNumbers();
    // }  
    // if(symbolCheck.checked){
    //     password+=generateSymbol();
    // }  

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase)
    }  
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase)
    }  

    if(numberCheck.checked){
       funcArr.push(generateNumbers)
    }  
      
    if(symbolCheck.checked){
        funcArr.push(generateSymbol)
    }   

    // compulsory Addition 

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    } 

    // remaining Addition
   
    for(let i=0; i<passwordLength-funcArr.length;i++){
       let randomIndex= getRndInteger(0,funcArr.length) 
       password+= funcArr[randomIndex]();
    } 

    password= shufflePassword(Array.from(password)); 

    displayPassword.value=password
     calcStrength()

       
 })