class Swipper{
  constructor(props){
    this.state={
      id: props.id,
      url: props.url,
      index: 0,
      duration: 500,
      isLock: false,
      translateX: 0,
      defaultLenght: null,
      itemWidth: null,
    };
    this._$ = selector => document.querySelector(selector);
    this._createElement = type => document.createElement(type);
    this._setContent = (elem,content) => elem.textContent = content
    this._appendChild = (container,node) => container.appendChild(node);
    this._init();
  } 
  _init(){
    this._addHTML();
    this._clone();
  }
  _addHTML(){
    let $ = this._$;
    let idContainer = $(`#${this.state.id}`);
    let swiperWrapper = this._createElement('div');
    let swiperSlide = this._createElement('div');
    let swiperBtnprev = this._createElement('div');
    let swiperBtnnext = this._createElement('div');
    
    for(let i=0; i<this.state.url.length; i++){
      let img = this._createElement('img')
      this._appendChild(swiperSlide,img)
      if(this.state.url.length >= i){
        img.setAttribute('src',this.state.url[i])
        img.setAttribute('class','swiper-img')
      }
    }//根据img的个数创建所需要的div容器。
    swiperWrapper.setAttribute('class','swiper-wrapper');
    swiperSlide.setAttribute('class','swiper-slide')
    swiperSlide.setAttribute('id','swiper-slide')
    swiperBtnprev.setAttribute('class','swiper-button-prev');
    swiperBtnnext.setAttribute('class','swiper-button-next');
    this._setContent(swiperBtnprev,'<');
    this._setContent(swiperBtnnext,'>');
    this._appendChild(swiperWrapper,swiperSlide);
    this._appendChild(swiperWrapper,swiperBtnprev);
    this._appendChild(swiperWrapper,swiperBtnnext);
    this._appendChild(idContainer,swiperWrapper);
    swiperBtnprev.addEventListener('click',this.swiperprev.bind(this));
    swiperBtnnext.addEventListener('click',this.swipernext.bind(this));
  }
  _clone(){
    let swiperImg = document.getElementsByClassName('swiper-img');
    let firstImg = swiperImg[0].cloneNode();
    let lastImg = swiperImg[this.state.url.length-1].cloneNode();
    let swiperslide = document.getElementById('swiper-slide');
    let index = this.state.index;
    let swiperItemWidth = swiperslide.offsetWidth;
    this.state.defaultLenght = swiperImg.length;
    this.state.itemWidth = swiperItemWidth;
    this.state.translateX = -(swiperItemWidth + swiperItemWidth*index);
    swiperslide.appendChild(firstImg);
    swiperslide.prepend(lastImg);
    this.goIndex(index);
  }
  swiperprev(){
    let index = this.state.index;
    this.goIndex(index - 1);
  }
  swipernext(){
    let index = this.state.index;
    this.goIndex(index + 1);
  }
  goIndex(index){
    let swiperDuration = this.state.duration;
    let swiperItemWidth = this.state.itemWidth;
    let beginTranslateX = this.state.translateX;
    let endTranslateX = -(swiperItemWidth + swiperItemWidth*index);
    let swiperslide = document.getElementById('swiper-slide');

    let isLock = this.state.isLock;
    if(isLock){
      return
    }
    this.state.isLock = true;
    let that = this ;
    this.animateTo(beginTranslateX,endTranslateX,swiperDuration,function(value){
      swiperslide.style.transform = `translateX(${value}px)`;}
      ,function(value){
      let swiperLength = that.state.defaultLenght;
      if(index === -1){
        index = swiperLength - 1;
        value =  - (swiperItemWidth + swiperItemWidth * index);
      }
      if(index === swiperLength){
        index = 0;
        value =  - (swiperItemWidth + swiperItemWidth * index);
      }
      swiperslide.style.transform = `translateX(${value}px)`;
      that.state.index = index;
      that.state.translateX = value;
      that.state.isLock = false;
    })
  }
  animateTo(begin,end,duration,changeCallback,finishCallback){
    let startTime = Date.now();
    let that = this ;
    requestAnimationFrame(function update(){
      let dataNow = Date.now();
      let time = dataNow - startTime;
      let value = that.linear(time,begin,end,duration);
      
      typeof changeCallback === 'function' && changeCallback(value)
      if(startTime + duration > dataNow){
        requestAnimationFrame(update)
      }else{
        typeof finishCallback === 'function' && finishCallback(end)
      }
    })
  }
  linear(time, begin, end, duration) { 
    return ( end - begin ) * time / duration + begin;
  }
}
const PAGE = {
  data: {
    classname: null,
  },
  init:function(){
    this.initSwipper();
  },
  initSwipper:function(){
    PAGE.data.classname = new Swipper({
      id:'swiper-container',
      url: ['./img/cold.jpg','./img/timg.jpg','./img/people.jpg','./img/oldtime.jpg'],
    })
  }
}
PAGE.init();
// ,'./img/UN.jpg'