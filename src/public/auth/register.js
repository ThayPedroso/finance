const button = document.getElementById('submit')
button.addEventListener('click', async event => {
    const username = document.getElementById('inputUsername').value
    const email = document.getElementById('inputEmail').value
    const password = document.getElementById('inputPassword').value
    const confirmPassword = document.getElementById('inputConfirmPassword').value

    if (password !== confirmPassword) {
        alert("Passwords do not match, try again")
        return
    }

    const data = { username, email, password }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }
    const response = await fetch('/auth/register', options)
    const responseData = await response.json()
    console.log(responseData)
    alert(responseData)
})