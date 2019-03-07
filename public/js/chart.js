class Chart{

  constructor(){
    // for data:
    // column 1, column 2, column 3 ...
    // [column 1], [column 2], [column 3] ...
    this.data = [];

    this.chart = {
      height: {
        minValue: 0,
        maxValue: 0,
        scale: 1,
        input: {
          value: 0,
          uom: 'px'
        },
        max: {
          value: 400,
          uom: 'px'
        }
      },
      width: {
        input: {
          value: 0,
          uom: 'px'
        },
        max: {
          value: 400,
          uom: 'px'
        }
      },
      numberOfBars: 0
    };

    this.title = {
      title: 'Chart Title',
      fontSize: {
        value: '',
        uom: 'large'
      },
      fontColour: 'rgb(0, 0, 100)'
    };

    this.bar = {
      barColours: ["rgb(200, 0, 0)", "rgb(0, 200, 0)", "rgb(0, 0, 200)"],
      width: {
        value: 10,
        uom: 'px'
      },
      labelColour: 'rgb(0, 0, 0)',
      spacing: {
        value: 2,
        uom: 'px'
      },
      fontSize: {
        value: '',
        uom: 'small'
      },
      // positionOf Values can be center, bottom, top
      positionOfValues: 'center'
    };

    this.axis = {
      xAxis: {
        labels: ['label1', 'label2', 'label3'],
        name: 'xAxis',
        colour: 'rgb(0, 0, 100)'
      },
      yAxis: {
        labels: [],
        name: 'yAxis',
        colour: 'rgb(0, 0, 100)'
      }
    };
  }

  drawBarChart(data, options, element){
    if(element === '#chart'){
      this.data = data;
      this.chart.numberOfBars = data.length;
/*
      this.title.title = options.title;
      this.title.fontSize = this.getSplitSizes(options.titleFontSize);
      this.title.fontColour = options.titleFontColour;

      this.chart.height = options.height;
      this.chart.width = options.width;
      this.chart.barColours = options.barColours;
      this.chart.labelColour = options.labelColour;
      this.bar.spacing = this.getSplitSizes(options.barSpacing);
      this.bar.spacing.value = this.bar.spacing.value / 2;
      this.chart.fontSize = this.getSplitSizes(options.fontSize);
      this.chart.positionOfValues = options.positionOfValues;
*/
      //this.xAxis = options.xAxis

      // calc chart heigh and width
      data.forEach((dataAux, index) => {

        let minY = 0;
        let maxY = 0;

        if(Array.isArray(dataAux)){
          for(let i = 0; i < dataAux.length; i++){
            dataAux[i] < 0 ? minY += dataAux[i] : maxY += dataAux[i];
            if(this.bar.barColours[i] === undefined){ this.bar.backgroundColour = this.setColour(this.bar.barColours); }
          }
        }else{
          dataAux < 0 ? minY += dataAux : maxY += dataAux;
          if(this.bar.barColours[0] === undefined){ this.bar.backgroundColour = this.setColour(this.bar.barColours); }
        }

        if(this.chart.height.minValue > minY){ this.chart.height.minValue = minY; }
        if(this.chart.height.maxValue < maxY){ this.chart.height.maxValue = maxY; }
      });

      this.setHeightScale();
      this.setBarWidth();

      return true;

    }else{
      return 'Element must be #chart';
    }
  }

  getTitle(){
    return this.title;
  }

  setTitle(title){
    this.title.title = title.title;
    this.title.fontSize = title.fontSize;
    this.title.fontColour = title.fontColour;
  }

  setTitleColour(value){
    this.title.fontColour = value;
  }

  getMeasure(){
    // get the input height if there is any
    let height = this.chart.height.max;
    if(this.chart.height.input.value !== 0){ height = this.chart.height.input; }

    // get the input width if there is any
    let width = this.chart.width.max;
    if(this.chart.width.input.value !== 0){ width = this.chart.width.input; }

    return {
      height: height,
      width: width
    };
  }

  getSplitSizes(value){
    let absolute = /^\d+/.test(value);
    if(absolute === false){
      return { value: '', uom: value};
    }else{
      let splitFontSize = value.replace(/(\d+)(\D+)/, "$1|$2");
      splitFontSize = splitFontSize.split('|');
      return { value: splitFontSize[0], uom: splitFontSize[1]};
    }
  }

  createChart(father){
    // Set header
    $(`#${father}`).append($('<h1 id="title_chart"></h1>'));

    let chartHeight = this.getChartHeight();
    let chartWidth = this.getChartWidth();

    $(`#${father}`).append($('<div id="chart_area"></div>'));

    // set tick
    this.setTick(chartHeight, chartWidth);

    // set Y-Axis
    $(`#${father}`).append($('<div id="y_axis"></div>'));
    $('#y_axis').append($(`<span id="span_y_axis">${this.axis.yAxis.name}</span>`));
    $('#y_axis').css('color', this.axis.yAxis.colour);
    $('#y_axis').append($('<div id="y_labels"></div>'));

    this.setYLabel(chartHeight);

    // set Bar Chart
    $(`#${father}`).append($('<div id="bar_chart"></div>'));
    // set bars
    let barSpacing = this.bar.spacing.value + this.bar.spacing.uom;

    let maxBarHeight = 0;

    this.data.forEach((values, index) => {
      let bar = $('<div class="bar"></div>');
      bar.css({'width': this.bar.width.value + this.bar.width.uom, 'margin-left': barSpacing, 'margin-right': barSpacing});
      $('#bar_chart').append(bar);

      let barHeight = 0;

      // set values
      if(Array.isArray(values)){
        for(let i = values.length - 1; i >= 0; i--){
          this.createBar(bar, values[i], i);
          barHeight += this.getValueHeight(values[i]);
        }
      }else{
        this.createBar(bar, values, 0);
        barHeight += this.getValueHeight(values);
      }

      if(maxBarHeight < barHeight){ maxBarHeight = barHeight; }
    });

    // set the bars positions
    $('.bar').css('bottom', (maxBarHeight - chartHeight.value) + chartHeight.uom);

    // set X-Axis
    $(`#${father}`).append($(`<div id="x_axis">${this.axis.xAxis.name}</div>`));
    $('#x_axis').css('color', this.axis.xAxis.colour);
    $(`#${father}`).append($('<div id="x_labels"></div>'));
    this.axis.xAxis.labels.forEach(label => {
      $('#x_labels').append(`<span class="span_x_labels">${label}</span>`);
    });
    let xMargin = this.bar.spacing.value + this.bar.spacing.uom;
    $('.span_x_labels').css({'color': this.axis.xAxis.colour, 'width': this.bar.width.value + this.bar.width.uom, 'margin-left': xMargin, 'margin-right': xMargin});
  }

  createBar(bar, value, i){
    let div = $('<div class="data"></div>');
    bar.append(div);

    let height = this.getValueHeight(value);
    let position = 0;

    switch(this.bar.positionOfValues){
    case 'center':
      // 2 decimal places
      if(height > 25){
        position = 'top: ' + ( height / 2 ).toFixed(2) + this.chart.height.input.uom;
      }
      break;
    case 'bottom':
      position = 'bottom: 0';
      break;
    case 'top':
      position = 'top: 0';
      break;
    }

    div.append($(`<b style="${position}">${value}</b>`));

    div.css({'height': height + this.chart.height.input.uom, 'background-color': this.bar.barColours[i], 'color': this.bar.labelColour});
  }

  getConstHeight(chartHeight){
    let constHeight = 0;
    switch(chartHeight.uom){
    case 'px':
      constHeight = 50;
      break;
    case '%':
      constHeight = 20;
      break;
    default:
      constHeight = 50;
      break;
    }
    return constHeight;
  }

  setTick(chartHeight, chartWidth){
    let height = 0;
    let constHeight = this.getConstHeight(chartHeight);

    do{
      let tick = $(`<div class="tick"></div>`);
      $('#chart_area').append(tick);

      let last = false;
      let newHeight = height + constHeight;
      if(newHeight >= chartHeight.value){
        newHeight = chartHeight.value - height;
        last = true;
      }else{
        newHeight = chartHeight.value;
        height += constHeight;
      }

      $('.tick').css({height: newHeight + chartHeight.uom, width: chartWidth.value + chartWidth.uom, color: this.axis.yAxis.colour});

      if(last){ break; }
    }while(height < chartHeight.value);
  }

  setYLabel(chartHeight){
    let height = 0;
    let constHeight = this.getConstHeight(chartHeight);
    let constValue = Math.round(this.getConstHeight(chartHeight) / this.chart.height.scale);
    let value = 0;

    do{
      /*
      let last = false;
      let newHeight = height + constHeight;
      if(newHeight >= chartHeight.value){
        newHeight = chartHeight.value - height;
        last = true;
      }else{
        height += constHeight;
      }

      value += constValue;

      let tickLabel = $(`<span class="span_y_axis">${value}</span>`);
      $('#y_labels').append(tickLabel);

      $('.span_y_axis').css({width: newHeight + chartHeight.uom, color: this.axis.yAxis.colour});
      if(last){ break; }
      */

      if(height + constHeight >= chartHeight.value){
        break;
      }
      height += constHeight;
      value += constValue;

      let tickLabel = $(`<span class="span_y_axis">${value}</span>`);
      $('#y_labels').append(tickLabel);

      $('.span_y_axis').css({width: constHeight + chartHeight.uom, color: this.axis.yAxis.colour});


    }while(height < chartHeight.value);
  }

  getChartHeight(){
    let height = this.chart.height.max;
    if(this.chart.height.input.value !== 0){ height = this.chart.height.input; }
    return height;
  }

  getChartWidth(){
    // get the input width if there is any
    let width = this.chart.width.max;
    if(this.chart.width.input.value !== 0){ width = this.chart.width.input; }
    return width;
  }

  setHeightScale(){
    let height = this.getChartHeight();
    // 0.05 (5%) of the height must be empty
    let factor = 0.95;
    // if we have negative values, 0.10 (10%) of the height must be empty
    if(this.chart.height.minValue !== 0){ factor = 0.9; }
    // this.height.maxValue - this.height.minValue = 100%
    this.chart.height.scale = factor * height.value / (this.chart.height.maxValue - this.chart.height.minValue);
  }

  getValueHeight(value){
    return Math.abs(value * this.chart.height.scale);
  }

  setBarWidth(){
    // get the input width if there is any
    let width = this. getChartWidth();
    this.bar.width.value = width.value / this.chart.numberOfBars - 2 * this.bar.spacing.value;
    this.bar.width.uom = width.uom;
  }

  setColour(colours){
    let colour = 'rgb(255, 255, 0, .25)';

    do{
      colour = this.randomColour();
    }while(colours.includes(colour));

    colours.push(colour);
    return colours;
  }

  randomColour(){
    // random goes from 0 to 1 and does not include 1
    // use Math.floor to make the number withdout decimal

    // get a "red" from 0 to 255
    let r = Math.floor(Math.random() * 256);
    // get a "green" from 0 to 255
    let g = Math.floor(Math.random() * 256);
    // get a "blue" from 0 to 255
    let b = Math.floor(Math.random() * 256);

    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

}
