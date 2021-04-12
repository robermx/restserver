const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/'
  : 'https://restserver-ra.herokuapp.com/api/auth/';

let user = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMsg = document.querySelector('#ulMsg');
const btnLogout = document.querySelector('#btnLogout');

// validar el token de localStorage.
const validateJWT = async () => {
  // Obtener token de localStorage.
  const token = localStorage.getItem('token') || '';
  if (token.length <= 10) {
    window.location = 'index.html';
    throw new Error('No hay token en el servidor');
  }
  // Llamar endpoint de api/auth.
  const resp = await fetch(url, {
    headers: { 'x-token': token },
  });

  const { user: userdb, token: tokendb } = await resp.json();
  localStorage.setItem('token', tokendb);
  user = userdb;
  document.title = user.nombre;
  await connectSocket();
};

const connectSocket = async () => {
  // Obtener token del localStorage.
  socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('token'),
    },
  });

  // Usuario conectado
  socket.on('connect', () => {
    console.log('socket online');
  });

  // Usuario desconectado
  socket.on('disconnect', () => {
    console.log('socket offline');
  });

  // Escuchar usuarios activos
  socket.on('active-users', drawUsers);

  // Escuchar mensajes
  socket.on('recive-msg', drawMsgs);

  // Escuchar un mensaje privado
  socket.on('private-msg', (payload) => {
    console.log(payload);
  });
};

// Ver usuarios conectados
const drawUsers = (users) => {
  let usersHTML = '';
  users.forEach(({ nombre, uid }) => {
    usersHTML += `
      <li>
        <p class="text-success mb-0">${nombre}</p>
        <small class="text-muted mb-2 d-block">${uid}</small>
      </li>
    `;
  });
  ulUsers.innerHTML = usersHTML;
};

// Ver los mensajes de chat
const drawMsgs = (msgs) => {
  let msgsHTML = '';
  msgs.forEach(({ name, msg }) => {
    msgsHTML += `
      <li>
        <p class="text-primary mb-0">${name}:
          <small class="text-muted mb-2">${msg}</small>
        </p>
      </li>
    `;
  });
  ulMsg.innerHTML = msgsHTML;
};

// Enviar mensaje
txtMsg.addEventListener('keyup', ({ keyCode }) => {
  const msg = txtMsg.value;
  const uid = txtUid.value;
  if (keyCode !== 13) return;
  if (msg.length === 0) return;

  socket.emit('sendMsg', { msg, uid });
  txtMsg.value = '';
});

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('token');

  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log('User signed out.');
    window.location = 'index.html';
  });
});

const main = async () => {
  // Validar JWT token
  await validateJWT();
};

(() => {
  gapi.load('auth2', () => {
    gapi.auth2.init();
    main();
  });
})();
