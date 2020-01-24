"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
    var search = document.querySelector('.search');
    var cartBtn = document.getElementById('cart');
    var wishListBtn = document.getElementById('wishlist');
    var goodsWrapper = document.querySelector('.goods-wrapper');
    var basket = document.querySelector('.cart');
    var category = document.querySelector('.category');
    var basketWrapper = document.querySelector('.cart-wrapper');
    var basketTotal = document.querySelector('.cart-total');
    var basketCounter = cartBtn.querySelector('.counter');
    var wishListCounter = wishListBtn.querySelector('.counter');
    var wishList = [];
    var goodsBasket = {};
    var course = 0.4;

    var renderLoadSpinner = function renderLoadSpinner(functionName) {
        var spinner = "<div id=\"spinner\">\n                                        <div class=\"spinner-loading\">\n                                            <div>\n                                                <div>\n                                                    <div></div>\n                                                </div>\n                                                <div>\n                                                    <div></div>\n                                                </div>\n                                                <div>\n                                                    <div></div>\n                                                </div>\n                                                <div>\n                                                    <div></div>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>";

        if (functionName === 'renderCard') {
            goodsWrapper.innerHTML = spinner;
        }

        if (functionName === 'renderBasket') {
            basketWrapper.innerHTML = spinner;
        }
    }; // server request


    var getGoods = function getGoods(handler, filter) {
        renderLoadSpinner(handler.name);
        fetch('db/db.json').then(function (response) {
            return response.json();
        }).then(filter).then(handler);
    }; // goods card generating


    var createCardGoods = function createCardGoods(id, title, price, img) {
        var card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = "\n        <div class=\"card\">\n            <div class=\"card-img-wrapper\">\n                <img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"\">\n                <button class=\"card-add-wishlist ").concat(wishList.includes(id) ? 'active' : '', "\" data-goods-id = \"").concat(id, "\"></button>\n            </div>\n            <div class=\"card-body justify-content-between\">\n                <a href=\"#\" class=\"card-title\">").concat(title, "</a>\n                <div class=\"card-price\">").concat((price * course).toFixed(0), " \u0433\u0440\u043D</div>\n                <div>\n                    <button class=\"card-add-cart\" data-goods-id=\"").concat(id, "\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>\n                </div>\n            </div>\n        </div>");
        return card;
    };

    var createCardGoodsBasket = function createCardGoodsBasket(id, title, price, img) {
        var card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = "\n                     <div class=\"goods-img-wrapper\">\n\t\t\t\t\t\t<img class=\"goods-img\" src=\"".concat(img, "\" alt=\"\">\n\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"goods-description\">\n\t\t\t\t\t\t<h2 class=\"goods-title\">").concat(title, "</h2>\n\t\t\t\t\t\t<p class=\"goods-price\">").concat((price * course).toFixed(0), " \u0433\u0440\u043D</p>\n\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"goods-price-count\">\n\t\t\t\t\t\t<div class=\"goods-trigger\">\n\t\t\t\t\t\t    <div>\n                                <button class=\"goods-add-wishlist ").concat(wishList.includes(id) ? 'active' : '', "\"\n                                 data-goods-id = \"").concat(id, "\"></button>\n                                <button class=\"goods-delete\" data-goods-id = \"").concat(id, "\"></button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div>\n                                <button class=\"goods-increase-count\" data-goods-id = \"").concat(id, "\"></button>\n                                <button class=\"goods-decrease-count\" data-goods-id = \"").concat(id, "\"></button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"goods-count\">").concat(goodsBasket[id], "</div>\n\t\t\t\t\t</div>");
        return card;
    }; //rendering goods lists


    var getBasketTotalSum = function getBasketTotalSum(goods) {
        return goods.reduce(function (accumulator, item) {
            return accumulator + item.price * goodsBasket[item.id];
        }, 0);
    };

    var renderBasket = function renderBasket(goods) {
        basketWrapper.textContent = '';

        if (!goods.length) {
            basketTotal.innerHTML = '';
            basketWrapper.innerHTML = '<div id="cart-empty"> Ваша корзина пока пуста </div>';
            return;
        }

        var totalSum = getBasketTotalSum(goods);
        goods.forEach(function (element) {
            basketWrapper.appendChild(createCardGoodsBasket(element.id, element.title, element.price, element.imgMin));
        });
        basketTotal.innerHTML = "\u041E\u0431\u0449\u0430\u044F \u0441\u0443\u043C\u043C\u0430: \n                            <span>".concat((totalSum * course).toFixed(0), "</span>\n                              \u0433\u0440\u043D");
    };

    var renderCard = function renderCard(items) {
        goodsWrapper.textContent = '';

        if (!items.length) {
            goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по Вашему запросу!';
            return;
        }

        items.forEach(function (element) {
            goodsWrapper.appendChild(createCardGoods(element.id, element.title, element.price, element.imgMin));
        });
    }; //open and close goods, basket, wish list


    var filterBasketGoods = function filterBasketGoods(item) {
        return goodsBasket.hasOwnProperty(item.id);
    };

    var actionsCloseBasket = function actionsCloseBasket() {
        basket.style.display = '';
        document.removeEventListener('keyup', closeBasket);
    };

    var closeBasket = function closeBasket(event) {
        var target = event.target;

        if (target === basket || target.classList.contains('cart-close') || event.keyCode === 27) {
            actionsCloseBasket();
        }
    };

    var randomSort = function randomSort(item) {
        return item.sort(function () {
            return Math.random() - 0.5;
        });
    };

    var actionsOpenBasket = function actionsOpenBasket() {
        getGoods(renderBasket, function (goods) {
            return goods.filter(filterBasketGoods);
        });
        basket.style.display = 'flex';
        document.addEventListener('keyup', closeBasket);
    };

    var openBasket = function openBasket(event) {
        event.preventDefault();
        actionsOpenBasket();
    };

    var openWishList = function openWishList() {
        getGoods(renderCard, function (goods) {
            return goods.filter(function (item) {
                return wishList.includes(item.id);
            });
        });
    }; //calculation


    var basketCounterReducer = function basketCounterReducer(accumulator, currentId) {
        return accumulator + goodsBasket[currentId];
    };

    var wishListAndBasketTotalCount = function wishListAndBasketTotalCount() {
        wishListCounter.textContent = wishList.length;
        basketCounter.textContent = 0;

        if (Object.keys(goodsBasket)) {
            basketCounter.textContent = Object.keys(goodsBasket).reduce(basketCounterReducer, 0);
        }
    }; //work with local storage


    var wishListStorageQuery = function wishListStorageQuery(get) {
        if (get) {
            var wishListStr = localStorage.getItem('wishlist');

            if (wishListStr) {
                wishList.push.apply(wishList, _toConsumableArray(JSON.parse(wishListStr)));
            }

            wishListAndBasketTotalCount();
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishList));
        }
    }; //work with cookies


    var getCookie = function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    var cookieQuery = function cookieQuery(get) {
        if (get) {
            var cookieValue = getCookie('goodsBasket');

            if (!cookieValue) {
                return;
            }

            Object.assign(goodsBasket, JSON.parse(cookieValue));
            wishListAndBasketTotalCount();
        } else {
            document.cookie = "goodsBasket=".concat(JSON.stringify(goodsBasket), "; max-age=86400");
        }
    }; //actions


    var choiceCategory = function choiceCategory(event) {
        event.preventDefault();
        var target = event.target;

        if (target.classList.contains('category-item')) {
            var _category = target.dataset.category;

            if (_category === 'all') {
                getGoods(renderCard);
                return;
            }

            getGoods(renderCard, function (goods) {
                return goods.filter(function (item) {
                    return item.category.includes(_category);
                });
            });
        }
    };

    var searchGoods = function searchGoods(event) {
        event.preventDefault();
        var input = event.target.elements.searchGoods;
        var inputValue = input.value.trim();

        if (inputValue !== '') {
            var searchString = new RegExp(inputValue, 'i');
            getGoods(renderCard, function (goods) {
                return goods.filter(function (item) {
                    return searchString.test(item.title);
                });
            });
        } else {
            search.classList.add('error');
            setTimeout(function () {
                search.classList.remove('error');
            }, 2000);
        }

        input.value = '';
    };

    var toggleWishList = function toggleWishList(id, elem) {
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

    var addBasket = function addBasket(goodsId) {
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

    var removeFromBasket = function removeFromBasket(goodsId) {
        delete goodsBasket[goodsId];
        wishListAndBasketTotalCount();
        cookieQuery();
        actionsOpenBasket();
    };

    var increaseBasketPosition = function increaseBasketPosition(goodsId) {
        goodsBasket[goodsId] += 1;
        wishListAndBasketTotalCount();
        cookieQuery();
        actionsOpenBasket();
    };

    var decreaseBasketPosition = function decreaseBasketPosition(goodsId) {
        if (goodsBasket[goodsId] < 2) {
            return;
        }

        goodsBasket[goodsId] -= 1;
        wishListAndBasketTotalCount();
        cookieQuery();
        actionsOpenBasket();
    }; //events handlers


    var basketHandler = function basketHandler(event) {
        var target = event.target;

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

    var goodsHandler = function goodsHandler(event) {
        var target = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }

        if (target.classList.contains('card-add-cart')) {
            addBasket(target.dataset.goodsId);
        }
    }; //initialize


    var init = function init() {
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