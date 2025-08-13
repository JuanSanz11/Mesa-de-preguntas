import { useNavigate } from 'react-router-dom';

import illustrationImg from '../assets/images/web.png';
import logoImg from '../assets/images/ghost.png';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

// webpack (vite, snowpack) entiende importaciones de archivos en JS

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }
   navigate('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Esta sala no existe.');
      return;
    }

    if(roomRef.val().endedAt) {
      alert('Sala cerrada');
      return;
    }
    navigate(`/rooms/${roomCode}`);  
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustración sinbolizando preguntas y respuestas"/>
        <strong>EduCode</strong>
        <p>Aprende a programar con preguntas inteligentes</p>
      </aside>
      <main>
        <div className="main-content">
        <img src={logoImg} alt="Pregunta-me"/>
        <button onClick={handleCreateRoom} className='create-room'>
          <img src={googleIconImg} alt="Logo de Google"/>
          Crea una sala con Google
        </button>
        <div className='separator'>o entra en una sala</div>
        <form onSubmit={handleJoinRoom}>
          <input 
          type="text" 
          placeholder="Ingresa el código de la sala"
          onChange={event => setRoomCode(event.target.value)}
          value={roomCode}
          />
          <Button type="submit">Entrar en la sala</Button>
        </form>
    </div>
    </main>
    </div>
  );
}