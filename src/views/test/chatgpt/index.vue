<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "Chatgpt",
  components: { iFrame },
  data() {
    return {
      url: "https://chatgpt.roydon.cc"
    };
  },
};
</script>
