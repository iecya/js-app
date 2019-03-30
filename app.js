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
    var currentProduct;
    var currentVariant;

    function formatCurrency(num, currency) {
        return num.toLocaleString('en-GB', {style: 'currency', currency: currency})
    }

    function updateImage(prod) {
        var imageSize = (windowWidth < 769) ? 'normal' : 'huge'
        const src = prod.images[0][imageSize]
        document.getElementById('product-image').setAttribute('src', src)
    }

    function initName(data) {
        document.getElementById('product-name').innerText = data.name
    }

    function updatePrice(prod, skuIdx) {
        const sku = skuIdx || 0
        const price = prod.skus[sku].price
        document.getElementById('current-price').innerText = formatCurrency(price.currentPrice, price.currency)
        if (price.previousPrice) {
            document.getElementById('previous-price').innerText = "Was " + formatCurrency(price.previousPrice, price.currency)
            document.getElementById('price-saving').innerText = "Save " + formatCurrency((price.previousPrice - price.currentPrice), price.currency)
        }
    }

    function productColors(colors, selectedColor) {
        const el = document.getElementById('product-colors')
        for (c = 0; c < colors.length; c++) {
            const item = document.createElement("li")
            item.setAttribute("data-color", colors[c].colour)
            item.style.background = colors[c].hexCode
            if (colors[c].colour === selectedColor) {
                item.classList.add('active')
            }
            el.append(item)
        }
    }

    function initColor(data, prod) {
        selectedColor = prod.colour
        const el = document.getElementById('product-selected-color')
        el.innerText = (el.innerText + ' ' + selectedColor)
        productColors(data.styles, selectedColor)
    }

    function initSize(prod) {
        const elSel = document.getElementById("product-size")
        const defaultOption = document.createElement("option")
        defaultOption.setAttribute("disabled", true)
        defaultOption.setAttribute("selected", true)
        defaultOption.innerText = "Please select"
        elSel.append(defaultOption)
        for (s = 0; s < prod.skus.length; s++) {
            const currentSize = prod.skus[s].size
            const option = document.createElement("option")
            option.setAttribute("value", currentSize["Size"])
            option.innerText = currentSize["Size"]
            elSel.append(option)
        }
    }

    function initQty(variant) {
        const elSel = document.getElementById("product-qty")
        const maxQty = variant.maximumPurchaseQuantity
        for (s = 0; s < maxQty; s++) {
            const val = s + 1
            const option = document.createElement("option")
            option.setAttribute("value", val)
            option.innerText = val
            elSel.append(option)
        }
    }

    function initProdInfo(data) {
        const el = document.getElementById("product-info")
        for (i = 0; i < data.productInformation.length; i++) {
            const currentInfo = data.productInformation[i]
            const textEl = document.createElement("p")
            textEl.innerText = currentInfo.text
            el.append(textEl)
            if (currentInfo.hasOwnProperty("children")) {
                textEl.classList.add("info-title")
                const children = document.createElement("ul")
                for (c = 0; c < currentInfo.children.length; c++) {
                    const item = document.createElement("li")
                    item.innerText = currentInfo.children[c].text
                    children.append(item)
                }
                el.append(children)
            }
        }
    }


    function initProduct(data) {
        const prod = data.styles[0]
        currentProduct = prod
        currentVariant = prod.skus[0]
        updateImage(prod)
        initName(data)
        updatePrice(prod)
        initColor(data, prod)
        initSize(prod)
        initQty(currentVariant)
        initProdInfo(data)
    }

    getProductData(initProduct)
})