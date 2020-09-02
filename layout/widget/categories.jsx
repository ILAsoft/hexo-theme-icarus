const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Categories extends Component {
    renderCategories(categories) {
        return <ul class="menu-list">{categories.filter(category => typeof category === 'object').map(category => {
            return <li><a class="level is-mobile is-marginless" href={category.url}><span class="level-start"><span class="level-item">{category.name}</span></span><span class="level-end"><span class="level-item tag">{category.count}</span></span></a></li>;
        })}
        </ul>;
    }
    render() {
        const {
            title,
            showCount,
            categories
        } = this.props;
        return <div class="card widget">
            <div class="card-content">
                <a name={title} href="/categories/"><h3 class="menu-label">{title}</h3></a>
                    {this.renderCategories(categories)}
            </div>
        </div>;
    }
}

Categories.Cacheable = cacheComponent(Categories, 'widget.categories', function (props) {
    var page = props.page,
        helper = props.helper,
        _props$categories = props.categories,
        categories = _props$categories === void 0 ? props.site.categories : _props$categories,
        _props$orderBy = props.orderBy,
        orderBy = _props$orderBy === void 0 ? 'name' : _props$orderBy,
        _props$order = props.order,
        order = _props$order === void 0 ? 1 : _props$order,
        _props$showCurrent = props.showCurrent,
        showCurrent = _props$showCurrent === void 0 ? false : _props$showCurrent,
        _props$showCount = props.showCount,
        showCount = _props$showCount === void 0 ? true : _props$showCount;
    var url_for = helper.url_for,
        _p = helper._p;

    if (!categories || !categories.length) {
        return null;
    }

    var depth = 0;

    try {
        depth = parseInt(props.depth, 10);
    } catch (e) { }

    function prepareQuery(parent) {
        var query = {};

        if (parent) {
            query.parent = parent;
        } else {
            query.parent = {
                $exists: false
            };
        }

        return categories.find(query).sort(orderBy, order).filter(function (cat) {
            return cat.length;
        });
    }

    function hierarchicalList(level, parent) {
        return prepareQuery(parent).map(function (cat, i) {
            var children = [];

            if (!depth || level + 1 < depth) {
                children = hierarchicalList(level + 1, cat._id);
            }

            var isCurrent = false;

            if (showCurrent && page) {
                for (var j = 0; j < cat.length; j++) {
                    var post = cat.posts.data[j];

                    if (post && post._id === page._id) {
                        isCurrent = true;
                        break;
                    }
                } // special case: category page


                isCurrent = isCurrent || page.base && page.base.startsWith(cat.path);
            }

            return {
                children: children,
                isCurrent: isCurrent,
                name: cat.name,
                count: cat.length,
                url: url_for(cat.path)
            };
        });
    }

    return {
        showCount: showCount,
        categories: hierarchicalList(0),
        title: _p('common.category', Infinity)
    };
});
module.exports = Categories;
