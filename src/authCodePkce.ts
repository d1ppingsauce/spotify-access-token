export const redirectToAuthCodeFlow = async (clientId: string) => {
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)

  localStorage.setItem("verifier", verifier)

  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("response_type", "code")
  params.append("redirect_uri", "http://localhost:5173/callback")
  params.append("scope", "user-read-currently-playing user-read-playback-state")
  params.append("code_challenge_method", "S256")
  params.append("code_challenge", challenge)

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

export const getAccessToken = async (clientId: string, code: string) => {
  const verifier = localStorage.getItem("verifier")

  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("redirect_uri", "http://localhost:5173/callback")
  params.append("code_verifier", verifier!)

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  })

  const { access_token } = await result.json()
  return access_token
}

const generateCodeVerifier = (length: number) => {
  let text = ""
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const generateCodeChallenge = async (codeVerifier: string) => {
  function base64encode(string: ArrayBuffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest("SHA-256", data)

  return base64encode(digest)
}
