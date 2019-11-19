<template>
  <div class="row">
    <div class="col-md-12" v-if="!openapi.openapi.startsWith('3.')">
    	OpenAPI schema is not supported: {{ openapi.openapi }}
    </div>
    <div class="col-md-12" v-else>
       <h1>{{ openapi.info.title }}<span class="badge badge-secondary">{{ openapi.info.version }}</span></h1>
       <p>
       	{{ openapi.info.description }}
       </p>
       <ul class="list-unstyled">
       	<li><a :href="openapi.info.termsOfService">Terms of service</a></li>
       	<li><a :href="`mailto:${ openapi.info.contact.email }`">Contact the developer</a></li>
       	<li><a :href="openapi.info.license.url">{{ openapi.info.license.name }}</a></li>
       	<li><a :href="openapi.externalDocs.url">{{ openapi.externalDocs.description }}</a></li>
       </ul>
       <p>
         <form>
           <div class="form-group">
             <label for="servers">Servers</label>
             <select class="form-control" id="servers">
               <option v-for="server in openapi.servers">{{ server.url }}</option>
             </select>
           </div>
         </form>
       </p>
       <div class="accordion" role="tablist">
	    <b-card no-body class="mb-1" :key="tag.name" v-for="(tag, index) in openapi.tags">
	      <b-card-header header-tag="header"  v-b-toggle="`accordion${index}`" class="mb-0" role="tab">
	        <b-button variant="link" href="#"><strong>{{ tag.name }}</strong></b-button><span class="text-muted align-middle">{{ tag.description }}</span>
	        <span v-if="tag.externalDocs" class="pull-right">{{ tag.externalDocs.description }}: <a :href="tag.externalDocs.url">{{ tag.externalDocs.url }}</a></span>
	      </b-card-header>
	      <b-collapse :id="`accordion${index}`" accordion="accordion" role="tabpanel">
	        <b-card-body>
	          
	          
		       <div class="accordion" role="tablist">
			    <b-card no-body class="mb-1" :key="index" v-for="(method, index) in getMethodsByTag(tag.name)">
			      <b-card-header header-tag="header" class="mb-0" role="tab">
			        <i class="fa fa-lock" v-if="method.security"></i>&nbsp;<span :class="`badge ${getColorByMethod(method)}`">{{ method.methodName.toUpperCase() }}</span> <b-button variant="link" href="#" v-b-toggle="`accordion${tag.name}${index}`"><del v-if="method.deprecated"><strong class="text-muted">{{ method.path }}</strong></del><strong v-else>{{ method.path }}</strong></b-button><span class="text-muted align-middle">{{ method.summary }}</span>
			      </b-card-header>
			      <b-collapse :id="`accordion${tag.name}${index}`" :accordion="`accordion${tag.name}`" role="tabpanel">
			        <b-card-body>
			          <p v-if="method.deprecated" class="text-muted">Warning: Deprecated</p>
			          <p v-if="method.description">{{ method.description }}</p>
			          <div v-if="method.parameters && method.parameters.length > 0">
			            <h4>Parameters</h4>
			            <table class="table table-striped">
			          	  <thead>
			          	    <tr>
			          	      <th scope="col" style="width: 20%">Name</th>
			          	      <th scope="col">Value</th>
			          	    </tr>
			            	</thead>
			            	<tbody>
			            	  <tr v-for="param in method.parameters">
			            	  	<td>
			          	    	  <strong>{{ param.name }}</strong>
			          	    	  <span v-if="param.required" class="text-danger"><small>* required</small></span><br>
			            	  	  <span v-if="param.schema.type">{{ param.schema.type }} <span v-if="param.schema.type === 'array'">[{{ param.schema.items.type }}]</span><span v-if="param.schema.format">({{ param.schema.format }})</span><br></span>
			            	  	  <span v-if="param.in" class="text-muted">({{ param.in }})</span>
			            	  	</td>
			            	  	<td>
			          	    		<p>{{ param.description }}</p>
			          	    		<p v-if="param.schema.items && param.schema.items.enum">Available values: {{ param.schema.items.enum.join(', ') }}</p>
			            	  	</td>
			            	  </tr>
			            	</tbody>
			            </table>
			          </div>
			          <div v-if="method.requestBody">
			            <h4>Request body<span v-if="method.requestBody.required" class="text-danger"><small>* required</small></span></h4>
			            <p v-if="method.requestBody.description">{{ method.requestBody.description }}</p>
			          	<pre v-if="method.requestBody.content['application/json']" class="text-white bg-dark"><code>
{{ renderSchemaReference(' ', method.requestBody.content['application/json'].schema) }}
</code></pre>			            
			          </div>
			          <h4>Responses</h4>
			          <table class="table table-striped">
			          	<thead>
			          	  <tr>
			          	    <th scope="col" style="width: 20%">Code</th>
			          	    <th scope="col">Description</th>
			          	  </tr>
			          	</thead>
			          	<tbody>
			          	  <tr v-for="(response, responseName) in method.responses">
			          	    <td>{{ responseName }}</td>
			          	    <td>
			          	    	<p>{{ response.description }}</p>
			          	  		<pre v-if="response.content['application/json']" class="text-white bg-dark"><code>
{{ renderSchemaReference('   ', response.content['application/json'].schema) }}
</code></pre>   	
			          	    </td>
			          	  </tr>
			          	</tbody>
			          </table>
	          	    </b-card-body>
			      </b-collapse>
			    </b-card>
		       </div>       
	          
	        </b-card-body>
	      </b-collapse>
	    </b-card>
       </div>       
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      openapi: {}
    }
  },
  methods: {
    findModel (schemaName) {
      // '#/components/schemas/Pet'
      const vm = this
      var paths = schemaName.split('/')
      return vm.openapi[paths[1]][paths[2]][paths[3]]
    },
    renderSchemaReference (intendation, schemaReference) {
      var result = ''
      if (schemaReference.type && schemaReference.type === 'array') {
        result += intendation + '[\n'
        result += this.renderSchemaReference(intendation + '  ', schemaReference.items)
        result += intendation + ']'
      } else if (schemaReference.$ref) {
        result += intendation + '{\n'
        result += this.renderModel(intendation + '  ', schemaReference.$ref)
        result += intendation + '}\n'
      }
      return result
    },
    renderModel (intendation, schemaName) {
      var result = ''
      const vm = this
      var model = this.findModel(schemaName)
      Object.keys(model.properties).forEach(function (property, key, arr) {
        result += intendation + '"' + property + '": '
        var propertyValue = model.properties[property]
        if (propertyValue.type === 'integer') {
          result += '0'
        } else if (propertyValue.type === 'string') {
          if (propertyValue.example) {
            result += '"' + propertyValue.example + '"'
          } else if (propertyValue.enum) {
            result += '"' + propertyValue.enum[0] + '"'
          } else {
            result += '"string"'
          }
        } else if (propertyValue.type === 'array') {
          result += '[\n'
          if (propertyValue.items.type) {
            if (propertyValue.items.type === 'string') {
              result += intendation + '  "string"\n'
            } else if (propertyValue.items.type === 'integer') {
              result += intendation + '  0\n'
            }
          } else if (propertyValue.items.$ref) {
            result += intendation + '  {\n'
            result += vm.renderModel(intendation + '    ', propertyValue.items.$ref)
            result += intendation + '  }\n'
          }
          result += intendation + ']'
        } else if (propertyValue.$ref) {
          result += '{\n'
          result += vm.renderModel(intendation + '  ', propertyValue.$ref)
          result += intendation + '}'
        }
        if (!Object.is(arr.length - 1, key)) {
          result += ','
        }
        result += '\n'
      })
      return result
    },
    getColorByMethod (method) {
      var methodName = method.methodName
      if (method.deprecated === true) {
        return 'badge-secondary'
      }
      if (methodName === 'post') {
        return 'badge-success'
      } else if (methodName === 'get') {
        return 'badge-primary'
      } else if (methodName === 'put') {
        return 'badge-warning'
      } else if (methodName === 'delete') {
        return 'badge-danger'
      }
      return 'badge-secondary'
    },
    getMethodsByTag (tagName) {
      var result = []
      const vm = this
      Object.keys(vm.openapi.paths).forEach(function (path) {
        var pathValue = vm.openapi.paths[path]
        Object.keys(pathValue).forEach(function (method) {
          var methodValue = pathValue[method]
          for (var i = 0; i < methodValue.tags.length; i++) {
            if (methodValue.tags[i] === tagName) {
              methodValue.methodName = method
              methodValue.path = path
              result.push(methodValue)
            }
          }
        })
      })
      return result
    }
  }
}
</script>