# vue-feature-toggle

> Enables advanced feature-toggle with vue

[![npm version](https://img.shields.io/npm/v/vue-feature-toggle.svg)](https://www.npmjs.com/package/vue-feature-toggle)
[![npm downloads](https://img.shields.io/npm/dt/vue-feature-toggle.svg)](https://www.npmjs.com/package/vue-feature-toggle)
[![npm downloads](https://img.shields.io/github/license/mashape/apistatus.svg)](https://www.npmjs.com/package/vue-feature-toggle)

## Info
Vue-Feature-Toggle implements the [feature-toggle-api](https://www.npmjs.com/package/feature-toggle-api) v 3.4.1".
Only a subset of features is listed here. For the others, watch the documentation of the api.

This package is COMPATIBLE WITH VUE3!!!!!
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
        <left-nav-new></left-nav-new>
    -->
    <left-nav></left-nav>

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
But that's not the point. The problem is: The view-logic is spread in .html and .js files and if the viewlogic changes, you have to change at least them. And all visibility rules are spread over the whole system.
That's not good.

## The solution
Feature-toggle. All View-Logic is placed in one place. This can be a config file, a webservice or a tool with a User Interface.a
When you want to change a visibility rule, for example "Show feature XYZ also in the french shop", you just have to update the config or add this info in an UI. And no developer is needed for it.

<a href="https://martinfowler.com/articles/feature-toggles.html">Read the article from Martin Fowler about feature toggle for a more understanding.</a>

## The Usage
Look in the example folder for working examples.

### Initialisation
Create a vue project. For example with the vue-cli.
``` shell
    npm install -g vue-cli
    vue create vue-feature-toggle-example
    cd vue-feature-toggle-example
    npm install
```
Now install the vue-feature-toggle component. 
``` shell
    npm install vue-feature-toggle --save
```
Replace the App.vue - file with the following:
``` html
<template>
  <div>
        <h1>We test vue-feature-toggle in vue2</h1>
    <!-- The name property is required -->
        <feature name="feature1">This is "Feature1"</feature>
        
        <!-- The variant property is optional and can be any string -->
        <feature name="feature2">This is "Feature2"</feature>
        <feature name="feature2" variant="new">This is "Feature2" with variant "new"</feature>
        <feature name="feature2" variant="old">This "Feature2" with variant "old"</feature>
        <feature name="feature2" variant="grumpfel">This "Feature2" with variant "grumpfel"</feature>
        
        <feature name="feature3" variant="old" data="grumpfel">This "Feature3" with variant "old" has some Data.</feature>
        <feature name="feature3" variant="new" :data="{'text':'grumpfel'}">This "Feature3" with variant "old" has some Data. (watch the : before the data-attribute. Otherwise you'll get this as a string...)</feature>
  </div>
</template>

<script>
import { FeatureToggleComponent } from 'vue-feature-toggle';

//All Feature2-Features will always be shown
FeatureToggleComponent.visibility('feature2',true);
FeatureToggleComponent.visibility('feature2','new',false); 

export default {
  name: 'app',
  components: {
    feature: FeatureToggleComponent
  }
}
</script>
```

#### Other initialisations
In a cjs-project
```javascript
    const { FeatureToggleComponent } = require('vue-feature-toggle/dist/vue-feature-toggle.umd.js')
   // do sth with the FeatureToggleComponent
```
In the browser
```html
    <script src="https://unpkg.com/vue"></script>
    <!--Important: you can find .umd-Version in the dist-folder of this package -->
    <script src=".path/to/vue-feature-toggle/dist/vue-feature-toggle.umd.min.js"></script>
    <script>
        var feature = window.FeatureToggleComponent;

        //do sth with the FeatureToggleComponent
    </script>
```
See more the projects in the [example-folder](https://github.com/bassdman/vue-feature-toggle/tree/master/examples).

### Features
[Only a subset of features is listed here. See the documentation of the feature-toggle-api for more features](https://www.npmjs.com/package/feature-toggle-api)

For the next examples we will always use the HTML from above. Just insert the visibility rules under the other rule

#### Basic visibility
```javascript
// shows Feature1
//Feature2 is not configured, so it will be hidden
feature.visibility('feature1',true);

//You can also write it like this
feature.visibility('feature1',function (rule) {
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
feature.visibility('feature2', function (rule) {
        return true;
});

/*
    This overwrites the rule above for "feature2", variant "new"    
    <feature name="feature2"/> -> shown
    <feature name="feature2" variant="new"/> -> hidden
    <feature name="feature2" variant="old"/> -> shown
    <feature name="feature2" variant="grumpfel"/> -> shown
*/
feature.visibility('feature2','new', function (rule) {
        return false;
});
```
```javascript
/*
You can pass data via the data-attribute. Corresp. HTML-Tag: <feature name="feature3" :data="grumpfel"/>
*/
feature.visibility('feature3','new', function (rule) {
      return rule.data == "grumpfel";
});

//Write a : before the data-tag to parse the content in the data-attribute <feature name="feature3" :data="{'text':'grumpfel'"/> Otherwise the data is returned as a string.
feature.visibility('feature3','new', function (rule) {
      return rule.data.text == "grumpfel";
});
```
#### Default Visibility
Bored of writing the same visibility rule again and again? Use defaultVisibility. This is the default-rule and will be overwritten by feature.visibility() - rules.
``` javascript
feature.defaultVisibility(function(rule){
    return true;
});

feature.visibility('feature2', 'new', function(rule){
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

feature.requiredVisibility(function(rule){
    //In this case it returns true, when name == 'feature2'
    return globalConfig[rule.name] === true;
});

/*
  feature2, variant "new" returns false, but requiredConfig returns true. Both rules must match, so it will be hidden
*/
feature.visibility('feature2','new',function(rule){
    return false;
});

/*
  feature3 returns true, but requiredConfig returns false. Both rules must match, so Feature3 is hidden
*/
feature.visibility('feature3',function(rule){
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

#### Container Tag
Normally a feature has a div-element as root-element.
```html
    <feature name="anAmazingFeature">an amazing feature</feature>
    will be rendered to (if visible):
    <div>an amazing feature</div>
```
But unfortunately sometimes div-elements are already styled by legacy-css-classes.
To prevent this, you can define the root-element.
```html
    <feature name="anAmazingFeature" tag="span">an amazing feature</feature>
    will be rendered to (if visible):
    <span>an amazing feature</span>
```

#### ShowLogs
Imagine this following html-snippet:
```html
    <!-- Why is this ******* feature hidden? I checked the visibilityrule. It should be visible... -->
    <feature name="anAmazingFeature">This feature should be shown</feature>
```
All developers of the world agree with you, debugging sth lik this is horrible. But don't worry, we have a perfect solution for it. And it's just one line of code.
```javascript
feature.showLogs(); //or feature.showLogs(true);
```
This returns a log like the following:
```html
Check Visibility of Feature "anAmazingFeature".
The requiredVisibility rule returns false. This feature will be hidden.

Check Visibility of Feature "anotherAmazingFeature", variant "new" with data {"id":"bla"}.
The requiredVisibility rule returns true. This feature will be shown when no other rule rejects it.
No visibility rule found matching name and variant.
No rules found for name anotherAmazingFeature without variants.
No default rule found.
Only the requiredVisibility rule was found. This returned true. => This feature will be visible.
```
With this you don't have to waste your time with debugging the visibility state. 

#### Log
Log a custom message, when showLogs() == true.
```javascript
feature.log("Here's my custom message");
```

#### Noscript
You work in a company and your customers have disabled javascript? Well, that makes life harder but we can still use it. We can provide at least a basic functionality with pure css.
Just look at the modified index.html file.
``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>vue-feature-example</title>
   <style type="text/css">
   /*Hides all features by default. When javascript is enabled, this attribute is overwritten*/
    feature{
      display:none;
    }

    /*Shows all features with noscript attribute*/
    feature[noscript="noscript"], feature[noscript="true"]{
      display:block;
    }
    </style>
</head>

<body>
  <div id="app">
        <feature name="feature1">This is hidden without javascript</feature>
        
        <feature name="feature2" noscript="noscript">This is shown without javascript.</feature>
        <feature name="feature2" variant="new" noscript="true">This is shown without javascript.</feature>
  </div>
  <script src="dist/build.js"></script>
</body>
</html>
```
## License	
<a href="https://opensource.org/licenses/MIT">MIT</a>.
Copyright (c) 2018 Manuel Gelsen
