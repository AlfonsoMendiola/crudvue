<template>
<form @submit.prevent="procesarFormulario">
  <Input :tarea="tarea"></Input>

  

</form>
<hr>
<ListaTareas></ListaTareas>

</template>

<script>
import Input from '../components/Input.vue'
import ListaTareas from '../components/ListaTareas.vue'
import {mapActions} from 'vuex'
const shortid = require('shortid'); //libreria previamnete instalada para generar id

export default {
  name: 'Home',
  components: {
    Input,
    ListaTareas
  },
  data() {
    return {
      tarea:{
        id: '',
        nombre: '',
        categorias: [],
        estado: '',
        numero: 0,
      }
    }
  },
  methods:{
    ...mapActions(['setTareas', 'cargarLocalStorage']),
    procesarFormulario(){
      console.log(this.tarea);
      if(this.tarea.nombre.trim() === ""){
        console.log('Campo vacio');
      }else{
        console.log('No esta vacio');
        //generar id
        this.tarea.id = shortid.generate();
        console.log(this.tarea.id);
        //enviar los datos a vuex
        this.setTareas(this.tarea);

        //limpiar datos
        this.tarea = {
          id: '',
          nombre: '',
          categorias: [],
          estado: '',
          numero: 0
        }
      }
      
    }
  },
  created(){
    this.cargarLocalStorage();
  }
  
}
</script>
