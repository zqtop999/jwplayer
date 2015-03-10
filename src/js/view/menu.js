define([
    'view/overlay',
    'view/touch',
    'events/events',
    'utils/helpers',
    'utils/css',
    'underscore'
], function(Overlay, Touch, events, utils, cssUtils, _) {

    var _css = cssUtils.css,
        MENU_CLASS = 'jwmenu',
        OPTION_CLASS = 'jwoption';

    /** HTML5 Overlay class **/
    var Menu = function(name, _id, skin, changeHandler) {
        var _changeHandler = changeHandler,
            _overlay = new Overlay(_id + '_overlay', skin),
            _settings = _.extend({
                fontcase: undefined,
                fontcolor: '#cccccc',
                fontsize: 11,
                fontweight: undefined,
                activecolor: '#ffffff',
                overcolor: '#ffffff'
            }, skin.getComponentSettings('tooltip')),
            _container = _createElement(MENU_CLASS),
            _options = [];

        _container.id = _id;

        var top = _getSkinElement('menuTop' + name),
            menuOption = _getSkinElement('menuOption'),
            menuOptionOver = _getSkinElement('menuOptionOver'),
            menuOptionActive = _getSkinElement('menuOptionActive');

        if (top && top.image) {
            var topImage = new Image();
            topImage.src = top.src;
            topImage.width = top.width;
            topImage.height = top.height;
            _container.appendChild(topImage);
        }

        if (menuOption) {
            var selector = '#' + _id + ' .' + OPTION_CLASS;

            _css(selector, _.extend(_formatBackground(menuOption), {
                height: menuOption.height,
                color: _settings.fontcolor,
                'padding-left': menuOption.width,
                font: _settings.fontweight + ' ' + _settings.fontsize + 'px Arial,Helvetica,sans-serif',
                'line-height': menuOption.height,
                'text-transform': (_settings.fontcase === 'upper') ? 'uppercase' : undefined
            }));
            _css(selector + ':hover', _.extend(_formatBackground(menuOptionOver), {
                color: _settings.overcolor
            }));
            _css(selector + '.active', _.extend(_formatBackground(menuOptionActive), {
                color: _settings.activecolor
            }));
        }
        _overlay.setContents(_container);

        function _formatBackground(elem) {
            if (!(elem && elem.src)) {
                return {};
            }
            return {
                background: 'url(' + elem.src + ') no-repeat left',
                'background-size': elem.width + 'px ' + elem.height + 'px'
            };
        }

        this.element = function() {
            return _overlay.element();
        };

        this.addOption = function(label, value) {
            var option = _createElement(OPTION_CLASS, _container);
            option.id = _id + '_option_' + value;
            option.innerHTML = label;
            if (!utils.isMobile()) {
                option.addEventListener('click', _clickHandler(_options.length, value));
            } else {
                var optionTouch = new Touch(option);
                optionTouch.addEventListener(events.touchEvents.TAP, _clickHandler(_options.length, value));
            }
            _options.push(option);
        };

        function _clickHandler(index, value) {
            return function() {
                // Note :: for quality levels, this will set it active before it is actually changed
                _setActive(index);
                if (_changeHandler) {
                    _changeHandler(value);
                }
            };
        }

        this.clearOptions = function() {
            while (_options.length > 0) {
                _container.removeChild(_options.pop());
            }
        };

        var _setActive = this.setActive = function(index) {
            for (var i = 0; i < _options.length; i++) {
                var option = _options[i];
                option.className = option.className.replace(' active', '');
                if (i === index) {
                    option.className += ' active';
                }
            }
        };


        function _createElement(className, parent) {
            var elem = document.createElement('div');
            if (className) {
                elem.className = className;
            }
            if (parent) {
                parent.appendChild(elem);
            }
            return elem;
        }

        function _getSkinElement(name) {
            var elem = skin.getSkinElement('tooltip', name);
            return elem ? elem : {
                width: 0,
                height: 0,
                src: undefined
            };
        }

        this.show = _overlay.show;
        this.hide = _overlay.hide;
        this.offsetX = _overlay.offsetX;
        this.positionX = _overlay.positionX;
        this.constrainX = _overlay.constrainX;
    };

    function _class(className) {
        return '.' + className.replace(/ /g, ' .');
    }

    _css(_class(MENU_CLASS + ' ' + OPTION_CLASS), {
        cursor: 'pointer',
        'white-space': 'nowrap',
        position: 'relative'
    });

    return Menu;
});
