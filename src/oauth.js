import axios from 'axios';
const CLIENT_ID = 'Ov23liHGFpSE1f6LJyYK';
const CLIENT_SECRET = 'b97248fc4b5cf5fab6b409d597cea3c300be696b';
const REDIRECT_URI = 'http://localhost:3000/'

export const getGitHubAuthUrl = () => {
    return `https://github.com/login/oauth/authorie?client_id=${CLIENT_ID}&redirect?uri=${REDIRECT_URI}`
};

export const getAccessToken = async (code) => {
    const response = await axios.post(
        'https://github.com/login/oauth/acces_token',
        {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI
        },
        {headers:{Accept: 'application/json'},}
    );
    return response.data.acces_token;
}