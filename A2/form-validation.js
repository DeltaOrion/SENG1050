/** 
  * Form Validation
  * File: form-validation.js 
  * Author: Jacob Boyce
  * Date Created: 20/8/2021
  * 
  * This contains several generic methods to validating a form as well as the specific implmenetation
  * for this assessment. In most cases it would be better practice to have the physical validation files i.e validateRequired()
  * getErrors() in their own seperate files for encapsulation and to seperate the implementation from the API. 
  * 
  * The script works as follows. Take the actual results from the form in JSON (note all results should be a string) for example 
  * foo: "bar"
  * foo2: "bar2"
  * 
  * and then there is a set of validation requirements. For example 
  * foo: {
  *     required: true 
  *     length: 8
  * }
  * 
  * it then checcks that the actual results meet the corresponding requirements 
  * 
  * Once validated if the user makes any errors they are alerted with an alert() and the errors are printed underneath the relevant input fields 
*/

//object represents the format of the sales form html object. 
//This essentially makes provides a translation from the HTML objects
//to readable java code 
const saleForm = {
    name: "sale-form",

    //the actual html element id for each field 
    fields: {
        firstName: "fname",
        lastName: "lname",
        email: "email",
        carsSubmitted: "cars-sub",
        carsSoldLastFive: "sold-last-5",
        make: "cars-make",
        model: "cars-model",
        description: "description",
        capacity: "cars-capcity"

    },
    //validation requirements for each field
    validations: {
        firstName: { 
            required: true,  //this would mean that the first name is required, has a max length of 100 and must be alphabetic 
            lengthMax: 100,
            alphabetic: true,
        },

        lastName: {
            required: true, 
            lengthMax: 100,
            alphabetic: true
        },

        email: {
            required: true,
            //I unfortunately did not come up with the email regex monstrosity.
            regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            lengthMax: 255,
        },

        carsSubmitted: {
            //I highly doubt they have submitted 1000 cars in the past 
            numeric: true,
            lengthMax: 3,
        },

        carsSoldLastFive: {
            required: true
        },

        make: {
            //There are no car manufacturer names with 1 characters
            required: true,
            alphabetic: true,
            lengthMax: 40,
            lengthMin: 2,
        },

        model: {
            //no model for a car would have 1 letter. Some interesting models might have numbers in them
            //however
            required: true,
            alphanumeric: true,
            lengthMax: 40,
            lengthMin: 2,
        },

        description: {
            lengthMax: 600,
        },

        capacity: {
            lengthMax: 10,
            numeric: true
        }
        
    }
}


//When validated if the user makes an error the labels underneath the input fields are changed. The original messages underneath the labels are stored
//incase the user fixes up a mistake. If they fix a mistake then the 'you are incorrect' must be reverted. This stores all the original messages before
//any errors occur. 
let originalErrMsg = {};
let originalColor = "gray";
let firstSubmission = true;

function handleSubmit() {
    //convert submitted form into json object for easier handling
    const form = document.forms[saleForm.name];
    const submittedForm = {};
    //loop through the salesForm fields and get the actual results from the form 
    for (var key in saleForm.fields) {
        if (saleForm.fields.hasOwnProperty(key)) {
            console.log(key + " -> " + saleForm.fields[key]);
            const submission = form[saleForm.fields[key]].value;
            console.log(submission);
            submittedForm[key] = submission;
        }
    }
    //this will look somehting like 
    /*
     {
         foo: "bar"
         abc: "abc"
     }

    */

    //if this is their first submission save all the original error fields. 
    if(firstSubmission) {
        handleOriginalFields();
        firstSubmission = false;
    } else {
        //otherwise reset them for a new submission. If any errors occur later on they will be overwritten. 
        setOriginalFields();
    }
     
    //validate the form results. 
    const validation = validateForm(submittedForm);

    if(validation.valid) {
        //the form is correct
        return true;
    } else {
        //alert the user of the errors
        printErrors(validation.errors);
        return false; 
    }
}

function handleOriginalFields() {
    //for each field in the salesform retrieve the original message in the label
    //this is used to reset each time they submit incase the correct an error
    Object.entries(saleForm.fields).forEach(([property,field]) => {
        const fieldID = `#${getErrField(field)}`;
        const f = document.querySelector(fieldID);
        originalErrMsg[property] = f.innerHTML;
        originalColor = f.style.color;
        //get the physical message i.e the innerHTML and the color 
    });
}

function setOriginalFields() {
    //for all the fields replace the labels with what was originally
    //there changing both the color and the innerhtml. 
    Object.entries(originalErrMsg).forEach(([property,field]) => {
        const fieldID = `#${getErrField(saleForm.fields[property])}`
        const f = document.querySelector(fieldID);
        f.innerHTML = field;
        f.style.color = originalColor;
    })
}

//simple helper function for getting the error message label. 
function getErrField(field) {
    return `${field}_err`
}

function validateForm(submittedForm) {
    //retrieve all the errors in the form
    const errors = getErrors(saleForm.validations,submittedForm);
    //if there are no errors then the form is valid
    return {
        valid: Object.values(errors).every(error => error.length === 0),
        errors: errors
    }
}

function printErrors(errors) {
    //represents a list of all the errors in the form for the alert
    let overview = "";

    
    Object.entries(errors).forEach(([property,messages]) => {
        const fieldID = `#${getErrField(saleForm.fields[property])}`
        //if there is an error for this field
        if(messages[0]) {
            //update it with what they did wrong for said field
            const field = document.querySelector(fieldID);
            field.innerHTML = messages[0];
            field.style.color = "red";
        }
        //add all errors for the alert 
        messages.forEach(message => {
            overview += `${property} ${message} \n`;
        });
    }) 
    //alert with all the errors 
    alert(overview);
}

function getErrors(validations, object) {
    //for each validation requirement in validations 
    return Object.entries(validations).reduce((errors,[property,requirements]) => {
        //prepare a list of errors for this validationn 
        errors[property] = []
        //if this validation has the required property then check if the field was entered by the user 
        /* foo: {
         *      required: true  <--- checks if this exists
                lengthMax: 10
         *  }
         */
    
        if(requirements.required) {
            const errMessage = validateRequiredMessage(object[property])
            if(errMessage) errors[property].push(errMessage);
        }

        //if this validation has the required property then check if the field was entered by the user 
        /* foo: {
         *      required: true  
                lengthMax: 10 <--- checks if this exists
         *  }
         */

        if(requirements.lengthMax) {
            const errMessage = validateMaxLength(object[property],requirements.lengthMax);
            if(errMessage) errors[property].push(errMessage);
        }  
        
        if(requirements.lengthMin) {
            const errMessage = validateMinLength(object[property],requirements.lengthMin);
            if(errMessage) errors[property].push(errMessage);
        }   

        if(requirements.alphanumeric) {
            const errMessage = validateAlphanumeric(object[property]);
            if(errMessage) errors[property].push(errMessage);
        }

        if(requirements.alphabetic) {
            const errMessage = validateAlphabetic(object[property]);
            if(errMessage) errors[property].push(errMessage);
        }

        if(requirements.numeric) {
            const errMessage = validateNumeric(object[property]);
            if(errMessage) errors[property].push(errMessage);
        }

        if(requirements.regex) {
            const errMessage = validateRegex(object[property],requirements.regex);
            if(errMessage) errors[property].push(errMessage);
        }
        

        return errors;
    },{});
}
//helper validation functions 
function validateRequiredMessage(value) {
    if(value.length!==0) return null;

    return 'is required'
}

function validateMaxLength(value,length) {
    if(value==null) return;
    if(value.length <=length) return;

    return `must be ${length} or less characters`;
}

function validateMinLength(value, length) {
    if(value==null) return;
    if(value.length >= length) return;

    return `must be ${length} or more characters`
}

function validateAlphanumeric(value) {
    if(value==null) return;

    for (let i=0; i < value.length; i++) {
        char = value.charCodeAt(i);
        if(
            !(char>47 && char < 58) && // numeric (0-9)
            !(char > 64 && char < 91) && // upper alpha (A-Z)
            !(char > 96 && char < 123) // lower alpha (a-z)
        ) return "must not contain special characters such as & ( or ^";
    }
    return; 
}

function validateAlphabetic(value) {
    if(value==null) return;

    for (let i=0; i < value.length; i++) {
        char = value.charCodeAt(i);
        if(
            !(char > 64 && char < 91) && // upper alpha (A-Z)
            !(char > 96 && char < 123)  // lower alpha (a-z)
        ) return "must only contain letters (a-z)";
    }
    return; 
}

function validateNumeric(value) {
    if(value==null) return;

    for (let i=0; i < value.length; i++) {
        char = value.charCodeAt(i);
        if(
            !(char>47 && char < 58) // numeric (0-9)
        ) return "must only contain numbers";
    }
    return; 
}

function validateRegex(value, regex) {
    if(value==null) return;

    if(regex.test(value.toLowerCase())) {
        return;
    } else {
        return "is not valid";
    }
}


