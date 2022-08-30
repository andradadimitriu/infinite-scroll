import "./redditListContainer.css";
import {useCallback, useEffect, useState} from "react";
import {getPosts} from "./redditService";
import ErrorDisplay from "./ErrorDisplay";
import RedditListItem from "./RedditListItem";
function RedditListContainer() {
    const [posts, setPosts] = useState(undefined);
    const [after, setAfter] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [loadMore,setLoadMore] = useState(false);
    const handleScroll = useCallback(()=>{
        if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.offsetHeight || loadMore)
            return;
        setLoadMore(true)}, [setLoadMore, loadMore]);

    useEffect(() => {
        (async function () {
            if(posts && !loadMore) return;
            const newPosts = await getPosts(after);
            if (newPosts.error) {
                setError(newPosts.error);
                return;
            }
            setAfter(newPosts.after);
            const allPosts = (posts ? posts:[]).concat(newPosts.posts);
            setPosts(allPosts);
            setLoadMore(false);
        })();
    }, [setPosts, setPosts, setLoadMore, setAfter, loadMore, after, posts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    },)

    return error ? <ErrorDisplay/> :
        <div className="reddit-list-container">
            {posts && posts.map((post, key) => <RedditListItem
                key={key}
                title={post.data.title}
                subreddit={post.data.subreddit}
                url={post.data.url}
                thumbnail={post.data.thumbnail}
            />)}
            {loadMore && <div className="loading">Loading more...</div>}
        </div>;
}

export default RedditListContainer;
