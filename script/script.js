document.addEventListener('DOMContentLoaded', () => {
    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishListBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const basket = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const basketWrapper = document.querySelector('.cart-wrapper');
    const basketTotal = document.querySelector('.cart-total');
    const basketCounter = cartBtn.querySelector('.counter');
    const wishListCounter = wishListBtn.querySelector('.counter');

    const wishList = [];
    const goodsBasket = {};
    const course = 0.4;

    const renderLoadSpinner = (functionName) => {
        const spinner = `<div id="spinner">
                                        <div class="spinner-loading">
                                            <div>
                                                <div>
                                                    <div></div>
                                                </div>
                                                <div>
                                                    <div></div>
                                                </div>
                                                <div>
                                                    <div></div>
                                                </div>
                                                <div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
        if (functionName === 'renderCard') {
            goodsWrapper.innerHTML = spinner;
        }

        if (functionName === 'renderBasket') {
            basketWrapper.innerHTML = spinner;
        }
    };
// server request
    const getGoods = (handler, filter) => {
        renderLoadSpinner(handler.name);
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };
// goods card generating
    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `
        <div class="card">
            <div class="card-img-wrapper">
                <img class="card-img-top" src="${img}" alt="">
                <button class="card-add-wishlist ${wishList.includes(id) ? 'active' : ''}" data-goods-id = "${id}"></button>
            </div>
            <div class="card-body justify-content-between">
                <a href="#" class="card-title">${title}</a>
                <div class="card-price">${(price * course).toFixed(0)} грн</div>
                <div>
                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                </div>
            </div>
        </div>`;

        return card;
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
						<p class="goods-price">${(price * course).toFixed(0)} грн</p>

					</div>
					<div class="goods-price-count">
						<div class="goods-trigger">
						    <div>
                                <button class="goods-add-wishlist ${wishList.includes(id) ? 'active' : ''}"
                                 data-goods-id = "${id}"></button>
                                <button class="goods-delete" data-goods-id = "${id}"></button>
							</div>
							<div>
                                <button class="goods-increase-count" data-goods-id = "${id}"></button>
                                <button class="goods-decrease-count" data-goods-id = "${id}"></button>
							</div>
						</div>
						<div class="goods-count">${goodsBasket[id]}</div>
					</div>`;
        return card;
    };
//rendering goods lists
    const getBasketTotalSum = goods => {
        return goods.reduce((accumulator, item) => {
            return accumulator + item.price * goodsBasket[item.id]
        }, 0);
    };

    const renderBasket = goods => {
        basketWrapper.textContent = '';

        if (!goods.length) {
            basketTotal.innerHTML = '';
            basketWrapper.innerHTML = '<div id="cart-empty"> Ваша корзина пока пуста </div>';
            return;
        }

        let totalSum = getBasketTotalSum(goods);
        goods.forEach(element => {
            basketWrapper.appendChild(createCardGoodsBasket(element.id, element.title, element.price, element.imgMin));
        });
        basketTotal.innerHTML = `Общая сумма: 
                            <span>${(totalSum * course).toFixed(0)}</span>
                              грн`;
    };

    const renderCard = items => {
        goodsWrapper.textContent = '';
        if (!items.length) {
            goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по Вашему запросу!';
            return;
        }
        items.forEach(element => {
            goodsWrapper.appendChild(createCardGoods(element.id, element.title, element.price, element.imgMin));
        });
    };
//open and close goods, basket, wish list
    const filterBasketGoods = item => goodsBasket.hasOwnProperty(item.id);

    const actionsCloseBasket = () => {
        basket.style.display = '';
        document.removeEventListener('keyup', closeBasket);
    };

    const closeBasket = (event) => {
        const target = event.target;
        if (target === basket ||
            target.classList.contains('cart-close') ||
            event.keyCode === 27
        ) {
            actionsCloseBasket();
        }
    };

    const randomSort = (item) => item.sort(() => Math.random() - 0.5);

    const actionsOpenBasket = () => {
        getGoods(renderBasket, goods => goods.filter(filterBasketGoods));
        basket.style.display = 'flex';
        document.addEventListener('keyup', closeBasket);
    };

    const openBasket = (event) => {
        event.preventDefault();
        actionsOpenBasket();
    };

    const openWishList = () => {
        getGoods(renderCard, goods =>
            goods.filter(item => wishList.includes(item.id)));
    };
//calculation
    const basketCounterReducer = (accumulator, currentId) =>
        accumulator + goodsBasket[currentId];

    const wishListAndBasketTotalCount = () => {
        wishListCounter.textContent = wishList.length;
        basketCounter.textContent = 0;
        if (Object.keys(goodsBasket)) {
            basketCounter.textContent = Object.keys(goodsBasket).reduce(basketCounterReducer, 0);
        }
    };
//work with local storage
    const wishListStorageQuery = (get) => {
        if (get) {
            const wishListStr = localStorage.getItem('wishlist');
            if (wishListStr) {
                wishList.push(...JSON.parse(wishListStr));
            }
            wishListAndBasketTotalCount();
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishList));
        }
    };
//work with cookies
    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const cookieQuery = get => {
        if (get) {
            const cookieValue = getCookie('goodsBasket');
            if (!cookieValue) {
                return;
            }
            Object.assign(goodsBasket, JSON.parse(cookieValue));
            wishListAndBasketTotalCount();
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400`;
        }
    };
//actions
    const choiceCategory = event => {
        event.preventDefault();
        const target = event.target;
        if (target.classList.contains('category-item')) {
            const category = target.dataset.category;
            if (category === 'all') {
                getGoods(renderCard);
                return;
            }
            getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
        }
    };

    const searchGoods = (event) => {
        event.preventDefault();
        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim();
        if (inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i');
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout(() => {
                search.classList.remove('error');
            }, 2000);
        }
        input.value = '';
    };

    const toggleWishList = (id, elem) => {
        if (wishList.includes(id)) {
            wishList.splice(wishList.indexOf(id), 1);
            elem.classList.remove('active');
        } else {
            wishList.push(id);
            elem.classList.add('active');
        }

        wishListStorageQuery(false);
        wishListAndBasketTotalCount();
    };

    const addBasket = (goodsId) => {
        if (!goodsId) {
            return;
        }
        if (!goodsBasket[goodsId]) {
            goodsBasket[goodsId] = 0;
        }
        goodsBasket[goodsId] += 1;

        wishListAndBasketTotalCount();
        cookieQuery();
    };

    const removeFromBasket = goodsId => {
        delete goodsBasket[goodsId];
        wishListAndBasketTotalCount();
        cookieQuery();
        actionsOpenBasket();
    };

    const increaseBasketPosition = goodsId => {
        goodsBasket[goodsId] += 1;
        wishListAndBasketTotalCount();
        cookieQuery();
        actionsOpenBasket();
    };

    const decreaseBasketPosition = goodsId => {
        if (goodsBasket[goodsId] < 2) {
            return;
        }

        goodsBasket[goodsId] -= 1;
        wishListAndBasketTotalCount();
        cookieQuery();
        actionsOpenBasket();
    };
//events handlers
    const basketHandler = event => {
        const target = event.target;

        if (target.classList.contains('goods-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }

        if (target.classList.contains('goods-delete')) {
            removeFromBasket(target.dataset.goodsId);
        }

        if (target.classList.contains('goods-increase-count')) {
            increaseBasketPosition(target.dataset.goodsId);
        }

        if (target.classList.contains('goods-decrease-count')) {
            decreaseBasketPosition(target.dataset.goodsId);
        }
    };

    const goodsHandler = event => {
        const target = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }

        if (target.classList.contains('card-add-cart')) {
            addBasket(target.dataset.goodsId);
        }
    };
//initialize
    const init = () => {
        getGoods(renderCard, randomSort);
        wishListStorageQuery(true);
        cookieQuery(true);
    };

    {
        init();
        category.addEventListener('click', choiceCategory);
        cartBtn.addEventListener('click', openBasket);
        basket.addEventListener('click', closeBasket);
        search.addEventListener('submit', searchGoods);
        goodsWrapper.addEventListener('click', goodsHandler);
        basketWrapper.addEventListener('click', basketHandler);
        wishListBtn.addEventListener('click', openWishList);
    }
});