// import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import { database } from '../services/firebase'

import logoImage from '../assets/images/logo.svg'
import deleteImage from '../assets/images/delete.svg'
import checkImage from '../assets/images/check.svg'
import answerImage from '../assets/images/answer.svg'
import emptyQuestionsImage from '../assets/images/empty-questions.svg'

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

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }

    return (
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImage} alt='letmeask' />
                    <div>
                        <Button
                            isOutlined
                            onClick={handleEndRoom}
                        >Encerrar sala</Button>
                        <RoomCode code={roomId} />
                    </div>
                </div>
            </header>

            <main>
                <div className='room-title'>
                    <h1>{title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <div className='question-list'>
                    { questions.length > 0 ? questions.map(question => (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                        >   
                            { !question.isAnswered && (
                                <>
                                    <button
                                        type='button'
                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={checkImage} alt='Marcar como respondida' />
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => handleHighlightQuestion(question.id)}
                                    >
                                        <img src={answerImage} alt='Destacar pergunta' />
                                    </button>
                                </>
                            ) }
                            <button
                                type='button'
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImage} alt='Remover pergunta' />
                            </button>
                        </Question>
                    )) : (
                        <div className='no-message'>
                            <img src={emptyQuestionsImage} alt='Nenhuma mensagem para exibir' />
                            <p>Nenhuma mensagem para exibir.</p>
                        </div>
                    ) }
                </div>
            </main>
        </div>
    )
}

export default AdminRoom