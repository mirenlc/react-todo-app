import axios from "axios";

const api = axios.create({
baseURL: 'https://api.github.com',
headers:{
    Acept:'application/vnd.github.v3+json',
},
});

export const getIssues = async (token, owner, repo) => {
    const response = await api.get(`/repos/${owner}/${repo}/issues`, {
        headers: {
            Authorization: `token ${token}`,
        },
    });
    return response.data;
};

export const createIssue = async (token, owner, repo, issue) => {
    const response = await api.post(
        `/repos/${owner}/${repo}/issues`,
        issue,
        {headers: {
            Authorization: `token ${token}`,
        },
    }
    );
    return response.data;
}