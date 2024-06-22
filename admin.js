let plus = document.querySelector(".plus");
let times = document.querySelector(".fa-times");
let add_customer = document.querySelector(".add-customer");

plus.onclick =()=>{
    add_customer.classList.add("active");
}

times.onclick =()=>{
    add_customer.classList.remove("active")
}