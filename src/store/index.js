import { createStore } from 'vuex'
import router from '../router';

export default createStore({
  state: {
    tareas: [],
    tarea:{
      id: '',
      nombre: '',
      categorias: [],
      estado: '',
      numero: 0
    },
    user: null
  },
  mutations: {
    setUser(state, payload){
      state.user = payload;
    },
    cargar(state, payload){
      state.tareas = payload;
    },
    set(state, payload){
      state.tareas.push(payload);
      
    },
    eliminar(state, payload){
      state.tareas = state.tareas.filter(item => item.id !== payload);
      
    },
    tarea(state, payload){
      if(!state.tareas.find(item => item.id === payload)){
        router.push('/');
        return;
      }
      state.tarea = state.tareas.find(item => item.id === payload);
    },
    update(state, payload){
      state.tareas = state.tareas.map(item => item.id === payload.id ? payload : item);
      router.push('/');
      
    }
  },
  actions: {
    cerrarSesion({commit}){
      commit('setUser', null);
      router.push('/ingreso');
    },
    async ingresoUsuario({commit}, usuario){
      try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBVd5tOlKDrjpfNZ7ZV7tYQpOBWhPzTJ8U',{
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
          })
        })
        const userDB = await res.json();
        if(userDB.error){
          return console.log(userDB.error);
        }
        commit('setUser', userDB);
        router.push('/');
      } catch (error) {
        console.log(error);
      }
    },
    // Este cargar localS ahora consulta los datos de firebase 
    async registrarUsuario({commit}, usuario){
      try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBVd5tOlKDrjpfNZ7ZV7tYQpOBWhPzTJ8U',{
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true // esta propiedad siempre debe existir y ser true
          })
        })
        const userDB = await res.json();
        console.log(userDB);
        if(userDB.error){
          console.log(userDB.error);
          return;
        }
        commit('setUser',userDB)
        router.push('/');
      } catch (error) {
        console.log(error);
      }
    },
    async cargarLocalStorage({commit, state}){
      try {
        // el fetch por defecto hace una solicitud get y no es necesario configurar lo demas
        const res = await fetch(`https://udemy-api-81abf-default-rtdb.firebaseio.com/tareas/${state.user.localId}.json?auth=${state.user.idToken}`); //el id token se genera cuando se compueba la autenticacion y/o reguistro
        const dataDb = await res.json();

        const arrayTareas = [];
        for(let id in dataDb){
          arrayTareas.push(dataDb[id]);
        }
        
        commit('cargar', arrayTareas)
      } catch (error) {
        console.log(error)
      }
    },
    async setTareas({commit, state}, tarea){
      try{
        // El tareas.json es una ruta para crear el documento en firebase
        // La interpolacion de la variable tarea.id es para que el metodo put pueda recibirla y no sobreescribir los datos en firebase
        // El segundo parametro de fetch es un objeto con sus configuraciones
         const res = await fetch(`https://udemy-api-81abf-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`,{
          method: 'PUT',
          headers: { // La cabecera define el tipo de tato que se trabaja pero es opcional pero
            'Content-Type': 'application/json'
          },
          // En el body van los datos a trabajar en json o en lo que de especifique en la cabecera
          body: JSON.stringify(tarea)
        });
        const dataDB = await res.json();
        console.log(dataDB);
      }catch(error){
        console.log(error)
      }
      commit('set', tarea)
    },
    async deleteTareas({commit, state}, id){
      try {
        await fetch(`https://udemy-api-81abf-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${id}.json?auth=${state.user.idToken}`, {
          method: 'DELETE'
        });
        commit('eliminar', id);
      } catch (error) {
        console.log(error)
      }
      
    },
    setTarea({commit}, id){
      commit('tarea', id)
    },
    async updateTarea({commit, state}, tarea){
      try {
        const res = await fetch(`https://udemy-api-81abf-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`, {
          method: 'PATCH', // patch es como el update de nodejs pero en firebase
          body: JSON.stringify(tarea)
        });
        const dataDB = await res.json();
        commit('update', tarea);
      } catch (error) {
        console.log(error)
      }
      
    }
  },
  getters:{
    // los getters se mapean en las propiedades computadas
    usuarioAutenticado(state){
      // el !! es un if abreviadio donde se retornara verdadero o false
      return !!state.user
    }
  },
  modules: {
  }
})
