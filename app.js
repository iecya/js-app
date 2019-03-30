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

var data;
const windowWidth = window.innerWidth
var selectedColor;
var currentVariant;
var variants;
var selectedQty = 1;



// ==================== UTIL FUNCTIONS ==================== //

function getProductData(callback) {
    var request = new XMLHttpRequest();
    const prods = ["p60209839", "p60211771"]
    const pid = prods[Math.floor(Math.random() * prods.length)]

    request.onreadystatechange = function() {
        if (request.readyState == request.DONE) {
            if (request.status == 200) {
                data = JSON.parse(request.response)
                callback()
            }
            else if (request.status == 400) {
                alert('There was an error 400');
            }
            else {
                alert('something else other than 200 was returned');
            }
        }
    }

    request.open('GET', '/product-details?pid=' + pid, true)
    request.send()
}

function formatCurrency(num, currency) {
    return num.toLocaleString('en-GB', {style: 'currency', currency: currency})
}

function getSize(variant) {
    return variant.size.Size || variant.size["Std Dress Size"] + "-" + variant.size["Length"]
}



// ==================== UPDATE FUNCTIONS ==================== //

function updateImage(prod) {
    var imageSize = (windowWidth < 769) ? 'normal' : 'huge'
    const src = prod.images[0][imageSize]
    document.getElementById('product-image').setAttribute('src', src)
}

function updatePrice(variant) {
    const price = variant.price
    document.getElementById('current-price').innerText = formatCurrency(price.currentPrice, price.currency)
    if (price.previousPrice) {
        document.getElementById('previous-price').innerText = "Was " + formatCurrency(price.previousPrice, price.currency)
        document.getElementById('price-saving').innerText = "Save " + formatCurrency((price.previousPrice - price.currentPrice), price.currency)
    }
}

function updateColorText(prod) {
    selectedColor = prod.colour
    const el = document.querySelector('#product-selected-color span')
    el.innerText = (selectedColor)
}

function updateSelectedColor(color) {
    document.querySelector("[data-color='" + selectedColor + "']").classList.remove('active')
    selectedColor = color
    document.querySelector("[data-color='" + selectedColor + "']").classList.add('active')
}

function resetSize() {
    document.getElementById('product-size').value = "default"
}


function updateProductByColor(color) {
    if (color !== selectedColor) {
        const prod = data.styles.filter(function(style) {
            return style.colour === color
        })[0]
        updateSelectedColor(color)
        updateImage(prod)
        updateColorText(prod)
        const currentSize = getSize(currentVariant)

        // set variant based on selected size or return first sku
        const variant = prod.skus.filter((function(s) {return getSize(s) === currentSize}))[0] || prod.skus[0]

        // if the new variant doesn't have the selected variant size, then reset the size select
        if (getSize(variant) === currentSize) {
            resetSize()
        }
        updatePrice(variant)
        initQty(variant)
        document.getElementById("product-sku-input").value = variant.upc
    }
}

function updateVariantBySize(el) {
    const newSize = el.value
    const currentSize = getSize(currentVariant)
    if (newSize !== currentSize) {
        const newVariant = variants.filter(function(v) {
            return getSize(v) === newSize
        })[0]
        currentVariant = newVariant
        document.querySelector('#product-size-wrapper p span').innerText = newSize
        initQty(newVariant)
        updatePrice(newVariant)
        document.getElementById("product-sku-input").value = newVariant.upc
    }
}

function updateQty(el) {
    selectedQty = el.value
}


// ==================== INIT FUNCTIONS ==================== //

function initName(data) {
    document.getElementById('product-name').innerText = data.name
}

function initColor(data, prod) {
    updateColorText(prod)
    productColors(data.styles, selectedColor)
}

function initSize(prod) {
    const elSel = document.getElementById("product-size")
    const defaultOption = document.createElement("option")
    defaultOption.setAttribute("disabled", true)
    defaultOption.setAttribute("selected", true)
    defaultOption.setAttribute("value", "default")
    defaultOption.innerText = "Please select"
    elSel.append(defaultOption)
    for (s = 0; s < prod.skus.length; s++) {
        const currentSize = prod.skus[s].size
        const sizeText = currentSize["Size"] || currentSize["Std Dress Size"] + " - " + currentSize["Length"]
        const sizeVal = currentSize["Size"] || currentSize["Std Dress Size"] + "-" + currentSize["Length"]
        const option = document.createElement("option")
        option.setAttribute("value", sizeVal)
        option.innerText = sizeText
        elSel.append(option)
    }
}

function initQty(variant) {
    const elSel = document.getElementById("product-qty")
    elSel.innerHTML = ''
    const maxQty = variant.maximumPurchaseQuantity
    for (s = 0; s < maxQty; s++) {
        const val = s + 1
        const option = document.createElement("option")
        option.setAttribute("value", val)
        option.innerText = val
        elSel.append(option)
    }
    elSel.value = selectedQty
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

function initProduct() {
    const prod = data.styles[0]
    variants = prod.skus
    currentVariant = prod.skus[0]
    updateImage(prod)
    initName(data)
    updatePrice(currentVariant)
    initColor(data, prod)
    initSize(prod)
    initQty(currentVariant)
    initProdInfo(data)
    document.getElementById("product-sku-input").value = currentVariant.upc
}


// ==================== NEW ELEMENTS FUNCTIONS ==================== //

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

ready(function() {
    getProductData(initProduct)

    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute("data-color")) {
            updateProductByColor(e.target.getAttribute("data-color"))
        }
    })
})