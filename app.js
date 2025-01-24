const { createApp } = Vue;

createApp({
  template: `
    <div>
      <h1>Lista de Productos Tolkien</h1>
    

      <br><br>


    </div>

    <!--El sidebar lo he sacado de: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapse_sidebar-->
    

    <!--Hago un bucle sobre el carrito para poder iterar sobre los objetos del mismo, gracias a que tengo a su vez un diccionario puedo usar las claves-->
    <div id="mySidebar" class="sidebar">
    <div id ="bucle_side" v-for="i in this.carrito">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
        <h2>{{i["nombre"]}}</h2>
        <p>Precio unitario {{i["precio"]}} {{divisa}}</p>
        <p>Cantidad {{i["cantidad"]}}</p>
        
      </div>
      <h3>El total es: </h3>
      <p v-if="totalPrice > 0">Total del carrito: {{ totalPrice.toFixed(2) }} {{divisa}}</p>

      <button id="btn_compra">Comprar</button>

      <br><br>

      <button id="btn_vaciar" @click="vaciarCarrito()" >Vaciar Carrito</button>


    </div>

<div id="main">
  <button class="openbtn" onclick="openNav()">☰ Carrito</button>  
  
</div>
 

<br>

<h3>Selecciona la Divisa</h3>
  
<!--Un desplegable con las opciones de moneda que tengo-->

<select class="form-select" aria-label="Default select example" v-model="divisa" @click="cambiarDivisa">
  <option class ="opcion_moneda" value="USD">USD</option>
  <option class ="opcion_moneda" value="EUR">EUR</option>
</select>

<br>

    <!--Visualizo los datos mediante un card de Bootstrap y hago un bucle para que se muestre la información de cada producto-->

    <div class="row row-cols-1 row-cols-md-3 g-4">
  <div v-for="item in paginatedProducts" :key="item.id" class="col">
    <div class="card h-100">
      <img :src="item.imagen" class="card-img-top" :alt="item.nombre" style="width: 100%; height: 420px;">
      <div class="card-body">
        <h5 class="card-title">{{ item.nombre }}</h5>
        <p class="card-text">Precio: {{ (item.precio).toFixed(2) }} {{ divisa }}</p>


        <!--Input para seleccionar la cantidad de productos-->
        <span>Cantidad:</span> <br>
        <input type="number" v-model="item.cantidad" min="1" placeholder="Cantidad" /> <br>

        <br>

        <button class="btn btn-primary" @click="anadirAlCarrito(item)">Añadir al Carrito</button>
      </div>
    </div>
  </div>
</div>


<div class="pagination">
<button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
<span>Página {{ currentPage }} de {{ totalPages }}</span>
<button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
</div>

  `,
  data() {
    return {
      productos:[
        { id: 1, nombre: "Anillo Unico", precio: 900000, imagen: "img/1.webp", cantidad: 1, precio_original: 900000 },
        { id: 2, nombre: "Orcrist", precio: 700000, imagen: "img/2.webp", cantidad: 1, precio_original: 700000 },
        { id: 3, nombre: "Anduril", precio: 100000, imagen: "img/3.webp", cantidad: 1, precio_original: 100000 },
        { id: 4, nombre: "Silmarils", precio: 1000000000, imagen: "img/4.webp", cantidad: 1, precio_original: 1000000000 },
        { id: 5, nombre: "Corona de Morgoth", precio: 8000000, imagen: "img/5.webp", cantidad: 1, precio_original: 8000000 },
        { id: 6, nombre: "Lanza Gil-Galad", precio: 500000, imagen: "img/6.webp", cantidad: 1, precio_original: 500000 },
        { id: 7, nombre: "Mapa Montaña Solitaria", precio: 20000, imagen: "img/7.webp", cantidad: 1, precio_original: 20000 },
        { id: 8, nombre: "Llave Erebor", precio: 100000, imagen: "img/8.webp", cantidad: 1, precio_original: 100000 },
        { id: 9, nombre: "Dardo", precio: 800000, imagen: "img/9.webp", cantidad: 1, precio_original: 800000 },
        { id: 10, nombre: "Cerveza Poney Pisador", precio: 3000, imagen: "img/10.webp", cantidad: 1, precio_original: 3000 },
        { id: 11, nombre: "Daga de Morgul", precio: 90000, imagen: "img/11.webp", cantidad: 1, precio_original: 90000 },
        { id: 12, nombre: "La piedra del Arca", precio: 100000000000000, imagen: "img/12.webp", cantidad: 1, precio_original: 100000000000000 },
        { id: 13, nombre: "Barco de Cirdan", precio: 60000000, imagen: "img/13.webp", cantidad: 1, precio_original: 60000000 },
        { id: 14, nombre: "Terreno de Isengard", precio: 2000000000, imagen: "img/14.webp", cantidad: 1, precio_original: 2000000000 },
        { id: 15, nombre: "Baston de Gandalf", precio: 777777777, imagen: "img/15.webp", cantidad: 1, precio_original: 777777777 },
        { id: 16, nombre: "Mazo de Sauron", precio: 40000000, imagen: "img/1.webp", cantidad: 1, precio_original: 40000000 },
        { id: 17, nombre: "Armadura Uruk-Hai", precio: 20000, imagen: "img/2.webp", cantidad: 1, precio_original: 20000 },
        { id: 18, nombre: "Casa de Bilbo Bolsón", precio: 999999999, imagen: "img/3.webp", cantidad: 1, precio_original: 999999999 },
      ],
      currentPage: 1,
      itemsPerPage: 3,
      carrito: [],
      monedas: [],
      divisa: 'USD'
    };
  },
  computed: {

    // Métodos para calcular el total de las páginas, los productos que hay en las mismas, el precio total del carrito y la carga de monedas disponibles de la API (aunque no use eso ya que tendría que hacer 1 if por cada, pero dejo el método para un futuro)
    totalPages() {
      return Math.ceil(this.productos.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.productos.slice(start, end);
    },

    totalPrice() {
      return this.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    }
  },
  created() { // Método para cargar monedas al crear el componente : https://www.w3schools.com/vue/showvue.php?filename=demo_ref_lh_created_2  aquí un ejemplo de como cambiar un componente
    this.cargarMonedas(); // Carga las monedas desde la API
  },

 
  
  
  methods: {
    // Métodos para cambiar de página en la paginación
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    // Método para añadir al carrito
    anadirAlCarrito(item) {
      const existingItem = this.carrito.find((item_carrito) => item_carrito.id === item.id); // Verificar si el producto está en el carrito

      if (existingItem) {
        existingItem.cantidad += item.cantidad; // Incremento la cantidad si el producto ya está en el carrito
      } else {
        // Si el producto no está en el carrito, se añade
        alert(`Añadido al carrito: ${item.nombre}`);
        const diccionario = {
          "id": item.id,
          "nombre": item.nombre,
          "precio": item.precio,
          "cantidad": item.cantidad 
        };
        this.carrito.push(diccionario);
      }
      console.log(this.carrito);
    },
    
    vaciarCarrito(){
      this.carrito = []; // Vacio el carrito
    },
 

    cambiarDivisa() {
      // Método para cambiar de divisa
      for (let i = 0; i < this.productos.length; i++) { // Bucle for para iterar por cada producto del array

        const producto = this.productos[i];

        if (this.divisa === 'USD') {
          producto.precio = producto.precio_original; // Si está en dólares el precio se mantiene

        } else if (this.divisa === 'EUR') {
          producto.precio = producto.precio_original * this.monedas['EUR']; // Si está en Euros, cambio el precio según la conversión de la API
        }
      }
    },

    
    async cargarMonedas() {
      // Función asíncrona para obtener los datos de la API y para eso uso un fetch
      const response = await fetch('https://v6.exchangerate-api.com/v6/bdb9aa775e6bb6b7ef94b7f1/latest/USD');
      const data = await response.json();
      this.monedas = data.conversion_rates; // guardo las monedas en el array (para eso uso conversion_rates que es el campo de la API)

  
      for (let i = 0; i < this.productos.length; i++) {
        const producto = this.productos[i];

        producto.precio_original = producto.precio; // guardo el precio original al cargar las monedas
      }
    },
  },
}).mount('#app');
