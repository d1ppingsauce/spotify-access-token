import { useEffect, useState } from 'react'
import './App.css'
import { redirectToAuthCodeFlow, getAccessToken } from './authCodePkce'

const App = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const [profile, setProfile] = useState()
  const [displayToken, setDisplayToken] = useState('')

  const getAuth = async () => {
    if (!code) {
      redirectToAuthCodeFlow(clientId)
    }
  }

  const getToken = async () => {
    if (!displayToken) {
      const accessToken = await getAccessToken(clientId, code as string)
      setDisplayToken(
        accessToken ? accessToken : 'There was a problem getting your token.'
      )
    }
  }

  const fetchProfile = async (token: string): Promise<any> => {
    const result = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })

    setProfile(await result.json())
    return await result.json()
  }

  return (
    <div className='App'>
      {!code ? (
        <button onClick={getAuth}>Authorize Spotify</button>
      ) : (
        <button onClick={getToken} disabled={!!displayToken}>
          Display Token
        </button>
      )}
      <div>{displayToken ? <div>{displayToken}</div> : ''}</div>
    </div>
  )
}

export default App
