define([
    'view/components/extendable',
    'handlebars-loader!templates/slider.html',
    'utils/underscore',
    'utils/helpers'
], function(Extendable, SliderTemplate, _, utils) {

    var Slider = Extendable.extend({
        constructor : function(className, orientation) {
            this.className = className;
            this.orientation = orientation;

            this.mousedownlistener = this.dragStart.bind(this);
            this.mouseuplistener = this.dragEnd.bind(this);
            this.mousemovelistener = this.mouseMove.bind(this);

            this.setup();
        },
        setup : function() {
            var obj = {
                'default' : this.default,
                className : this.className,
                orientation : 'jw-slider-' + this.orientation
            };
            this.el = utils.createElement(SliderTemplate(obj));

            this.elementRail = this.el.getElementsByClassName('jw-rail-group')[0];
            this.elementBuffer = this.el.getElementsByClassName('jw-buffer')[0];
            this.elementProgress = this.el.getElementsByClassName('jw-progress')[0];
            this.elementThumb = this.el.getElementsByClassName('jw-thumb')[0];

            this.el.onmousedown = this.mousedownlistener;
        },
        dragStart : function() {
            this.trigger('dragStart');
            this.railBounds = utils.bounds(this.elementRail);
            window.addEventListener('mouseup', this.mouseuplistener, false);
            window.addEventListener('mousemove', this.mousemovelistener, false);
        },
        dragEnd : function(evt) {
            window.removeEventListener('mouseup', this.mouseuplistener);
            window.removeEventListener('mousemove', this.mousemovelistener);
            this.mouseMove(evt);
            this.trigger('dragEnd');
        },
        mouseMove : function(evt) {
            var dimension,
                bounds = this.railBounds,
                percentage;

            if (this.orientation === 'horizontal'){
                dimension = evt.pageX;
                if (dimension < bounds.left) {
                    percentage = 0;
                } else if (dimension > bounds.right) {
                    percentage = 100;
                } else {
                    percentage = utils.between((dimension-bounds.left)/bounds.width, 0, 1) * 100;
                }
            } else {
                dimension = evt.pageY;
                if (dimension >= bounds.bottom) {
                    percentage = 0;
                } else if (dimension <= bounds.top) {
                    percentage = 100;
                } else {
                    percentage = utils.between((bounds.height-(dimension-bounds.top))/bounds.height, 0, 1) * 100;
                }
            }

            this.render(percentage);
            this.update(percentage);

            return false;
        },

        update : function(percentage) {
            this.trigger('update', { percentage : percentage });
        },
        render : function(percentage) {
            percentage = Math.max(0, Math.min(percentage, 100));

            if(this.orientation === 'horizontal'){
                this.elementThumb.style.left = percentage + '%';
                this.elementProgress.style.width = percentage + '%';
            } else {
                this.elementThumb.style.bottom = percentage + '%';
                this.elementProgress.style.height = percentage + '%';
            }
        },
        updateBuffer : function(percentage) {
            this.elementBuffer.style.width = percentage + '%';
        },

        element : function() {
            return this.el;
        }
    });

    return Slider;
});