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
        if (Math.abs(window.innerHeight + document.documentElement.scrollTop - document.documentElement.offsetHeight) >= 1 || loadMore)
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
    }, [setPosts, setLoadMore, setAfter, loadMore, after, posts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousewheel', handleScroll);
        return ()=>{
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousewheel', handleScroll);
        }
    },[handleScroll])

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
