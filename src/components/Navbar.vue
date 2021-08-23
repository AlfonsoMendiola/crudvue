<template>

<div class="navbar navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand">
        Formularios
    </router-link>
    <div class="d-flex">
        <router-link v-if="usuarioAutenticado" class="btn btn-dark" to="/">
            Tareas
        </router-link>

        <router-link v-if="!usuarioAutenticado" class="btn btn-dark" to="/ingreso">
            Ingresar
        </router-link>

        <router-link v-if="!usuarioAutenticado" class="btn btn-dark" to="/registro">
            Registrar
        </router-link>

        <button v-if="usuarioAutenticado" @click="cerrarSesion" class="btn btn-dark">Cerrar Sesión</button>
    </div>
</div>
  
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
    computed:{
        ...mapGetters(['usuarioAutenticado'])
    },
    methods:{
        ...mapActions(['cerrarSesion'])
    }
}
</script>

