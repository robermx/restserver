const loginForm = document.querySelector('#login');

const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/'
  : 'https://restserver-ra.herokuapp.com/api/auth/';

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = {};
  for (e of loginForm.elements) {
    if (e.name.length > 0) formData[e.name] = e.value;
  }
  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem('token', token);
      window.location = 'chat.html';
    })
    .catch((err) => {
      console.log(err);
    });
});

function onSignIn(googleUser) {
  // var profile = googleUser.getBasicProfile();
  // // Do not send to your backend! Use an ID token instead.
  // console.log('ID: ' + profile.getId());
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // // This is null if the 'email' scope is not present.
  // console.log('Email: ' + profile.getEmail());

  // id_token
  var id_token = googleUser.getAuthResponse().id_token;
  const data = { id_token };
  fetch(url + 'google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem('token', token);
      window.location = 'chat.html';
    })
    .catch(console.log());
}
