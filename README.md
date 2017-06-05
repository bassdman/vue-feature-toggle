# vue-feature-toggle
[![npm version](https://img.shields.io/npm/v/vue-feature-toggle.svg)](https://www.npmjs.com/package/vue-feature-toggle)
[![npm downloads](https://img.shields.io/npm/dt/vue-feature-toggle.svg)](https://www.npmjs.com/package/vue-feature-toggle)
	
## Install

``` shell
    npm install vue-feature-toggle --save
```

## The Problem
Imagine you have an onlineshop with an testmode and in multiple languages. 
Your shop is written in vue. Anywhere you have a vue-template like this:
``` html
<content-area>
    <!-- Show important debugging information for testmode -->
    <testmode-nav v-if="testmode"></testmode-nav>

    <!-- That's the old one, in a few days the new one, commented out here will be released 
        <left-nav-new v-if></left-nav-new>
    -->
    <left-nav v-if></left-nav>

    <!-- Every shop has a slider with amazing foodinfo on the startpage-->
    <startpage-slider-de ref="food/bratwurst" v-if="shop == 'de'"></startpage-slider-de>
    <startpage-slider-en ref="food/fishnchips" v-if="shop == 'en'"></startpage-slider-en>
    <startpage-slider-fr ref="food/croissant" v-if="shop == 'fr'"></startpage-slider-fr>

    <footer-new></footer-new>
    <!-- 
    New footer just went live. When there are some problems, we rollback and comment out the new footer and uncomment the old one
    <footer-old></footer-old> -->
</content-area>
```
It's generally a bad idea to have visibility rules in the template. Of course, by refactoring the template a little bit the code will look better. 
But that's not the point. The problem is: The view-logic is spread in multiple files and if the viewlogic changes, you have to change in minimum one template.
That's not good.

## The solution
Feature-toggle. All View-Logic is placed in one place. This can be a config file, a webservice or a tool with a User Interface.a
When you want to change a visibility rule, for example "Show feature XYZ also in the french shop", you just have to update the config or add this info in an UI. And no developer is needed for it.
<a href="https://martinfowler.com/articles/feature-toggles.html">Read the article from Martin Fowler about feature toggle for a more understanding.</a>

## The Usage
Look in the example folder for working examples (as soon as the example folder exists ;) ).

### Initialisation
Create a vue project. For example with the vue-cli.
``` shell
    npm install -g vue-cli
    npm init browserify vue-feature-toggle-example
    cd vue-feature-toggle-example
    npm install
```
Now install the vue-feature-toggle component 
``` shell
    npm install vue-feature-toggle --save
```
    
Replace the index.html - file with the following:
``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>vue-feature-example</title>
</head>

<body>
  <div id="app">
        <!-- The name property is required -->
        <feature name="feature1">This is "Feature1"</feature>
        
        <!-- The variant property is optional and can be any string -->
        <feature name="feature2">This is "Feature2"</feature>
        <feature name="feature2" variant="new">This is "Feature2" with variant "new"</feature>
        <feature name="feature2" variant="old">This "Feature2" with variant "old"</feature>
        <feature name="feature2" variant="grumpfel">This "Feature2" with variant "grumpfel"</feature>
        
        <feature name="feature3" variant="old" data="grumpfel">This "Feature3" with variant "old" has some Data.</feature>
        <feature name="feature3" variant="new" :data="{'text':'grumpfel'"}>This "Feature3" with variant "old" has some Data. (watch the : before the data-attribute. Otherwise you'll get this as a string...)</feature>
  </div>
  <script src="dist/build.js"></script>
</body>
</html>
```
    
Replace the src/main.js file with the following: 
``` javascript
var Vue = require('vue');
var feature = require('vue-feature-toggle');

Vue.use(require('vue-resource'));

//Feature1 will always be shown
feature.visibility('feature1',function () {
    return true;
});

//write down the other visibility-rules here    

var vue = new Vue({
    el: '#app',
    components: { 'feature': feature }
})

//IMPORTANT: Don't write your rules after the new Vue()-declaration - they won't work here....
```
### Features
For the next examples we will always use the HTML from above. Just insert the visibility rules under the other rule

#### Basic visibility
```javascript
// shows Feature1
//Feature2 is not configured, so it will be hidden
feature.visibility('feature1',function () {
        //here would be some more complex logic, in this example we keep it simple
        return true;
});
```
```javascript
/* 
    shows all features with name feature2, in this case: 
    <feature name="feature2"/>
    <feature name="feature2" variant="new"/>
    <feature name="feature2" variant="old"/>
    <feature name="feature2" variant="grumpfel"/>
 */
feature.visibility('feature2', function () {
        return true;
});

/*
    This overwrites the rule above for "feature2", variant "new"    
    <feature name="feature2"/> -> shown
    <feature name="feature2" variant="new"/> -> hidden
    <feature name="feature2" variant="old"/> -> shown
    <feature name="feature2" variant="grumpfel"/> -> shown
*/
feature.visibility('feature2','new', function () {
        return false;
});
```
```javascript
/*
You can pass data via the data-attribute. Look at HTML of feature3 as an example. 
*/
feature.visibility('feature3','new', function (data,name,variant) {
      return data == "grumpfel";
});

//Write a : before the data-tag to parse the content in the data-attribute <feature name="feature3" :data="{'text':'grumpfel'"}>
feature.visibility('feature3','new', function (data,name,variant) {
      return data.text == "grumpfel";
});
```
#### Default Visibility
Bored of writing the same visibility rule again and again? Use defaultVisibility. This is the default-rule and will be overwritten by feature.visibility() - rules.
``` javascript
feature.defaultVisibility(function(data,name,variant){
    return true;
});

feature.visibility('feature2', 'new', function(data,name,variant){
    return false;
});
/*
    "Feature2", variant "new" is overwritten, all other features have the defaultVisibility
    <feature name="feature2"/> -> shown
    <feature name="feature2" variant="new"/> -> hidden
    <feature name="feature2" variant="old"/> -> shown
    <feature name="feature2" variant="grumpfel"/> -> shown
*/
```

#### Required Visibility
This rule is allways executed, before the other rules. When it returns false, the other rules are ignored.
``` javascript
/*
   Imagine a config that is loaded via ajax. When the name is in the config, it returns true.
   And this config looks like this: 
   var globalConfig = { "feature2" : true }
*/

feature.requiredVisibility(function(data,name,variant){
    //In this case it returns true, when name == 'feture2'
    return globalConfig[name] === true;
});

/*
  feature2, variant "new" returns false, but requiredConfig returns true. Both rules must match, so it will be hidden
*/
feature.visibility('feature2','new',function(data,name,variant){
    return false;
});

/*
  feature3 returns true, but requiredConfig returns false. Both rules must match, so Feature3 is hidden
*/
feature.visibility('feature3',function(data,name,variant){
    return true;
});

/*
    <feature name="feature2"/> -> shown
    <feature name="feature2" variant="new"/> -> hidden
    <feature name="feature2" variant="old"/> -> shown
    <feature name="feature2" variant="grumpfel"/> -> shown
    
     <feature name="feature3" variant="old"/> -> hidden
    <feature name="feature3" variant="new"/> -> hidden
*/
```
## License	