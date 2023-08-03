import {useEffect, useState} from 'react'
import './App.css'
import {redirectToAuthCodeFlow, getAccessToken} from './authCodePkce'

const App = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const [profile, setProfile] = useState()
    const [refreshToken, setRefreshToken] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [displayToken, setDisplayToken] = useState('')

    const getAuth = async () => {
        if (!code) {
            redirectToAuthCodeFlow(clientId)
        }
    }

    const getToken = async () => {
        if (!refreshToken || !accessToken) {
            const tokens = await getAccessToken(clientId, code as string)
            if (tokens[0] != undefined) {
                console.log(tokens)
                setAccessToken(tokens[0])
                setRefreshToken(tokens[1])
            } else {
                alert('The Authorization Code has expired. Please reauthorize the application')
                window.location = window.location.pathname

            }
        }
    }

    const copyToClipboard = (token: string) => {
        navigator.clipboard.writeText(token);
        alert('Token copied to clipboard.')
    }


    return (
        <div className='App'>
            {!code ? (
                <button onClick={getAuth}>Authorize Spotify</button>
            ) : (
                !refreshToken || !accessToken ?
                    <button onClick={getToken} disabled={!!displayToken}>
                        Get Token
                    </button> : (
                        <div>
                            <button onClick={() => copyToClipboard(accessToken)}>
                                Copy AccessToken to Clipboard
                            </button>
                            <button onClick={() => copyToClipboard(refreshToken)}>
                                Copy RefreshToken to Clipboard
                            </button>
                        </div>
                    )
            )}
        </div>
    )
}

export default App


