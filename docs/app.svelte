<script>
  import { getColorForString } from "./../src"

  $: value = ""
  $: color = `rgb(${getColorForString(value).join(',')})`

</script>

<div style="background: {color}">
  <h2>{color}</h2>
  <input
    type="text"
    bind:value={value}
    placeholder="Type here to see the background change..."
  />
</div>
