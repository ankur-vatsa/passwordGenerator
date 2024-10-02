const passwordHistoryList = [];

function generatePassword() {
    const length = parseInt(document.getElementById("passLength").value);
    const includeUppercase = document.getElementById("uppercase").checked;
    const includeLowercase = document.getElementById("lowercase").checked;
    const includeNumbers = document.getElementById("numbers").checked;
    const includeSymbols = document.getElementById("special").checked;

    let allowedChar = "";
    let password = "";

    const upperCase = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
    const lowerCase = `abcdefghijklmnopqrstuvwxyz`;
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+=-\\<>?,./~";

    allowedChar += includeUppercase ? upperCase : '';
    allowedChar += includeLowercase ? lowerCase : '';
    allowedChar += includeNumbers ? numbers : '';
    allowedChar += includeSymbols ? symbols : '';
    
    if (length === 0) {
        alert("Password length cannot be zero");
        return;
    }
    if (allowedChar.length === 0) {
        alert("No character set selected to generate password");
        return;
    }
    
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * allowedChar.length);
        password += allowedChar[index];
    }

    document.getElementById("password").value = password;

    // Call password strength evaluation
    evaluatePasswordStrength(password);

    // Add the password to the history list
    addToHistory(password);
}

// Function to evaluate password strength and change the color accordingly
function evaluatePasswordStrength(password) {
    let strength = 0;

    // Add points for different criteria
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Display the strength text
    let strengthText = "";
    let strengthClass = "";

    if (strength === 0) {
        strengthText = "Very Weak";
        strengthClass = "very-weak";
    } else if (strength === 1) {
        strengthText = "Weak";
        strengthClass = "weak";
    } else if (strength === 2) {
        strengthText = "Moderate";
        strengthClass = "moderate";
    } else if (strength === 3) {
        strengthText = "Strong";
        strengthClass = "strong";
    } else if (strength >= 4) {
        strengthText = "Very Strong";
        strengthClass = "very-strong";
    }

    const strengthElement = document.getElementById("passwordStrength");
    strengthElement.textContent = strengthText;

    // Remove all previous strength classes
    strengthElement.classList.remove("very-weak", "weak", "moderate", "strong", "very-strong");

    // Add the current strength class
    strengthElement.classList.add(strengthClass);
}


function addToHistory(password) {
    const timestamp = new Date().toLocaleString();
    console.log(`Adding password: ${password} at ${timestamp}`);

    // Add the password and timestamp to the history list
    passwordHistoryList.unshift(`Password: ${password} - Generated at: ${timestamp}`);

    // Display the latest 3 passwords
    const historyListElement = document.getElementById("passwordHistoryList");
    console.log(historyListElement);  // Log the element to check if it's being selected

    if (!historyListElement) {
        console.error("Password history list element not found.");
        return;
    }

    historyListElement.innerHTML = ""; // Clear previous list

    passwordHistoryList.slice(0, 3).forEach(pwd => {
        const li = document.createElement('li');
        li.textContent = pwd;
        historyListElement.appendChild(li);
    });
}


document.getElementById("showPassword").addEventListener("change", function() {
    const passwordField = document.getElementById("password");
    if (this.checked) {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
});
