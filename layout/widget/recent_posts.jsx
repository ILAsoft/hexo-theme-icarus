const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class RecentPosts extends Component {
    renderCategories(categories) {
        return <div>{categories.filter(category => typeof category === 'object').map(category => {
        return <a class="link-muted" href={category.url}>/{category.name}</a>;
        })}
        </div>;
    }

    renderPosts(posts) {
        return <div>{posts.filter(post => typeof post === 'object').map(post => {
        return <article class="media"><div class="media-content size-small">{post.categories=="TWEET" ? <p><time datetime={post.dateXml}>{post.date}</time></p> : null}<p class="title is-6"><a class="link-muted" href={post.url}>{post.title}</a></p><p class="is-uppercase">{this.renderCategories(post.categories)}</p></div></article>;
        })}
        </div>;
    }
    render() {
        const {
            title,
            posts
        } = this.props;
        return <div class="card widget">
            <div class="card-content">
                <a name={title} href="/archives/" class="menu-label">{title}</a>
                {this.renderPosts(posts)}
            </div>
        </div>;
    }
}

RecentPosts.Cacheable = cacheComponent(RecentPosts, 'widget.recentposts', function (props) {
    var site = props.site,
        helper = props.helper,
        _props$limit = props.limit,
        limit = _props$limit === void 0 ? 5 : _props$limit;
    var has_thumbnail = helper.has_thumbnail,
        get_thumbnail = helper.get_thumbnail,
        url_for = helper.url_for,
        __ = helper.__,
        date_xml = helper.date_xml,
        date = helper.date;

    if (!site.posts.length) {
        return null;
    }

    var posts = site.posts.sort('date', -1).limit(limit).map(function (post) {
        return {
            url: url_for(post.link || post.path),
            title: post.title,
            date: date(post.date),
            dateXml: date_xml(post.date),
            categories: post.categories.map(function (category) {
                return {
                    name: category.name,
                    url: url_for(category.path)
                };
            })
        };
    });
    return {
        posts: posts,
        title: __('widget.recents')
    };
});
module.exports = RecentPosts;
