const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Tags extends Component {
    renderTags(tags) {
        return <div class="field is-grouped is-grouped-multiline">{tags.filter(tag => typeof tag === 'object').map(tag => {
            return <div class="control"><a class="tags has-addons" href={tag.url}><span class="tag">{tag.name}</span><span class="tag is-grey-lightest">{tag.count}</span></a></div>;
        })}
        </div>;
    }
    render() {
        const {
            showCount,
            title,
            tags
        } = this.props;
        return <div class="card widget">
            <div class="card-content">
                <div class="menu">
                    <a name={title} href="/tags/"><h3 class="menu-label">{title}</h3></a>
                    {this.renderTags(tags)}
                </div>
            </div>
        </div>;
    }
}

Tags.Cacheable = cacheComponent(Tags, 'widget.tags', function (props) {
    var helper = props.helper,
        _props$orderBy = props.orderBy,
        orderBy = _props$orderBy === void 0 ? 'name' : _props$orderBy,
        _props$order = props.order,
        order = _props$order === void 0 ? 1 : _props$order,
        amount = props.amount,
        _props$showCount = props.showCount,
        showCount = _props$showCount === void 0 ? true : _props$showCount;
    var tags = props.tags || props.site.tags;
    var url_for = helper.url_for,
        _p = helper._p;

    if (!tags || !tags.length) {
        return null;
    }

    tags = tags.sort(orderBy, order).filter(function (tag) {
        return tag.length;
    });

    if (amount) {
        tags = tags.limit(amount);
    }

    return {
        showCount: showCount,
        title: _p('common.tag', Infinity),
        tags: tags.map(function (tag) {
            return {
                name: tag.name,
                count: tag.length,
                url: url_for(tag.path)
            };
        })
    };
});
module.exports = Tags;
