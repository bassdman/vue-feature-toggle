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
import { FeatureToggleComponent as feature } from 'vue-feature-toggle';

//All Feature2-Features will always be shown
feature.visibility('feature2',true);
feature.visibility('feature2','new',false); 

//Feature.showLogs();
export default {
  name: 'app',
  components: {
    feature
  }
}
</script>