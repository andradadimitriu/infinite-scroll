import "./redditListItem.css";

function RedditListItem({thumbnail, title, url, subreddit}) {
    return <div className="reddit-list-item">
        <div>
            <div><a href={url}>{title}</a></div>
            <div>r/{subreddit}</div>
        </div>
        <div><img src={thumbnail} alt="Thumbnail"/></div>
    </div>;
}

export default RedditListItem;