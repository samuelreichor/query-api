<template>
  <h3>
    Not Implemented {{ $attrs.type ? 'Component' : 'Page' }}:
    {{ $attrs.type ? $attrs.type : $attrs.sectionHandle }}
  </h3>
  <pre>
    {{ $attrs }}
  </pre>
</template>
