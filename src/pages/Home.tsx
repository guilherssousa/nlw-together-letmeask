import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import illustrationImage from '../assets/images/illustration.svg'
import logoImage from '../assets/images/logo.svg'
import googleIconImage from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'

type HomeProps = {
    location: {
        state: {
            message: string;
        }
    }
}

const Home = ({ location }: HomeProps) => {
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')

    if(location.state?.message) {
        toast.success(location.state.message)
    }

    async function handleCreateRoom() {
        if(!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if(roomCode.trim() === '') return

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if(!roomRef.exists()) {
            alert('Room does not exists.')
            return
        }

        if(roomRef.val().endedAt) {
            alert('Room already closed.')
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    return (
        <div id='page-auth'>
            <Toaster
                position='top-left'
            />
            <aside>
                <img src={illustrationImage} alt='Ilustração simbolizando perguntas e respostas' />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire dúvidas da sua audiência em tempo real</p>
            </aside>

            <main>
                <div className='main-content'>
                    <img src={logoImage} alt='Letmeask' />
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImage} alt='Logo do Google' />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type='text'
                            placeholder='Digite o código da sala'
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Home