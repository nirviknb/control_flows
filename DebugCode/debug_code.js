function performOperation(){
    //Get user input from input fields
    let num1=parseInt(document.getElementById('input1').value);
    let num2=parseInt(document.getElementById('input2').value);
    //Check if inputs are valid numbers
    if(!isNaN(num1) && !isNaN(num2)){
        //perform the operation
        let result = `The Multiplication of the numbers is: ${multiply(num1,num2)}. The division of the number is: ${division(num1,num2)}. The addition of numbers is: ${addition(num1, num2)}. The substraction of numbers is: ${substract(num1,num2)}.`;
        //Display the result
        displayResult(result);
    } else{
        displayResult('Please enter valid number');
    }
}

function multiply(a,b){
    //introduce a debugger statement to pause execution
    debugger;

    //multiply the numbers
    return a*b;
}
function division(a,b){
    debugger;
    return a/2;
}

function substract(a,b){
    debugger;
    return a-b;
}

function addition(a,b){
    debugger;
    return a+b;
}

function displayResult(result){
    //displays result in the paragraph element
    const resultElement=document.getElementById('result');
    resultElement.textContent=result;
}