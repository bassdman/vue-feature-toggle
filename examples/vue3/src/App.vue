<script setup lang="ts">
import {ref} from 'vue';
import feature from 'vue-feature-toggle';

//All Feature2-Features will always be shown
feature.setFlag('feature2',false);
feature.setFlag('feature2','new',true);
//Feature.showLogs();

const featurex = ref('abcd');

</script>

<template>
  <h1>We test vue-feature-toggle in vue3</h1>
  <!-- The name property is required -->
    <div>
      <input v-model="featurex">"{{featurex}}"
    </div>
     <feature name="featurex">This is a dynamic feature</feature>
      <feature name="feature1">This is "Feature1"</feature>
      
      <!-- The variant property is optional and can be any string -->
      <feature name="feature2">This is "Feature2"</feature>
      <feature name="feature2" variant="new">This is "Feature2" with variant "new"</feature>
      <feature name="feature2" variant="old">This "Feature2" with variant "old"</feature>
      <feature name="feature2" variant="grumpfel">This "Feature2" with variant "grumpfel"</feature>
      
      <feature name="feature3" variant="old" data="grumpfel">This "Feature3" with variant "old" has some Data.</feature>
      <feature name="feature3" variant="new" :data="{'text':'grumpfel'}">This "Feature3" with variant "old" has some Data. (watch the : before the data-attribute. Otherwise you'll get this as a string...)</feature>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
