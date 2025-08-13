import { useNavigate, useParams } from 'react-router-dom';

import logoImg from '../assets/images/web.png';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';


type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId!)

  async function handleEndRoom(){
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    navigate('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Estas seguro que quiere eliminar esta pregunta?')) {
       await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
           await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
           })
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
    })
  }

  return(
    <div id="page-room">
      <header>
        <div className='content'>
          <img src={logoImg} alt="Pregunta-me" />
          <div className=''>
            <RoomCode code={roomId!} />
          <Button isOutlined onClick={handleEndRoom}>Cerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala: {title}</h1>
          { questions.length > 0 && <span>{questions.length} preguntas</span>}
        </div>


        <div className="question-list">
          {questions.map(question => {
          return(
            <Question 
            key={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                <button
              type="button"
              onClick={() => handleCheckQuestionAsAnswered(question.id)}
              >
                <img src={checkImg} alt="Marcar preguntas como respondida"/>
              </button>

              <button
              type="button"
              onClick={() => handleHighLightQuestion(question.id)}
              >
                <img src={answerImg} alt="Da destaque a la pregunta"/>
              </button>
              </>
              )}

              <button
              type="button"
              onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Eliminar pregunta"/>
              </button>
            </Question>
            
          )
        })}
        </div>

      </main>
    </div>
   )
}
