import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import illustrationImg from '../assets/images/ghost.png';
import logoImg from '../assets/images/web.png';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

// webpack (vite, snowpack) entiende importaciones de archivos en JS

export function NewRoom() {
  const { user } = useAuth()   
  const [newRoom, setNewRoom] = useState('');
    const navigate = useNavigate();
 

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })
    navigate(`/rooms/${firebaseRoom.key}`);
  }

    
  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustración sinbolizando preguntas y respuestas"/>
        <strong>EduCode: salas de discusión</strong>
        <p>Responde en tiempo real</p>
      </aside>
      <main>
        <div className="main-content">
        <img src={logoImg} alt="Pregunta-me"/>
        <h2>Crea una nueva sala</h2>
        <form onSubmit={handleCreateRoom}>
          <input 
          type="text" 
          placeholder="Nombre de la sala" 
          onChange={event => setNewRoom(event.target.value)} 
          value={newRoom}
          />
          <Button type="submit">Crear la sala</Button>

        </form>
        <p>Quieres entrar en una sala existente? <Link to="/">Haz click aquí</Link></p>
    </div>
    </main>
    </div>
  );
}