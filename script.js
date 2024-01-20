document.addEventListener("DOMContentLoaded", function() {
    
    // Fetch JSON data from the file
    fetch('verdict.json')
        .then(response => response.json())
        .then(data => {
            displayVerificationStatus(data.verdict);
        })
        .catch(error => console.error('Error fetching JSON:', error));

    function displayVerificationStatus(verdict) {
        const verificationStatusElement = document.getElementById('verification-status');

        // Display the verification status message
        verificationStatusElement.textContent = verdict
            ? 'This file is Authentic'
            : 'This file is Forged';
        
        // Style the message
        verificationStatusElement.style.color = verdict ? 'green' : 'red';
        verificationStatusElement.style.fontWeight = 'bold';
    }
});
