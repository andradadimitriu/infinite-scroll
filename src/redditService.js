const LIMIT = 25;
const sorting = Object.freeze({TOP: "top"});

const REDDIT_AWW_URL = `https://api.reddit.com/r/aww`

export async function getPosts(after, count){
        return fetch(`${REDDIT_AWW_URL}/${process.env.REACT_APP_SORT || sorting.TOP}.json?limit=${LIMIT}${after?`&after=${after}`:""}${count?`&count=${count}`:""}`)
            .then(response => {
                if(response.ok) return response.json();
                return Promise.reject(response);
            })
            .then((json) => {
                return {after: json.data.after, posts: json.data.children};
            })
            .catch((error) => {
                console.log(`err:${error}`);
                return {error};
            });
}