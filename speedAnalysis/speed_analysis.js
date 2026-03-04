let testText="The quick brown fox jumps over the lazy dog.";
let startTime, endTime;

function startTest(){
    //Set the test text. Paila inputtext ko value testText ma saryo
    document.getElementById('inputText').value=testText;

    //Reset user input and output
    let userInput=document.getElementById("userInput");
    userInput.value="";
    userInput.readOnly=false;
    userInput.focus();

    document.getElementById('output').innerHTML="";

    //Start Timer test start garreko time lai capture gareko
    startTime= new Date().getTime();

}

function endTest(){
    //Capturing the current time of when the test ends
    endTime= new Date().getTime();

    //Disable user input. This prevents user from typing after the test is complete
    document.getElementById('userInput').readOnly=true;

    //Calculate the time elapsed and words per minute (WPM)
    var timeElapsed=(endTime -startTime)/1000; //in seconds (the difference for endTime and startTime is calculated in milliseconds so to convert to seconds /1000)
    //retrieving user's text from the input area into userTypedText
    var userTypedText=document.getElementById('userInput').value;

    //Split the text using regex to count words  correctly

    //split(/\s+/) is regex(regular expression) which splits the input text to consider wods separated by spaces, tabs or newlines
    //filtering ensure counting valid words, excluding empty strings
    var typedWords=userTypedText.split(/\s+/).filter(function(word){
        return word !=="";
    }).length;

    //Calculating word per minute WPM
    var wpm=0; //Default value

    //Checking if the timeElapsed is not zero and typedWords is a valid number
    if(timeElapsed !==0 && !isNaN(typedWords)){
        //formula for calculating WPM. Math.round() rounds the value to newrest whole number
        wpm=Math.round((typedWords/timeElapsed)*60);
    }

    //Display Results
    var outputDiv=document.getElementById('output');
    outputDiv.innerHTML="<h2>Typing Test Results:</h2>"+
    "<p>Words Typed: "+typedWords+"</p>"+
    "<p>Time Elapsed: "+timeElapsed.toFixed(2)+"seconds</p>"+
    "<p>Words Per Minute(WPM): "+wpm+"</p>";
    }