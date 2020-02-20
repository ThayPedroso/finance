const button = document.getElementById('submit')
button.addEventListener('click', async event => {
    const email = document.getElementById('inputEmail').value
    const password = document.getElementById('inputPassword').value

    const data = { email, password }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }
    const response = await fetch('/auth/authenticate', options)
    const responseData = await response.json()
    console.log(responseData)
    alert(responseData)
})