function getProductData(callback) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == request.DONE) {
            if (request.status == 200) {
                callback(JSON.parse(request.response))
            }
            else if (request.status == 400) {
                alert('There was an error 400');
            }
            else {
                alert('something else other than 200 was returned');
            }
        }
    }

    request.open('GET', '/product-details?pid=' + 'p60211771', true)
    request.send()
}

function ready(callback){
    // in case the document is already rendered
    if (document.readyState !== 'loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
            if (document.readyState === 'complete') callback();
        });
}

ready(function() {
    const windowWidth = window.innerWidth
    var selectedColor;

    function formatCurrency(num, currency) {
        return num.toLocaleString('en-GB', {style: 'currency', currency: currency})
    }

    function updateImage(data) {
        var imageSize = (windowWidth < 769) ? 'normal' : 'huge'
        const src = data.images[0][imageSize]
        document.getElementById('product-image').setAttribute('src', src)
    }

    function updateName(data) {
        document.getElementById('product-name').innerText = data.name
    }

    function updatePrice(data, styleIdx, skuIdx) {
        const style = styleIdx || 0
        const sku = skuIdx || 0
        const price = data.styles[style].skus[sku].price
        document.getElementById('current-price').innerText = formatCurrency(price.currentPrice, price.currency)
        if (price.previousPrice) {
            document.getElementById('previous-price').innerText = formatCurrency(price.previousPrice, price.currency)
            document.getElementById('price-saving').innerText = formatCurrency((price.previousPrice - price.currentPrice), price.currency)
        }
    }

    function productColors(colors) {
        const el = document.getElementById('product-colors')
        for (c = 0; c < colors.length; c++) {
            console.log('C:', colors[c])
            const item = document.createElement("li")
            item.setAttribute("data-color", colors[c].colour)
            item.style.background = colors[c].hexCode
            console.log('item', item, ' - color', colors[c].hex)
            el.append(item)
        }
    }

    function updateColor(data, styleIdx) {
        const style = styleIdx || 0
        selectedColor = data.styles[style].colour
        const el = document.getElementById('product-selected-color')
        el.innerText = (el.innerText + ' ' + selectedColor)
        productColors(data.styles)
    }

    function updateProduct(data) {
        updateImage(data)
        updateName(data)
        updatePrice(data)
        updateColor(data)
    }

    getProductData(updateProduct)
})