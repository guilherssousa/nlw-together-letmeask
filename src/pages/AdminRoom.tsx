// import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import { database } from '../services/firebase'

import logoImage from '../assets/images/logo.svg'
import deleteImage from '../assets/images/delete.svg'

import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'
import { Question } from '../components/Question'

import '../styles/room.scss'

type RoomParams = {
    id: string;
}

const AdminRoom = () => {
    // const { user } = useAuth()
    const history = useHistory()
    const { id: roomId } = useParams<RoomParams>()

    const { title, questions } = useRoom(roomId)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImage} alt='letmeask' />
                    <div>
                        <RoomCode code={roomId} />
                        <Button
                            isOutlined
                            onClick={handleEndRoom}
                        >Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className='room-title'>
                    <h1>{title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <div className='question-list'>
                    { questions.map(question => (
                        <Question
                            content={question.content}
                            author={question.author}
                            key={question.id}
                        >
                            <button
                                type='button'
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImage} alt='Remover pergunta' />
                            </button>
                        </Question>
                    )) }
                </div>
            </main>
        </div>
    )
}

export default AdminRoom