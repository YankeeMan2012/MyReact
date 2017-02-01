window.ee = new EventEmitter();

let my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];


let Article = React.createClass({
    getInitialState: function () {
        return {
            visible: false
        }
    },

    readMoreClick: function (e) {
        e.preventDefault();
        this.setState({visible: true});
    },

    render: function () {
        let author = this.props.data.author;
        let text = this.props.data.text;
        let bigText = this.props.data.bigText;
        let visible = this.state.visible;

        return (
            <div className="article">
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>
                <a href="#"
                   onClick={this.readMoreClick}
                   className={'news__readmore ' + (visible ? 'none' : '')}>
                   Подробнее
                </a>
                <p className={'news__big-text ' + (visible ? '' : 'none')}>{bigText}</p>
            </div>
        );
    }
});

let News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    render: function () {
        let data = this.props.data;
        let newsTemplate;
        if (data.length > 0) {
            newsTemplate = data.map(function (item, index) {

                return (
                    <div key={index}>
                        <Article data={item} />
                    </div>
                );
            });
        } else {
            newsTemplate = <p>К сожалению новостей нет</p>
        }

        return (
            <div className="news">
                {newsTemplate}
                <strong
                    className={'news__count ' + (data.length > 0 ? '' : 'none') }>
                    Всего новостей: {data.length}
                </strong>
            </div>
        );
    }
});

let Add = React.createClass({
    getInitialState: function () {
        return {
            disabled: true,
            isEmptyAuthor: true,
            isEmptyText: true
        }
    },

    onFieldChange: function (fieldName, e) {
        var isEmpty = e.target.value.trim().length > 0;
        if (isEmpty) {
            this.setState({ [''+fieldName]: false });
        } else {
            this.setState({ [''+fieldName]: true });
        }
    },

    componentDidMount: function () {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },

    onBtnClickHandler: function (e) {
        e.preventDefault();
        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var textEl = ReactDOM.findDOMNode(this.refs.text);
        var text = textEl.value;
        var item = [{
            author: author,
            text: text,
            bigText: '...'
        }];
        window.ee.emit('News.add', item);
        textEl.value = '';
        this.setState({isEmptyText: true});
    },

    onChangeRuleClick: function () {
        this.setState({disabled: !this.state.disabled});
    },

    render: function () {
        var agree = this.state.disabled;
        var emptyAuthor = this.state.isEmptyAuthor;
        var emptyText = this.state.isEmptyText;
        return (
            <form className="add cf">
                <input
                    type="text"
                    className="add__author"
                    dafaultValue=""
                    placeholder="Ваше имя"
                    ref="author"
                    onChange={this.onFieldChange.bind(this, 'isEmptyAuthor')}
                />
                <textarea
                    className="add__text"
                    defaultValue=""
                    placeholder="Текст новости"
                    ref='text'
                    onChange={this.onFieldChange.bind(this, 'isEmptyText')}
                ></textarea>
                <label htmlFor="agree">
                    <input
                        type="checkbox"
                        ref="checkrule"
                        onChange={this.onChangeRuleClick}
                    />я согласен с правилами
                </label>
                <button
                    className="add__btn"
                    onClick={this.onBtnClickHandler}
                    ref="alert_button"
                    disabled = {agree || emptyAuthor || emptyText}>
                    Добавить новость!
                </button>
            </form>
        );
    }
});

let App = React.createClass({
    getInitialState: function () {
        return {
            news: my_news
        }
    },

    componentDidMount:function () {
        var self = this;
        window.ee.addListener('News.add', function (item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        })
    },

    componentWillUnmount: function () {
        window.ee.removeListener('News.add');
    },

    render: function () {

        return (
            <div className="app">
                <h3>Новости</h3>
                <Add />
                <News data={this.state.news}/>
            </div>
        );
    }
});


ReactDOM.render(
    <App />,
    document.getElementById('root')
);
