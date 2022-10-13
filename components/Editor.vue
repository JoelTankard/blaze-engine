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
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
.editor-wrapper {
  font-family: 'Inter Tight', sans-serif;

  @apply h-screen w-screen bg-slate-200;
  #editor {
    @apply h-full w-full;
  }
}
</style>