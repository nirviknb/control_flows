let count =0
function increaseCount(){
    count++;
    displayCount();
    checkCountValue();
}

function displayCount(){
    document.getElementById('countDisplay').innerHTML=count;
}

function checkCountValue(){
    if(count===10){
        alert("Your Insta post gained 10 followers! Congrats!");
    }
    else if(count === 20){
        alert("Your insta post gained 20 followers! Congrats!");
    }
}
