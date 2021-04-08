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

  // Escuchar mensajes
  socket.on('recive-msg', () => {
    // TODO:
  });

  // Escuchar un mensaje privado
  socket.on('private-msg', () => {
    // TODO:
  });

  // Escuchar usuarios activos
  socket.on('active-users', drawUsers);
};

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

const main = async () => {
  // Validar JWT token
  await validateJWT();
};

main();
