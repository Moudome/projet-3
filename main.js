let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
let test = document.querySelector(".cart-remove");



// open cart

cartIcon.onclick = () => {
    cart.classList.add("active");
};
//close cart
closeCart.onclick = () => {
    cart.classList.remove("active"); 
};

//active la carte
if( document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready);
}else{
    ready();
 }

 //fonction pour fonctionne
 function ready(){
    //remove carte
    var removeCartButtons = document.getElementsByClassName("cart-remove");
     console.log(removeCartButtons)
    for ( var i = 0; i < removeCartButtons.length; i++) {

        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem); 
    }
    //quantite changes
    var quantityInputs = document.getElementsByClassName("cart-quantite ");
    for ( var i = 0; i< quantityInputs.length; i++) {

        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged); 
    }
    // add to card 
    var addCart = document.getElementsByClassName("add-cart");
    for ( var i = 0; i < addCart.length; i++) {

        var button = addCart[i];
        button.addEventListener("click", addCartClicked); 
    }
    loadCartItems();
   
    // buy button
    document.getElementsByClassName("btn-buy")[0].addEventListener("click",buyButtonClicked)

 }
 
 //fontion button buy
 function buyButtonClicked(){
    alert("c est super");
    var cartContent = document.getElementsByClassName("cart-content")[0];
    while(cartContent.hasChildNodes()){
     cartContent.removeChild(cartContent.firstChild);
    }
     updatetotal();
   }

 //suprimmer la carte

 function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove(); 
    updatetotal();
    saveCartItems();
} 
//change quantite
function quantityChanged(event){
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon ();
}
// add cart function
function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("production-title ")[0].innerText;
    var price = shopProducts.getElementsByClassName("prix")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("produ-image")[0].src;
    addProductToCart(title, price, productImg); 
    updatetotal();
    saveCartItems();
    updateCartIcon ();
}

function addProductToCart(title, price, productImg){
    var cartshopbox = document.createElement("div");
    cartshopbox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-produit-title");
    for ( var i = 0; i< cartItemsNames.length; i++){
        if (cartItemsNames[i].innerText == title){
            alert("you have already this items to cart");
            return;
        }
    }

    var cartBoxContent = ` 
       <img src="${productImg }" alt="" class="cart-img">
       <div class="detail-box">
              <div class="cart-produit-title">${title}</div>
              <div class="cart-prix">${price}</div>
               <input type="number" name="" id="" value="1" class="cart-quantite">
        </div>
        <i class='bx bxs-trash-alt cart-remove'  ></i> `;
        cartshopbox.innerHTML = cartBoxContent;
        cartItems.append(cartshopbox);
        cartshopbox
        .getElementsByClassName("cart-remove")[0]
        .addEventListener("click", removeCartItem);
        cartshopbox
        .getElementsByClassName("cart-quantite")[0]
        .addEventListener("change" ,quantityChanged);
        saveCartItems();
        updateCartIcon ();
}
 
//update total
function updatetotal(){
   var cartContent = document.getElementsByClassName("cart-content")[0];
   var cartBoxes = cartContent.getElementsByClassName("cart-box");
   var total = 0;
 for ( var i = 0; i < cartBoxes.length; i++){
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-prix")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantite")[0];
    var price = parseFloat(priceElement.innerText.replace("$", " "));
    var quantity = quantityElement.value;
    total = total + (price * quantity);
}   
     
    total = Math.round( total * 100)/ 100;

    document.getElementsByClassName("total-prix")[0].innerText = "$" + total; 
    // save total to localStorage
    localStorage.setItem("cartTotal", total);
 
}  

//funtion savecart

function saveCartItems () {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = document.getElementsByClassName("cart-box");
    var cartItems = [] ;

    for( var i = 0; i< cartBoxes.length; i++){
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName("cart-produit-title")[0];
        var priceElement = cartBox.getElementsByClassName("cart-prix")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantite")[0];
        var productImg = cartBox.getElementsByClassName("cart-img")[0].src;
         
        var item = {
            title: titleElement.innerText ,
            price: priceElement.innerText ,
            quantity: quantityElement.value ,
            productImg: productImg ,
        };
        cartItems.push(item);
        
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
// load cart
 function loadCartItems (){
    var cartItems = localStorage.getItem("cartItems");
    if (cartItems){
        cartItems = JSON.parse(cartItems);
        for( var i = 0; i < cartItems.length; i++){
            var item =cartItems[i];
            addProductToCart(item.title, item.price,item.productImg);

            var cartBoxes = document.getElementsByClassName("cart-box");
            var cartBox = cartBoxes[cartBoxes.length-1];
            var quantityElement = cartBox.getElementsByClassName("cart-quantite")[0];
            quantityElement.value =item.quantity

        }
    }
    var cartTotal =localStorage.getItem("cartTotal")
    if(cartTotal){
        document.getElementsByClassName("total-prix")[0].innerText = "$" + cartTotal;

    }
    updateCartIcon ();
 }

//quantity cart
function updateCartIcon (){
    var cartBoxes = document.getElementsByClassName("cart-box");
    var quantity = 0 ;
    for(var i = 0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName("cart-quantite")[0];
        quantity += parseInt(quantityElement.value);

    }
    var cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute("data-quantity", quantity);
}  

//pagination
let thisPage = 1;
let limit = 8;
let list = document.querySelectorAll(".shop-content .production-box");

function loadItems(){
    let beginGet = limit * (thisPage - 1);
    let endGet = limit * thisPage - 1;
    list.forEach((item, key) => {
        if(key >= beginGet && key <= endGet){
            item.style.display = "block"; 
        }else{
            item.style.display = "none";
        }
    })
    listPage();
}
loadItems();
function listPage(){
    let count = Math.ceil(list.length / limit);
    document.querySelector(".listPage").innerHTML = "";
    if(thisPage != 1){
        let prev = document.createElement("li");
        prev.innerText = "Prev";
        prev.setAttribute("onclick", "changePage(" + (thisPage - 1 ) +")");
        document.querySelector(".listPage").appendChild(prev);
    }

    for(i = 1; i <= count; i++){
        let newtPage = document.createElement("li");
        newtPage.innerText = i;
        if(i == thisPage){
            newtPage.classList.add("active");
        }
        newtPage.setAttribute("onclick", "changePage(" + i + ")");
        document.querySelector(".listPage").appendChild(newtPage);
    
    }
      if(thisPage != count){
        let next = document.createElement("li");
        next.innerText = "Next";
        next.setAttribute("onclick", "changePage(" + (thisPage + 1 ) +")");
        document.querySelector(".listPage").appendChild(next); 
      }
}
function changePage(i){
    thisPage = i;
    loadItems(); 
}