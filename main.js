(function(Vue, pnp){
	Vue.config.devtools = true;
	var Store = {}
	
	var Mixins = {
		methods:{
			getItems:function(){
				return pnp.sp.web.lists.getByTitle('Todo').items.expand('AttachmentFiles').top(30).getPaged()
					.then(function(response){
						response.results = response.results.map(function(current){
							current.TitleUpper = current.Title.toUpperCase();
							return current	
						})
						return response
					})
					.then(function(response){
						response.results = response.results.map(function(current){
							current.now  = Date.now()
							return current	
						})

						return response
					})
					.then(function(response){
						return response
					})
			},
			addItems:function(object){
				return pnp.sp.web.lists.getByTitle('Todo').items.add(object)
			},
			deleteItem:function(id){
				return pnp.sp.web.lists.getByTitle('Todo').items.getById(id).delete()
			},
			updateItem:function(newObject){
				return pnp.sp.web.lists.getByTitle('Todo').items.getById(id).update(newObject)
			}
		}
	}
		
	var Increment = Vue.component('increment', {
		mixins:[Mixins],
		props:['counter'],
		methods:{
			increment:function(){
				Vue.set(this, 'counter', this.counter + 1)
			},
			decrement:function(){
				Vue.set(this, 'counter', this.counter - 1)
			}	
		},
		template:[
			'<section id="increment-app">',
				'<p>{{counter}}</p>',
				'<input type="button" value="incremente"  v-on:click="increment()"/>',
				'<input type="button" value="decrement"  v-on:click="decrement()"/>',
			'</section>'
		].join('')
	})
	
	var TodoApp = Vue.component('todo-app', {
		mixins:[Mixins],
		data:function(){
			return {
				items:{results:[]},
				newItem:'',
			}
		},
		created:function(){
			this.initialize()
		},
		methods:{
			initialize:function(){
				this.getItems()
				.then(function(response){
					Vue.set(this, 'items', response)
				}.bind(this))
			},
			clearForm:function(){
				Vue.set(this, 'newItem', '')
			},
			addItem:function(){
				if(!this.newItem)return
				return this.addItems({Title: this.newItem})
					.then(this.initialize.bind(this))
					.then(this.clearForm.bind(this))
			},
			deleteI:function(id){
				return this.deleteItem(id)
					.then(this.initialize.bind(this))
			}
		},
		template:[
			'<section id="root">',
				'<input type="text" v-on:keyup.enter="addItem()" v-model="newItem" />',
				'<ul>',
					'<li v-for="item in items.results">',
						'<p>{{item.TitleUpper}}</p>',
						'<img v-for="img in item.AttachmentFiles" v-bind:src="img.ServerRelativeUrl" />',
						'<input type="button" value="Deletar" v-on:click="deleteI(item.Id)" />',
					'</li>',
					'<li v-if="!items.results.length">Nenhum item encontrado</li>',
				'</ul>',
			'</section>'
		].join('')
	})
	
	new Vue({
		el:'#root-app',
		mixins:[Mixins],
		template:[
			'<section id="root">',
				'<increment :counter="0"></increment>',
				'<todo-app></todo-app>',
			'</section>'
		].join(''),
	})

})(Vue, $pnp)