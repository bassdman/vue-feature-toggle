<template>
  <div v-bind:feature-name="name" v-bind:feature-variant="variant" v-if="isVisible">
    <slot></slot>
  </div>
</template>
 
<script>
 

var _showLogs = false;
var log = function(message)
{
    if(_showLogs === true)
    {
      var hasBoldTag = message.indexOf('<b>') != -1;
      var hasVisibleKeyword = message.indexOf('visible') != -1;
      var hasHiddenKeyword = message.indexOf('hidden') != -1;

      var _message = message.replace('visible','%cvisible');
      _message = _message.replace('hidden','%chidden');
  
      if(hasVisibleKeyword)
        console.log(_message,"color:green;font-weight:bold;");
      else if(hasHiddenKeyword)
        console.log(_message,"color:red;font-weight:bold;");
      else if(hasBoldTag)
      {
          _message = _message.replace('<b>','%c');
          var parts = [_message,'font-weight:bold;']
          console.log.apply(null,parts);
      }
      else
        console.log(message);
    }
}
var logAndReturn = function(returnValue,message)
{
  log(message);
  log('');
  return returnValue;
}

var getVisibility = function(visibilityFn, functionname,data, name, variant)
{
    if(visibilityFn == null)
      return undefined;

    var calculatedVisibility = visibilityFn(data,name,variant);

    if(typeof calculatedVisibility == 'boolean')
    {
      return calculatedVisibility;
    }
      
      return logAndReturn(false,`The ${functionname} returns ${calculatedVisibility}. => Please return true or false. This result (and all non-boolean results) will return false.`);
}

var visibilities = {

};
var getKey = function(name, variant)
{
    var _name = name.toLowerCase();
    if(typeof variant == 'string')
    {
      _name += "#" + variant.toLowerCase();
    }
 
    return _name;
}
var getVisibilityFn = function(variantOrFn,fn){
  return fn == null ? variantOrFn : fn;
}


export default {
  props: ['name','variant','data'],
  name : 'feature',
  data () {
    return {
      isVisible: this.isVisible(this.name,this.variant,this.data)
    }
  },
  logAndReturn : function(returnValue, fn)
  {
    return logAndReturn(returnValue,fn)
  },
  log: function(message)
  {
      log(message);
  },
  showLogs : function(showLogs,name,variant){
    _showLogs = showLogs == undefined ? true : showLogs;
  },
  isVisible: function(name,variant,data)
  {
      return this.methods.isVisible(name,variant,data);
  },
  visibility : function(name,variantOrFn,fn){
      if(name == undefined)
        throw new Error('feature.visibility(): 1st parameter name must be defined');

      if(variantOrFn == undefined)
        throw new Error('feature.visibility(): 2nd parameter must either be the variant name or a function'); 

      if(variantOrFn !== undefined && fn == undefined && typeof variantOrFn == 'string')
        throw new Error('feature.visibility(): 3nd parameter must be a function when the 2nd parameter is the variant name'); 

      var key = getKey(name,variantOrFn);
      var visibilityFn = getVisibilityFn(variantOrFn,fn);
      visibilities[key] = visibilityFn;
  },
  requiredVisibility : function(fn){
      if(typeof fn != "function")
        throw new Error('feature.requiredVisibility(): 1st parameter must be a function, but is ' + typeof fn); 

      visibilities['_required'] = fn;
  },
  defaultVisibility : function(fn){
      if(typeof fn != "function")
        throw new Error('feature.defaultVisibility(): 1st parameter must be a function, but is ' + typeof fn); 

      visibilities['_default'] = fn;
  },
  methods: {
    isVisible: function(name,variant,data){
      log(`Check Visibility of <b>Feature "${name}", variant "${variant==undefined?'':variant}"${data? " with data " + JSON.stringify(data) : ""}.`);
      if(name == undefined)
        throw new Error('The attribute "name" is required for tag <feature></feature>. Example: <feature name="aname"></feature>');

      var requiredFn = visibilities['_required'];
      var requiredFnExists = visibilities['_required'] != null;
      var requiredFnResult = getVisibility(requiredFn, 'requiredVisibility', data, name, variant);

      var visibilityFnKey = getKey(name, variant);
      var visibilityFn = visibilities[visibilityFnKey];
      var visibilityFnExists = visibilities[visibilityFnKey] != null;
      var visibilityFnResult = getVisibility(visibilityFn, 'visibility function', data, name, variant);

      var variantExists = variant != null;
      var visibilityOnlyNameFnKey = getKey(name, null);
      var visibilityOnlyNameFn = visibilities[visibilityOnlyNameFnKey];
      var visibilityOnlyNameFnExists = visibilities[visibilityOnlyNameFnKey] != null;
      var visibilityOnlyNameFnResult = getVisibility(visibilityOnlyNameFn, 'visibility function (only name)', data, name, variant);

      var defaultFn = visibilities['_default'];
      var defaultFnExists = visibilities['_default'] != null;
      var defaultFnResult = getVisibility(defaultFn, 'defaultVisibility', data, name, variant);

      if(! requiredFnExists)
          log("No requiredVisibility rule specified for this feature.");
      else if(requiredFnExists && requiredFnResult === true)
          log("The requiredVisibility rule returns true. This feature will be shown when no other rule rejects it.")
      else if(requiredFnExists && requiredFnResult === false)
          return logAndReturn(false,"The requiredVisibility rule returns false. This feature will be hidden.");
      
      if(visibilityFnExists)
          return logAndReturn(visibilityFnResult,`The visibility rule returns ${visibilityFnResult}. This feature will be ${visibilityFnResult ? 'visible' : 'hidden' }.`);
      log('No visibility rule found matching name and variant.');

      if(variantExists && typeof visibilityOnlyNameFnResult == 'boolean')
          return logAndReturn(visibilityFnResult,`Found a visibility rule for name ${name} without variants. The rule returns ${visibilityOnlyNameFnResult}. => This feature will be ${visibilityOnlyNameFnResult ? 'visible' : 'hidden' }.`);
      else if(variantExists)
        log(`No rules found for name ${name} without variants.`)


      if(defaultFnExists)
          return logAndReturn(defaultFnResult,`Found a defaultVisibility rule. The rule returns ${defaultFnResult}. => This feature will be ${defaultFnResult ? 'visible' : 'hidden' }.`);
      log(`No default rule found.`)

      if(requiredFnExists)
          return logAndReturn(true,`Only the requiredVisibility rule was found. This returned true. => This feature will be visible.`);
    
      return logAndReturn(false,'No rules were found. This feature will be hidden.');
    }
  }
}
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
</style>