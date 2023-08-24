<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "GoView",
  components: { iFrame },
  data() {
    return {
      url: "http://106.14.105.101:5173"
    };
  },
};
</script>
