<template>
  <div class="editor-wrapper">
   
    <div id="editor"></div>

  </div>
</template>


<script>

  import BlazeEditor from '@/BlazeEditor'

export default {
  name: 'Editor',
  data() {
    return {
      editor: null,
      file: {
        blocks: []
      }
    }
  },
  mounted() {
    this.editor = new BlazeEditor("editor")
    this.editor.load();

  },
  methods: {
    createEditor() {

    }
  }
}
</script>

<style lang="scss" scoped>
.editor-wrapper {
  @apply h-screen w-screen bg-neutral-200;
  #editor {
    @apply h-full w-full;
  }
}
</style>