<script>
  const props = $props()
  const label = props.type ? 'Component' : 'Page'
  const name = props.type ?? props.sectionHandle
</script>

<h3>Not Implemented {label}: {name}</h3>
<pre>{JSON.stringify(props, null, 2)}</pre>
