//console.log(1);
document.addEventListener('DOMContentLoaded', () => {
    const search =  document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishlistBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const cardCounter = cartBtn.querySelector('.counter');
    const wishlistCounter = wishlistBtn.querySelector('.counter');
    const cartlistCounter = cartBtn.querySelector('.counter');
    const cartWrapper = document.querySelector('.cart-wrapper');
    const basketTotal = document.querySelector('.cart-total');
    const wishlist = [];
    const goodsBasket = {};
  

const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
    };

const cookieQuery = get => {
    if(get) {
        const cookieValue = getCookie('goodsBasket');
        if(!cookieValue){
            return;
        }
        const cookieBasket = JSON.parse(cookieValue);

        Object.keys(cookieBasket).forEach((item,index,array)=>{
            goodsBasket[item]=cookieBasket[item];
        });
           
        checkCount();
    } else {
        document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86000`;
    }
};

const setCookie = (name, value, options = {}) => {
    options = {
        path: '/',
        // при необходимости добавьте другие значения по умолчанию ...options
    };
    
    if (options.expires.toUTCString) {
        options.expires = options.expires.toUTCString();
    }
    
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
        }
    }
    
    document.cookie = updatedCookie;
};

    const loading = () => {
        goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
        </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>
        `;
    };

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `
        <div class="card">
            <div class="card-img-wrapper">
                <img class="card-img-top" src="${img}" alt="">
                <button class="card-add-wishlist ${wishlist.includes(id) ? 'active':''}" data-goods-id = "${id}"></button>
            </div>
            <div class="card-body justify-content-between">
                <a href="#" class="card-title">${title}</a>
                <div class="card-price">${Math.round(price*0.4)} грн</div>
                <div>
                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                </div>
            </div>
        </div>`;


        //console.log(card);
        return card;
    };

    const renderCard = items =>{
        goodsWrapper.textContent = '';
        if(!items.length){
            cardWrapper.textContent = '❌ Извините, мы не нашли товаров по Вашему запросу!';
            return;
        }
        items.forEach(element => {
            //console.log( element);
           goodsWrapper.appendChild(createCardGoods(element.id,element.title,element.price,element.imgMin));
        });
    };
//render cart
const actionsCloseBasket = () =>{
    cart.style.display = '';
    document.removeEventListener('keyup', closeBasket);
    const deleteButtons = cartWrapper.getElementsByClassName('goods-delete');
    for (let element of deleteButtons) {
        element.removeEventListener('click', deleteGoodFromBasket);
    }
};

const actionsOpenBasket = () => {
    getGoods(renderBasket, goods => goods.filter(filterBasketGoods));
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeBasket);
}

const deleteGoodFromBasket = event => {
    const target = event.target;
    const id = target.dataset.goodsId;
    delete goodsBasket[id];
    actionsCloseBasket();
    cookieQuery();
    checkCount();
    actionsOpenBasket();
    //console.log(id);  
};


const createCardGoodsBasket = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = `
                     <div class="goods-img-wrapper">
						<img class="goods-img" src="${img}" alt="">

					</div>
					<div class="goods-description">
						<h2 class="goods-title">${title}</h2>
						<p class="goods-price">${(price*0.4).toFixed(0)} грн</p>

					</div>
					<div class="goods-price-count">
						<div class="goods-trigger">
                            <button class="goods-add-wishlist ${wishlist.includes(id) ? 'active':''}"
                             data-goods-id = "${id}"></button>
							<button class="goods-delete" data-goods-id = "${id}" :active></button>
						</div>
						<div class="goods-count">${goodsBasket[id]}</div>
					</div>`;

    const deleteButton = card.querySelector(' .goods-delete');
    deleteButton.addEventListener('click', deleteGoodFromBasket);
    return card;
};

const renderBasket = goods =>{
    cartWrapper.textContent = '';
    
    if(!goods.length){
        basketTotal.innerHTML = '';
        cartWrapper.innerHTML = '<div id="cart-empty"> Ваша корзина пока пуста </div>';
        return;
    }

    let totalsum = 0;
    goods.forEach(element => {
        //console.log( element);
       cartWrapper.appendChild(createCardGoodsBasket(element.id,element.title,element.price,element.imgMin));
       totalsum += element.price * goodsBasket[element.id];
    });
    basketTotal.innerHTML = `Общая сумма: 
                            <span>${(totalsum * 0.4).toFixed(0)}</span>
                             - грн`;
};

const getGoods = (handler, filter) => {
    //loading();
    fetch('db/db.json')
    .then(response => response.json())
    .then(filter)
    .then(handler); 
};

const randomSort = (item)=> item.sort(() => Math.random()- 0.5);

const choiceCategory = event =>{
    event.preventDefault();
    const target = event.target;
    if(target.classList.contains('category-item')){
        const category = target.dataset.category;
        if(category==='all'){
            getGoods(renderCard);
            return;
        }
        getGoods(renderCard, goods=>{
            const newGoods = goods.filter(item => {
                    return item.category.includes(category);
            });
            return newGoods;
        });
    }
};

getGoods(renderCard, randomSort);

const filterBasketGoods = item => goodsBasket.hasOwnProperty(item.id);    


const openBasket = (event) => {
    event.preventDefault();
    actionsOpenBasket();
};

const closeBasket = (event) => {
    const target = event.target; 
    if(target===cart ||
          target.classList.contains('cart-close') ||
          event.keyCode === 27
          ) {
              actionsCloseBasket();
            }
};

const handler = (event) => {
    console.log(event);
    
};

const searchGoods = (event) => {
    console.log(event);
    
    event.preventDefault();
    const input = event.target.elements.searchGoods;
    const inputvalue = input.value.trim();
    //console.log(input.value);
    if(inputvalue !== ''){
        console.log(input.value.trim());
        const searchString = new RegExp(inputvalue, 'i');
        getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
    } else{
        search.classList.add('error');
        setTimeout(() => { search.classList.remove('error');}, 2000);
    }
    input.value='';
};



const storageQuery = (get) =>{

    if(get){
       const wishliststr = localStorage.getItem('wishlist');
        if(wishliststr){ 
            const wishlistStorage = JSON.parse(wishliststr);
            wishlistStorage.forEach(id=>wishlist.push(id));
        }
    } else {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    checkCount();
    
};

const cartCounterReducer = (accumulator, currentId) => 
                            accumulator +goodsBasket[currentId];

const checkCount = () => {
    wishlistCounter.textContent = wishlist.length;
    cartlistCounter.textContent = 0;
    if (Object.keys(goodsBasket)){
    cartlistCounter.textContent = Object.keys(goodsBasket).reduce(cartCounterReducer, 0);
}
};

const toggleWishList = (id, elem) => {
    if (wishlist.includes(id)) {
        wishlist.splice(wishlist.indexOf(id),1);
        elem.classList.remove('active');
    }
    else {
        wishlist.push(id);
        elem.classList.add('active');
    }
    
    
    storageQuery(false);
    checkCount();
};

const addBasket = (goodsId) => {
    if(!goodsBasket[goodsId]){
        goodsBasket[goodsId] = 0;
    } 
    
    goodsBasket[goodsId] += 1;
    
    checkCount();
    cookieQuery();
}; 

const handlerGoods = event => {
    const target = event.target;

    if(target.classList.contains('card-add-wishlist'))
    {
            toggleWishList(target.dataset.goodsId, target);
    }

    if(target.classList.contains('card-add-cart'));{
        addBasket(target.dataset.goodsId);
    }
};

const showWishlist = () => {
    getGoods(renderCard, goods => 
        goods.filter(item => wishlist.includes(item.id)));
};

    category.addEventListener('click', choiceCategory);
    cartBtn.addEventListener('click', openBasket);
    cart.addEventListener('click', closeBasket);
    search.addEventListener('submit',searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    wishlistBtn.addEventListener('click', showWishlist);

    storageQuery(true);
    cookieQuery(true);
});