c3_chart_internal_fn.initRegion = function () {
    var $$ = this, CLASS = $$.CLASS;
    $$.main.append('g')
        .attr("clip-path", $$.clipPath)
        .attr("class", CLASS[_regions]);
};
c3_chart_internal_fn.redrawRegion = function (duration) {
    var $$ = this, config = $$.config, CLASS = $$.CLASS;
    $$.mainRegion = $$.main.select('.' + CLASS[_regions]).selectAll('.' + CLASS[_region])
        .data(config[__regions]);
    $$.mainRegion.enter().append('g')
        .attr('class', generateCall($$.classRegion, $$))
      .append('rect')
        .style("fill-opacity", 0);
    $$.mainRegion.exit().transition().duration(duration)
        .style("opacity", 0)
        .remove();
};
c3_chart_internal_fn.addTransitionForRegion = function (transitions) {
    var $$ = this;
    transitions.push($$.mainRegion.selectAll('rect').transition()
                     .attr("x", generateCall($$.regionX, $$))
                     .attr("y", generateCall($$.regionY, $$))
                     .attr("width", generateCall($$.regionWidth, $$))
                     .attr("height", generateCall($$.regionHeight, $$))
                     .style("fill-opacity", function (d) { return isValue(d.opacity) ? d.opacity : 0.1; }));
};
c3_chart_internal_fn.regionX = function (d) {
    var $$ = this, config = $$.config,
        xPos, yScale = d.axis === 'y' ? $$.y : $$.y2;
    if (d.axis === 'y' || d.axis === 'y2') {
        xPos = config[__axis_rotated] ? ('start' in d ? yScale(d.start) : 0) : 0;
    } else {
        xPos = config[__axis_rotated] ? 0 : ('start' in d ? $$.x($$.isTimeSeries() ? $$.parseDate(d.start) : d.start) : 0);
    }
    return xPos;
};
c3_chart_internal_fn.regionY = function (d) {
    var $$ = this, config = $$.config,
        yPos, yScale = d.axis === 'y' ? $$.y : $$.y2;
    if (d.axis === 'y' || d.axis === 'y2') {
        yPos = config[__axis_rotated] ? 0 : ('end' in d ? yScale(d.end) : 0);
    } else {
        yPos = config[__axis_rotated] ? ('start' in d ? $$.x($$.isTimeSeries() ? $$.parseDate(d.start) : d.start) : 0) : 0;
    }
    return yPos;
};
c3_chart_internal_fn.regionWidth = function (d) {
    var $$ = this, config = $$.config,
        start = $$.regionX(d), end, yScale = d.axis === 'y' ? $$.y : $$.y2;
    if (d.axis === 'y' || d.axis === 'y2') {
        end = config[__axis_rotated] ? ('end' in d ? yScale(d.end) : $$.width) : $$.width;
    } else {
        end = config[__axis_rotated] ? $$.width : ('end' in d ? $$.x($$.isTimeSeries() ? $$.parseDate(d.end) : d.end) : $$.width);
    }
    return end < start ? 0 : end - start;
};
c3_chart_internal_fn.regionHeight = function (d) {
    var $$ = this, config = $$.config,
        start = this.regionY(d), end, yScale = d.axis === 'y' ? $$.y : $$.y2;
    if (d.axis === 'y' || d.axis === 'y2') {
        end = config[__axis_rotated] ? $$.height : ('start' in d ? yScale(d.start) : $$.height);
    } else {
        end = config[__axis_rotated] ? ('end' in d ? $$.x($$.isTimeSeries() ? $$.parseDate(d.end) : d.end) : $$.height) : $$.height;
    }
    return end < start ? 0 : end - start;
};
c3_chart_internal_fn.isRegionOnX = function (d) {
    return !d.axis || d.axis === 'x';
};